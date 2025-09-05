import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

// Social Network Service Backend Schema
const schema = a.schema({
  // User Profile Model
  User: a
    .model({
      username: a.string().required(),
      email: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      bio: a.string(),
      avatar: a.string(),
      coverImage: a.string(),
      website: a.string(),
      location: a.string(),
      birthDate: a.date(),
      isVerified: a.boolean().default(false),
      isPrivate: a.boolean().default(false),
      followersCount: a.integer().default(0),
      followingCount: a.integer().default(0),
      postsCount: a.integer().default(0),
      lastActiveAt: a.datetime(),
      preferences: a.json(),
      socialLinks: a.json(),
      // Relations
      posts: a.hasMany('Post', 'authorId'),
      comments: a.hasMany('Comment', 'authorId'),
      likes: a.hasMany('Like', 'userId'),
      follows: a.hasMany('Follow', 'followerId'),
      followers: a.hasMany('Follow', 'followingId'),
      notifications: a.hasMany('Notification', 'userId'),
      messages: a.hasMany('Message', 'senderId'),
      conversations: a.hasMany('Conversation', 'participantId'),
    })
    .authorization(allow => [
      allow.owner(),
      allow.publicApiKey().to(['read']),
    ]),

  // Post Model
  Post: a
    .model({
      content: a.string().required(),
      mediaUrls: a.string().array(),
      mediaType: a.enum(['text', 'image', 'video', 'link']),
      linkPreview: a.json(),
      hashtags: a.string().array(),
      mentions: a.string().array(),
      location: a.string(),
      isPublic: a.boolean().default(true),
      isPinned: a.boolean().default(false),
      scheduledAt: a.datetime(),
      publishedAt: a.datetime(),
      likesCount: a.integer().default(0),
      commentsCount: a.integer().default(0),
      sharesCount: a.integer().default(0),
      viewsCount: a.integer().default(0),
      authorId: a.id().required(),
      // Relations
      author: a.belongsTo('User', 'authorId'),
      comments: a.hasMany('Comment', 'postId'),
      likes: a.hasMany('Like', 'postId'),
      shares: a.hasMany('Share', 'postId'),
    })
    .authorization(allow => [
      allow.owner(),
      allow.publicApiKey().to(['read']),
    ]),

  // Comment Model
  Comment: a
    .model({
      content: a.string().required(),
      mediaUrls: a.string().array(),
      likesCount: a.integer().default(0),
      repliesCount: a.integer().default(0),
      authorId: a.id().required(),
      postId: a.id().required(),
      parentCommentId: a.id(),
      // Relations
      author: a.belongsTo('User', 'authorId'),
      post: a.belongsTo('Post', 'postId'),
      parentComment: a.belongsTo('Comment', 'parentCommentId'),
      replies: a.hasMany('Comment', 'parentCommentId'),
      likes: a.hasMany('Like', 'commentId'),
    })
    .authorization(allow => [
      allow.owner(),
      allow.publicApiKey().to(['read']),
    ]),

  // Like Model
  Like: a
    .model({
      userId: a.id().required(),
      postId: a.id(),
      commentId: a.id(),
      // Relations
      user: a.belongsTo('User', 'userId'),
      post: a.belongsTo('Post', 'postId'),
      comment: a.belongsTo('Comment', 'commentId'),
    })
    .authorization(allow => [
      allow.owner(),
      allow.publicApiKey().to(['read']),
    ]),

  // Follow Model
  Follow: a
    .model({
      followerId: a.id().required(),
      followingId: a.id().required(),
      // Relations
      follower: a.belongsTo('User', 'followerId'),
      following: a.belongsTo('User', 'followingId'),
    })
    .authorization(allow => [
      allow.owner(),
      allow.publicApiKey().to(['read']),
    ]),

  // Share Model
  Share: a
    .model({
      userId: a.id().required(),
      postId: a.id().required(),
      content: a.string(),
      // Relations
      user: a.belongsTo('User', 'userId'),
      post: a.belongsTo('Post', 'postId'),
    })
    .authorization(allow => [
      allow.owner(),
      allow.publicApiKey().to(['read']),
    ]),

  // Notification Model
  Notification: a
    .model({
      type: a.enum(['like', 'comment', 'follow', 'mention', 'share', 'system']),
      title: a.string().required(),
      message: a.string().required(),
      isRead: a.boolean().default(false),
      userId: a.id().required(),
      relatedUserId: a.id(),
      relatedPostId: a.id(),
      relatedCommentId: a.id(),
      metadata: a.json(),
      // Relations
      user: a.belongsTo('User', 'userId'),
    })
    .authorization(allow => [
      allow.owner(),
    ]),

  // Conversation Model
  Conversation: a
    .model({
      type: a.enum(['direct', 'group']),
      name: a.string(),
      description: a.string(),
      avatar: a.string(),
      isActive: a.boolean().default(true),
      lastMessageAt: a.datetime(),
      lastMessageId: a.id(),
      participantId: a.id().required(),
      // Relations
      participant: a.belongsTo('User', 'participantId'),
      messages: a.hasMany('Message', 'conversationId'),
    })
    .authorization(allow => [
      allow.owner(),
    ]),

  // Message Model
  Message: a
    .model({
      content: a.string().required(),
      mediaUrls: a.string().array(),
      messageType: a.enum(['text', 'image', 'video', 'file', 'system']),
      isRead: a.boolean().default(false),
      readAt: a.datetime(),
      senderId: a.id().required(),
      conversationId: a.id().required(),
      replyToMessageId: a.id(),
      // Relations
      sender: a.belongsTo('User', 'senderId'),
      conversation: a.belongsTo('Conversation', 'conversationId'),
      replyToMessage: a.belongsTo('Message', 'replyToMessageId'),
    })
    .authorization(allow => [
      allow.owner(),
    ]),

  // Social Media Account Model
  SocialAccount: a
    .model({
      platform: a.enum(['twitter', 'instagram', 'facebook', 'linkedin', 'youtube', 'tiktok']),
      username: a.string().required(),
      accountId: a.string().required(),
      accessToken: a.string(),
      refreshToken: a.string(),
      isActive: a.boolean().default(true),
      followersCount: a.integer().default(0),
      followingCount: a.integer().default(0),
      postsCount: a.integer().default(0),
      lastSyncAt: a.datetime(),
      metadata: a.json(),
      userId: a.id().required(),
      // Relations
      user: a.belongsTo('User', 'userId'),
      scheduledPosts: a.hasMany('ScheduledPost', 'socialAccountId'),
    })
    .authorization(allow => [
      allow.owner(),
    ]),

  // Scheduled Post Model
  ScheduledPost: a
    .model({
      content: a.string().required(),
      mediaUrls: a.string().array(),
      scheduledAt: a.datetime().required(),
      publishedAt: a.datetime(),
      status: a.enum(['scheduled', 'published', 'failed', 'cancelled']),
      platform: a.enum(['twitter', 'instagram', 'facebook', 'linkedin', 'youtube', 'tiktok']),
      socialAccountId: a.id().required(),
      userId: a.id().required(),
      errorMessage: a.string(),
      // Relations
      socialAccount: a.belongsTo('SocialAccount', 'socialAccountId'),
      user: a.belongsTo('User', 'userId'),
    })
    .authorization(allow => [
      allow.owner(),
    ]),

  // Analytics Model
  Analytics: a
    .model({
      type: a.enum(['post', 'user', 'page', 'campaign']),
      entityId: a.id(),
      metric: a.string().required(),
      value: a.float().required(),
      date: a.date().required(),
      metadata: a.json(),
      userId: a.id().required(),
      // Relations
      user: a.belongsTo('User', 'userId'),
    })
    .authorization(allow => [
      allow.owner(),
    ]),

  // Visitor Analytics Model
  VisitorAnalytics: a
    .model({
      sessionId: a.string().required(),
      userId: a.id(),
      ipAddress: a.string(),
      userAgent: a.string(),
      location: a.string(),
      country: a.string(),
      city: a.string(),
      device: a.string(),
      browser: a.string(),
      os: a.string(),
      referrer: a.string(),
      page: a.string().required(),
      timeOnPage: a.integer(),
      timestamp: a.datetime().required(),
      isNewVisitor: a.boolean().default(true),
      isReturningVisitor: a.boolean().default(false),
      // Relations
      user: a.belongsTo('User', 'userId'),
    })
    .authorization(allow => [
      allow.publicApiKey(),
    ]),

  // Custom Functions for Business Logic
  createPost: a
    .mutation()
    .arguments({
      content: a.string().required(),
      mediaUrls: a.string().array(),
      hashtags: a.string().array(),
      mentions: a.string().array(),
      location: a.string(),
      isPublic: a.boolean(),
    })
    .returns(a.ref('Post'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function('createPost')),

  followUser: a
    .mutation()
    .arguments({
      followingId: a.id().required(),
    })
    .returns(a.ref('Follow'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function('followUser')),

  likePost: a
    .mutation()
    .arguments({
      postId: a.id().required(),
    })
    .returns(a.ref('Like'))
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function('likePost')),

  getFeed: a
    .query()
    .arguments({
      limit: a.integer(),
      nextToken: a.string(),
    })
    .returns(a.ref('Post').array())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function('getFeed')),

  getUserStats: a
    .query()
    .arguments({
      userId: a.id().required(),
    })
    .returns(a.json())
    .authorization(allow => [allow.authenticated()])
    .handler(a.handler.function('getUserStats')),

  trackVisitor: a
    .mutation()
    .arguments({
      sessionId: a.string().required(),
      userId: a.id(),
      ipAddress: a.string(),
      userAgent: a.string(),
      location: a.string(),
      country: a.string(),
      city: a.string(),
      device: a.string(),
      browser: a.string(),
      os: a.string(),
      referrer: a.string(),
      page: a.string().required(),
      timeOnPage: a.integer(),
    })
    .returns(a.ref('VisitorAnalytics'))
    .authorization(allow => [allow.publicApiKey()])
    .handler(a.handler.function('trackVisitor')),

  // Real-time Subscriptions
  onPostCreated: a
    .subscription()
    .for(a.ref('Post'))
    .authorization(allow => [allow.authenticated()]),

  onCommentCreated: a
    .subscription()
    .for(a.ref('Comment'))
    .authorization(allow => [allow.authenticated()]),

  onLikeCreated: a
    .subscription()
    .for(a.ref('Like'))
    .authorization(allow => [allow.authenticated()]),

  onFollowCreated: a
    .subscription()
    .for(a.ref('Follow'))
    .authorization(allow => [allow.authenticated()]),

  onNotificationCreated: a
    .subscription()
    .for(a.ref('Notification'))
    .authorization(allow => [allow.authenticated()]),

  onMessageCreated: a
    .subscription()
    .for(a.ref('Message'))
    .authorization(allow => [allow.authenticated()]),

  onVisitorAnalyticsCreated: a
    .subscription()
    .for(a.ref('VisitorAnalytics'))
    .authorization(allow => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
    defaultAuthorizationMode: 'userPool',
  },
});
