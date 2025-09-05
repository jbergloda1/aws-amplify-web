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
    const { followingId } = event.arguments;
    const followerId = event.identity?.sub;

    if (!followerId) {
      throw new Error("User not authenticated");
    }

    if (followerId === followingId) {
      throw new Error("Cannot follow yourself");
    }

    // Check if already following
    const existingFollow = await client.models.Follow.list({
      filter: {
        and: [
          { followerId: { eq: followerId } },
          { followingId: { eq: followingId } },
        ],
      },
    });

    if (existingFollow.data.length > 0) {
      throw new Error("Already following this user");
    }

    // Create the follow relationship
    const follow = await client.models.Follow.create({
      followerId,
      followingId,
    });

    // Update follower's following count
    await client.models.User.update({
      id: followerId,
      followingCount: { increment: 1 },
    });

    // Update following user's followers count
    await client.models.User.update({
      id: followingId,
      followersCount: { increment: 1 },
    });

    // Create notification for the followed user
    await client.models.Notification.create({
      type: "follow",
      title: "New follower",
      message: "Someone started following you",
      userId: followingId,
      relatedUserId: followerId,
    });

    return follow.data;
  } catch (error) {
    console.error("Error following user:", error);
    throw new Error(`Failed to follow user: ${error.message}`);
  }
};
