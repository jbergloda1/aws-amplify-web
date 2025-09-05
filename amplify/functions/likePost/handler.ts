import type { Handler } from "aws-lambda";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../data/resource";

// Configure Amplify
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT!,
      region: process.env.AWS_REGION!,
      defaultAuthMode: "userPool",
    },
  },
});

const client = generateClient<Schema>();

export const handler: Handler = async (event) => {
  console.log("Event: ", JSON.stringify(event, null, 2));

  try {
    const { postId } = event.arguments;
    const userId = event.identity?.sub;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if already liked
    const existingLike = await client.models.Like.list({
      filter: {
        and: [
          { userId: { eq: userId } },
          { postId: { eq: postId } },
        ],
      },
    });

    if (existingLike.data.length > 0) {
      // Unlike the post
      await client.models.Like.delete({ id: existingLike.data[0].id });

      // Decrease like count
      await client.models.Post.update({
        id: postId,
        likesCount: { decrement: 1 },
      });

      return { id: existingLike.data[0].id, isLiked: false };
    } else {
      // Like the post
      const like = await client.models.Like.create({
        userId,
        postId,
      });

      // Increase like count
      await client.models.Post.update({
        id: postId,
        likesCount: { increment: 1 },
      });

      // Get post author for notification
      const post = await client.models.Post.get({ id: postId });
      if (post.data && post.data.authorId !== userId) {
        // Create notification for post author
        await client.models.Notification.create({
          type: "like",
          title: "Post liked",
          message: "Someone liked your post",
          userId: post.data.authorId,
          relatedUserId: userId,
          relatedPostId: postId,
        });
      }

      return { ...like.data, isLiked: true };
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw new Error(`Failed to like post: ${error.message}`);
  }
};
