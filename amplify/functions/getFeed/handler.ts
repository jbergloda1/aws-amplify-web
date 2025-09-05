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
    const { limit = 20, nextToken } = event.arguments;
    const userId = event.identity?.sub;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get user's following list
    const following = await client.models.Follow.list({
      filter: { followerId: { eq: userId } },
    });

    const followingIds = following.data.map((follow) => follow.followingId);

    // If user follows no one, get public posts from all users
    let posts;
    if (followingIds.length === 0) {
      posts = await client.models.Post.list({
        filter: { isPublic: { eq: true } },
        limit,
        nextToken,
      });
    } else {
      // Get posts from followed users
      posts = await client.models.Post.list({
        filter: {
          and: [
            { isPublic: { eq: true } },
            { authorId: { in: followingIds } },
          ],
        },
        limit,
        nextToken,
      });
    }

    // Sort posts by published date (newest first)
    const sortedPosts = posts.data.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt);
      const dateB = new Date(b.publishedAt || b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    return sortedPosts;
  } catch (error) {
    console.error("Error getting feed:", error);
    throw new Error(`Failed to get feed: ${error.message}`);
  }
};
