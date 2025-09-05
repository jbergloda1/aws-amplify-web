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
    const { userId } = event.arguments;

    // Get user's posts
    const posts = await client.models.Post.list({
      filter: { authorId: { eq: userId } },
    });

    // Get user's followers
    const followers = await client.models.Follow.list({
      filter: { followingId: { eq: userId } },
    });

    // Get user's following
    const following = await client.models.Follow.list({
      filter: { followerId: { eq: userId } },
    });

    // Get user's likes
    const likes = await client.models.Like.list({
      filter: { userId: { eq: userId } },
    });

    // Calculate engagement metrics
    const totalLikes = posts.data.reduce((sum, post) => sum + (post.likesCount || 0), 0);
    const totalComments = posts.data.reduce((sum, post) => sum + (post.commentsCount || 0), 0);
    const totalShares = posts.data.reduce((sum, post) => sum + (post.sharesCount || 0), 0);
    const totalViews = posts.data.reduce((sum, post) => sum + (post.viewsCount || 0), 0);

    // Calculate engagement rate
    const totalEngagement = totalLikes + totalComments + totalShares;
    const engagementRate = posts.data.length > 0 ? (totalEngagement / posts.data.length) : 0;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentPosts = posts.data.filter((post) => {
      const postDate = new Date(post.publishedAt || post.createdAt);
      return postDate >= thirtyDaysAgo;
    });

    // Get top performing posts
    const topPosts = posts.data
      .sort((a, b) => {
        const engagementA = (a.likesCount || 0) + (a.commentsCount || 0) + (a.sharesCount || 0);
        const engagementB = (b.likesCount || 0) + (b.commentsCount || 0) + (b.sharesCount || 0);
        return engagementB - engagementA;
      })
      .slice(0, 5);

    return {
      user: {
        id: userId,
        postsCount: posts.data.length,
        followersCount: followers.data.length,
        followingCount: following.data.length,
        likesGiven: likes.data.length,
      },
      engagement: {
        totalLikes,
        totalComments,
        totalShares,
        totalViews,
        totalEngagement,
        engagementRate: Math.round(engagementRate * 100) / 100,
      },
      activity: {
        recentPostsCount: recentPosts.length,
        topPosts: topPosts.map((post) => ({
          id: post.id,
          content: post.content.substring(0, 100) + (post.content.length > 100 ? "..." : ""),
          likesCount: post.likesCount || 0,
          commentsCount: post.commentsCount || 0,
          sharesCount: post.sharesCount || 0,
          publishedAt: post.publishedAt || post.createdAt,
        })),
      },
      growth: {
        followersGrowth: 0, // This would need historical data
        engagementGrowth: 0, // This would need historical data
      },
    };
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw new Error(`Failed to get user stats: ${error.message}`);
  }
};
