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
    const { content, mediaUrls, hashtags, mentions, location, isPublic } = event.arguments;
    const userId = event.identity?.sub;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Extract hashtags from content if not provided
    const extractedHashtags = hashtags || extractHashtags(content);
    const extractedMentions = mentions || extractMentions(content);

    // Create the post
    const post = await client.models.Post.create({
      content,
      mediaUrls: mediaUrls || [],
      hashtags: extractedHashtags,
      mentions: extractedMentions,
      location,
      isPublic: isPublic ?? true,
      authorId: userId,
      publishedAt: new Date().toISOString(),
    });

    // Update user's post count
    await client.models.User.update({
      id: userId,
      postsCount: { increment: 1 },
    });

    // Create notifications for mentioned users
    if (extractedMentions.length > 0) {
      await createMentionNotifications(extractedMentions, post.data!.id, userId);
    }

    return post.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

function extractHashtags(content: string): string[] {
  const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
  return content.match(hashtagRegex) || [];
}

function extractMentions(content: string): string[] {
  const mentionRegex = /@[\w\u0590-\u05ff]+/g;
  return content.match(mentionRegex) || [];
}

async function createMentionNotifications(mentions: string[], postId: string, authorId: string) {
  try {
    // Get mentioned users
    const mentionedUsers = await Promise.all(
      mentions.map(async (mention) => {
        const username = mention.substring(1); // Remove @
        const users = await client.models.User.list({
          filter: { username: { eq: username } },
        });
        return users.data[0];
      })
    );

    // Create notifications for mentioned users
    const notifications = mentionedUsers
      .filter((user) => user && user.id !== authorId)
      .map((user) => ({
        type: "mention" as const,
        title: "You were mentioned in a post",
        message: `You were mentioned in a post`,
        userId: user!.id,
        relatedUserId: authorId,
        relatedPostId: postId,
      }));

    if (notifications.length > 0) {
      await Promise.all(
        notifications.map((notification) =>
          client.models.Notification.create(notification)
        )
      );
    }
  } catch (error) {
    console.error("Error creating mention notifications:", error);
  }
}
