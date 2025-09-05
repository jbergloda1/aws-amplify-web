# Social Network Service Backend

This document describes the comprehensive backend structure for the social network service built with AWS Amplify.

## 🏗️ Architecture Overview

The backend is built using AWS Amplify Gen 2 and includes:

- **Data Models**: Comprehensive GraphQL schema with relationships
- **Authentication**: AWS Cognito user pools
- **Storage**: S3 buckets for media files
- **Functions**: Lambda functions for business logic
- **Real-time**: GraphQL subscriptions for live updates
- **Analytics**: Visitor tracking and user analytics

## 📊 Data Models

### Core Models

#### User
- Profile information (username, email, bio, avatar)
- Social metrics (followers, following, posts count)
- Preferences and settings
- Social media links

#### Post
- Content and media URLs
- Engagement metrics (likes, comments, shares, views)
- Hashtags and mentions
- Location and scheduling
- Privacy settings

#### Comment
- Nested comments with replies
- Media support
- Like functionality

#### Like
- Polymorphic likes (posts and comments)
- User relationships

#### Follow
- User following relationships
- Bidirectional relationships

#### Share
- Post sharing functionality
- Custom share content

### Communication Models

#### Conversation
- Direct and group conversations
- Participant management
- Last message tracking

#### Message
- Text, image, video, file support
- Reply functionality
- Read status tracking

#### Notification
- Multiple notification types
- Read/unread status
- Related entity references

### Social Media Integration

#### SocialAccount
- Multi-platform support (Twitter, Instagram, Facebook, LinkedIn, YouTube, TikTok)
- OAuth token management
- Account statistics

#### ScheduledPost
- Cross-platform scheduling
- Status tracking
- Error handling

### Analytics Models

#### Analytics
- User and post analytics
- Custom metrics
- Date-based tracking

#### VisitorAnalytics
- Website visitor tracking
- Device and browser information
- Geographic data
- Session management

## 🔧 Backend Functions

### Core Functions

#### createPost
- Creates posts with media support
- Extracts hashtags and mentions
- Creates mention notifications
- Updates user post count

#### followUser
- Manages follow relationships
- Updates follower/following counts
- Creates follow notifications
- Prevents self-following

#### likePost
- Toggles like status
- Updates like counts
- Creates like notifications
- Handles unlike functionality

#### getFeed
- Generates personalized feed
- Includes followed users' posts
- Falls back to public posts
- Sorts by publication date

#### getUserStats
- Comprehensive user analytics
- Engagement metrics
- Top performing posts
- Growth statistics

#### trackVisitor
- Records visitor analytics
- Session management
- Device and browser detection
- Geographic tracking

## 🔐 Authentication & Authorization

### User Pool Authentication
- Email/password authentication
- User profile management
- Secure token handling

### Authorization Rules
- Owner-based access control
- Public read access for posts
- Private access for personal data
- API key access for analytics

## 📁 Storage Configuration

### S3 Bucket Structure
```
public/
├── avatars/          # User profile pictures
├── posts/           # Post media files
└── messages/        # Message attachments

private/
└── {identity_id}/   # Private user files
```

### Access Patterns
- Public read access for avatars and posts
- Authenticated write access
- Private user folders
- Secure file uploads

## 🔄 Real-time Features

### GraphQL Subscriptions
- `onPostCreated`: New post notifications
- `onCommentCreated`: Comment notifications
- `onLikeCreated`: Like notifications
- `onFollowCreated`: Follow notifications
- `onNotificationCreated`: Real-time notifications
- `onMessageCreated`: Live messaging
- `onVisitorAnalyticsCreated`: Live visitor tracking

### WebSocket Connections
- Automatic reconnection
- Connection state management
- Error handling

## 📈 Analytics & Tracking

### Visitor Analytics
- Real-time visitor tracking
- Device and browser detection
- Geographic information
- Session management
- Page view tracking

### User Analytics
- Engagement metrics
- Post performance
- Follower growth
- Activity patterns

## 🚀 Deployment

### Prerequisites
- AWS CLI configured
- Node.js 18+
- Amplify CLI

### Deployment Steps
1. Install dependencies: `npm install`
2. Deploy backend: `npx ampx sandbox`
3. Generate types: `npx ampx generate graphql-client-code`
4. Deploy to production: `npx ampx pipeline-deploy --branch main`

### Environment Variables
- `AMPLIFY_DATA_GRAPHQL_ENDPOINT`
- `AWS_REGION`
- `AMPLIFY_DATA_API_KEY`

## 🔧 Frontend Integration

### Service Layer
The `SocialService` class provides a clean API for frontend integration:

```typescript
// Create a post
await SocialService.createPost({
  content: "Hello world!",
  hashtags: ["#hello", "#world"],
  isPublic: true
});

// Follow a user
await SocialService.followUser(userId);

// Get user feed
const feed = await SocialService.getFeed(20);

// Track visitor
await SocialService.trackVisitor({
  sessionId: "session_123",
  page: "/dashboard",
  device: "Desktop"
});
```

### Real-time Subscriptions
```typescript
// Subscribe to new posts
const subscription = SocialService.subscribeToPosts((post) => {
  console.log('New post:', post);
});

// Subscribe to notifications
const notificationSub = SocialService.subscribeToNotifications(
  userId,
  (notification) => {
    console.log('New notification:', notification);
  }
);
```

### Visitor Tracking Hook
```typescript
// Use visitor tracking hook
const { sessionId, trackPageView } = useVisitorTracking(userId);

// Track page changes
trackPageView('/dashboard/analytics');
```

## 📊 Monitoring & Logging

### CloudWatch Integration
- Function execution logs
- Error tracking
- Performance metrics
- Custom metrics

### Debugging
- GraphQL query logging
- Function execution traces
- Real-time subscription monitoring

## 🔒 Security Features

### Data Protection
- Encryption at rest
- Encryption in transit
- Secure token storage
- Input validation

### Access Control
- Role-based permissions
- Resource-level authorization
- API rate limiting
- CORS configuration

## 📚 API Documentation

### GraphQL Schema
The complete GraphQL schema is auto-generated and includes:
- All data models
- Relationships
- Custom functions
- Subscriptions
- Authorization rules

### Function APIs
Each Lambda function includes:
- Input validation
- Error handling
- Response formatting
- Logging

## 🚀 Scaling Considerations

### Performance
- Connection pooling
- Query optimization
- Caching strategies
- CDN integration

### Cost Optimization
- Lambda cold start optimization
- S3 storage classes
- DynamoDB read/write optimization
- CloudWatch log retention

## 🔄 Maintenance

### Regular Tasks
- Monitor function performance
- Review access logs
- Update dependencies
- Backup data

### Updates
- Schema migrations
- Function deployments
- Security patches
- Feature additions

This backend provides a solid foundation for a scalable social network service with comprehensive features for user management, content sharing, real-time communication, and analytics.
