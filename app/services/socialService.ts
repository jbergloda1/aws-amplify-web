import { generateClient } from "aws-amplify/data";
import { uploadData, getUrl } from "aws-amplify/storage";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

// Helper function to check if client is ready
const isClientReady = () => {
  return client && typeof client === 'object';
};

export class SocialService {
  // User Management
  static async createUser(userData: {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
  }) {
    return await client.models.User.create(userData);
  }

  static async updateUser(userId: string, updates: Partial<Schema["User"]["type"]>) {
    return await client.models.User.update({
      id: userId,
      ...updates,
    });
  }

  static async getUser(userId: string) {
    return await client.models.User.get({ id: userId });
  }

  static async searchUsers(query: string) {
    return await client.models.User.list({
      filter: {
        or: [
          { username: { contains: query } },
          { firstName: { contains: query } },
          { lastName: { contains: query } },
        ],
      },
    });
  }

  // Post Management
  static async createPost(postData: {
    content: string;
    mediaUrls?: string[];
    hashtags?: string[];
    mentions?: string[];
    location?: string;
    isPublic?: boolean;
  }) {
    try {
      if (!isClientReady()) {
        throw new Error('Client not ready');
      }
      return await client.mutations.createPost(postData);
    } catch (error) {
      console.error('Error creating post:', error);
      // Fallback to direct model creation
      return await client.models.Post.create({
        ...postData,
        authorId: 'temp-user-id', // This should be replaced with actual user ID
      });
    }
  }

  static async getPost(postId: string) {
    return await client.models.Post.get({ id: postId });
  }

  static async getFeed(limit = 20, nextToken?: string) {
    try {
      if (!isClientReady()) {
        throw new Error('Client not ready');
      }
      return await client.queries.getFeed({ limit, nextToken });
    } catch (error) {
      console.error('Error getting feed:', error);
      // Fallback to direct model query
      return await client.models.Post.list({
        filter: { isPublic: { eq: true } },
        limit,
      });
    }
  }

  static async getUserPosts(userId: string, limit = 20) {
    return await client.models.Post.list({
      filter: { authorId: { eq: userId } },
      limit,
    });
  }

  static async deletePost(postId: string) {
    return await client.models.Post.delete({ id: postId });
  }

  // Social Interactions
  static async followUser(followingId: string) {
    try {
      if (!isClientReady()) {
        throw new Error('Client not ready');
      }
      return await client.mutations.followUser({ followingId });
    } catch (error) {
      console.error('Error following user:', error);
      // Fallback to direct model creation
      return await client.models.Follow.create({
        followerId: 'temp-user-id', // This should be replaced with actual user ID
        followingId,
      });
    }
  }

  static async unfollowUser(followingId: string) {
    const follows = await client.models.Follow.list({
      filter: { followingId: { eq: followingId } },
    });
    
    if (follows.data.length > 0) {
      return await client.models.Follow.delete({ id: follows.data[0].id });
    }
  }

  static async likePost(postId: string) {
    try {
      if (!isClientReady()) {
        throw new Error('Client not ready');
      }
      return await client.mutations.likePost({ postId });
    } catch (error) {
      console.error('Error liking post:', error);
      // Fallback to direct model creation
      return await client.models.Like.create({
        userId: 'temp-user-id', // This should be replaced with actual user ID
        postId,
      });
    }
  }

  static async getLikes(postId: string) {
    return await client.models.Like.list({
      filter: { postId: { eq: postId } },
    });
  }

  // Comments
  static async createComment(commentData: {
    content: string;
    postId: string;
    parentCommentId?: string;
    mediaUrls?: string[];
  }) {
    return await client.models.Comment.create(commentData);
  }

  static async getComments(postId: string) {
    return await client.models.Comment.list({
      filter: { postId: { eq: postId } },
    });
  }

  static async deleteComment(commentId: string) {
    return await client.models.Comment.delete({ id: commentId });
  }

  // Notifications
  static async getNotifications(userId: string, limit = 20) {
    try {
      if (!isClientReady()) {
        throw new Error('Client not ready');
      }
      return await client.models.Notification.list({
        filter: { userId: { eq: userId } },
        limit,
      });
    } catch (error) {
      console.error('Error getting notifications:', error);
      // Return empty array as fallback
      return { data: [] };
    }
  }

  static async markNotificationAsRead(notificationId: string) {
    return await client.models.Notification.update({
      id: notificationId,
      isRead: true,
    });
  }

  static async markAllNotificationsAsRead(userId: string) {
    const notifications = await client.models.Notification.list({
      filter: { 
        and: [
          { userId: { eq: userId } },
          { isRead: { eq: false } }
        ]
      },
    });

    return await Promise.all(
      notifications.data.map(notification =>
        client.models.Notification.update({
          id: notification.id,
          isRead: true,
        })
      )
    );
  }

  // Messages
  static async createConversation(participantIds: string[], type: 'direct' | 'group' = 'direct') {
    return await client.models.Conversation.create({
      type,
      participantId: participantIds[0], // This would need to be updated for group chats
    });
  }

  static async getConversations(userId: string) {
    return await client.models.Conversation.list({
      filter: { participantId: { eq: userId } },
    });
  }

  static async sendMessage(messageData: {
    content: string;
    conversationId: string;
    messageType?: 'text' | 'image' | 'video' | 'file';
    mediaUrls?: string[];
    replyToMessageId?: string;
  }) {
    return await client.models.Message.create(messageData);
  }

  static async getMessages(conversationId: string, limit = 50) {
    return await client.models.Message.list({
      filter: { conversationId: { eq: conversationId } },
      limit,
    });
  }

  // Social Media Integration
  static async connectSocialAccount(accountData: {
    platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok';
    username: string;
    accountId: string;
    accessToken: string;
    refreshToken?: string;
    userId: string;
  }) {
    return await client.models.SocialAccount.create(accountData);
  }

  static async getSocialAccounts(userId: string) {
    return await client.models.SocialAccount.list({
      filter: { userId: { eq: userId } },
    });
  }

  static async schedulePost(postData: {
    content: string;
    mediaUrls?: string[];
    scheduledAt: string;
    platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok';
    socialAccountId: string;
    userId: string;
  }) {
    return await client.models.ScheduledPost.create(postData);
  }

  static async getScheduledPosts(userId: string) {
    return await client.models.ScheduledPost.list({
      filter: { userId: { eq: userId } },
    });
  }

  // Analytics
  static async getUserStats(userId: string) {
    try {
      if (!isClientReady()) {
        throw new Error('Client not ready');
      }
      return await client.queries.getUserStats({ userId });
    } catch (error) {
      console.error('Error getting user stats:', error);
      // Return mock data as fallback
      return {
        data: {
          user: {
            id: userId,
            postsCount: 0,
            followersCount: 0,
            followingCount: 0,
            likesGiven: 0,
          },
          engagement: {
            totalLikes: 0,
            totalComments: 0,
            totalShares: 0,
            totalViews: 0,
            totalEngagement: 0,
            engagementRate: 0,
          },
          activity: {
            recentPostsCount: 0,
            topPosts: [],
          },
          growth: {
            followersGrowth: 0,
            engagementGrowth: 0,
          },
        }
      };
    }
  }

  static async trackVisitor(visitorData: {
    sessionId: string;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    country?: string;
    city?: string;
    device?: string;
    browser?: string;
    os?: string;
    referrer?: string;
    page: string;
    timeOnPage?: number;
  }) {
    try {
      if (!isClientReady()) {
        throw new Error('Client not ready');
      }
      return await client.mutations.trackVisitor(visitorData);
    } catch (error) {
      console.error('Error tracking visitor via mutation:', error);
      // Fallback to direct model creation
      try {
        return await client.models.VisitorAnalytics.create({
          ...visitorData,
          timestamp: new Date().toISOString(),
          isNewVisitor: true,
          isReturningVisitor: false,
        });
      } catch (fallbackError) {
        console.error('Error creating visitor analytics record:', fallbackError);
        // Return a mock response to prevent app crashes
        return {
          data: {
            id: `visitor_${Date.now()}`,
            ...visitorData,
            timestamp: new Date().toISOString(),
          }
        };
      }
    }
  }

  static async getVisitorAnalytics(userId?: string, limit = 100) {
    try {
      if (!isClientReady()) {
        throw new Error('Client not ready');
      }
      const filter = userId ? { userId: { eq: userId } } : undefined;
      return await client.models.VisitorAnalytics.list({
        filter,
        limit,
      });
    } catch (error) {
      console.error('Error getting visitor analytics:', error);
      // Return empty array as fallback
      return { data: [] };
    }
  }

  // File Upload
  static async uploadFile(file: File, path: string) {
    try {
      const result = await uploadData({
        key: path,
        data: file,
        options: {
          accessLevel: 'public',
        },
      }).result;
      
      return result.key;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  static async getFileUrl(key: string) {
    try {
      const result = await getUrl({
        key,
        options: {
          accessLevel: 'public',
        },
      });
      
      return result.url.toString();
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }

  // Real-time Subscriptions
  static subscribeToPosts(callback: (post: Schema["Post"]["type"]) => void) {
    try {
      if (!isClientReady() || !client?.subscriptions?.onPostCreated) {
        console.warn('Post subscription not available - client not ready');
        return { unsubscribe: () => {} };
      }
      return client.subscriptions.onPostCreated.subscribe({
        next: (data) => callback(data),
        error: (error) => console.error('Post subscription error:', error),
      });
    } catch (error) {
      console.error('Error setting up post subscription:', error);
      return { unsubscribe: () => {} };
    }
  }

  static subscribeToComments(callback: (comment: Schema["Comment"]["type"]) => void) {
    try {
      if (!isClientReady() || !client?.subscriptions?.onCommentCreated) {
        console.warn('Comment subscription not available - client not ready');
        return { unsubscribe: () => {} };
      }
      return client.subscriptions.onCommentCreated.subscribe({
        next: (data) => callback(data),
        error: (error) => console.error('Comment subscription error:', error),
      });
    } catch (error) {
      console.error('Error setting up comment subscription:', error);
      return { unsubscribe: () => {} };
    }
  }

  static subscribeToLikes(callback: (like: Schema["Like"]["type"]) => void) {
    try {
      if (!isClientReady() || !client?.subscriptions?.onLikeCreated) {
        console.warn('Like subscription not available - client not ready');
        return { unsubscribe: () => {} };
      }
      return client.subscriptions.onLikeCreated.subscribe({
        next: (data) => callback(data),
        error: (error) => console.error('Like subscription error:', error),
      });
    } catch (error) {
      console.error('Error setting up like subscription:', error);
      return { unsubscribe: () => {} };
    }
  }

  static subscribeToNotifications(userId: string, callback: (notification: Schema["Notification"]["type"]) => void) {
    try {
      if (!isClientReady() || !client?.subscriptions?.onNotificationCreated) {
        console.warn('Notification subscription not available - client not ready');
        return { unsubscribe: () => {} };
      }
      return client.subscriptions.onNotificationCreated.subscribe({
        filter: { userId: { eq: userId } },
        next: (data) => callback(data),
        error: (error) => console.error('Notification subscription error:', error),
      });
    } catch (error) {
      console.error('Error setting up notification subscription:', error);
      return { unsubscribe: () => {} };
    }
  }

  static subscribeToMessages(conversationId: string, callback: (message: Schema["Message"]["type"]) => void) {
    try {
      if (!isClientReady() || !client?.subscriptions?.onMessageCreated) {
        console.warn('Message subscription not available - client not ready');
        return { unsubscribe: () => {} };
      }
      return client.subscriptions.onMessageCreated.subscribe({
        filter: { conversationId: { eq: conversationId } },
        next: (data) => callback(data),
        error: (error) => console.error('Message subscription error:', error),
      });
    } catch (error) {
      console.error('Error setting up message subscription:', error);
      return { unsubscribe: () => {} };
    }
  }

  static subscribeToVisitorAnalytics(callback: (visitor: Schema["VisitorAnalytics"]["type"]) => void) {
    try {
      if (!isClientReady() || !client?.subscriptions?.onVisitorAnalyticsCreated) {
        console.warn('Visitor analytics subscription not available - client not ready');
        return { unsubscribe: () => {} };
      }
      return client.subscriptions.onVisitorAnalyticsCreated.subscribe({
        next: (data) => callback(data),
        error: (error) => console.error('Visitor analytics subscription error:', error),
      });
    } catch (error) {
      console.error('Error setting up visitor analytics subscription:', error);
      return { unsubscribe: () => {} };
    }
  }
}
