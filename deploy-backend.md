# Backend Deployment Guide

## Prerequisites
1. AWS CLI configured with appropriate permissions
2. Node.js 18+ installed
3. Amplify CLI installed: `npm install -g @aws-amplify/cli`

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Deploy Backend to Sandbox
```bash
npx ampx sandbox
```

This will:
- Deploy all data models
- Deploy Lambda functions
- Deploy storage buckets
- Generate GraphQL schema
- Create API endpoints

### 3. Generate Client Code
After successful deployment, generate the client code:
```bash
npx ampx generate graphql-client-code
```

This will create the TypeScript types and client code in your project.

### 4. Update Frontend Configuration
The `amplify_outputs.json` file will be automatically updated with the new endpoints and configuration.

### 5. Test the Application
Start your development server:
```bash
npm run dev
```

## Troubleshooting

### Common Issues

#### 1. "client.mutations.trackVisitor is not a function"
**Solution**: Make sure the backend is deployed and client code is generated:
```bash
npx ampx sandbox
npx ampx generate graphql-client-code
```

#### 2. "Cannot read properties of undefined (reading 'list')"
**Solution**: The client is not properly initialized. Check that:
- Amplify is configured with the correct outputs
- The backend is deployed
- Client code is generated

#### 3. Subscription Errors
**Solution**: Subscriptions require WebSocket connections. Make sure:
- The GraphQL API is deployed
- WebSocket endpoints are configured
- Client is properly initialized

### Development vs Production

#### Development (Sandbox)
```bash
npx ampx sandbox
```

#### Production Deployment
```bash
npx ampx pipeline-deploy --branch main
```

## Backend Components

### Data Models
- User, Post, Comment, Like, Follow, Share
- Notification, Conversation, Message
- SocialAccount, ScheduledPost
- Analytics, VisitorAnalytics

### Lambda Functions
- createPost: Smart post creation with notifications
- followUser: Follow management with notifications
- likePost: Like/unlike functionality
- getFeed: Personalized feed generation
- getUserStats: User analytics
- trackVisitor: Visitor tracking

### Storage
- S3 bucket for media files
- Public/private access patterns
- File upload/download functionality

### Real-time Features
- GraphQL subscriptions
- WebSocket connections
- Live updates for posts, comments, likes, notifications

## API Endpoints

### GraphQL API
- Endpoint: Available in `amplify_outputs.json`
- Authentication: Cognito User Pools
- Authorization: Role-based access control

### Storage API
- S3 bucket for file storage
- Pre-signed URLs for secure uploads
- Public/private access patterns

## Monitoring

### CloudWatch Logs
- Lambda function logs
- API Gateway logs
- Error tracking

### Metrics
- Function execution time
- API request counts
- Error rates

## Security

### Authentication
- AWS Cognito User Pools
- JWT tokens
- Secure token storage

### Authorization
- Owner-based access control
- Public read access for posts
- Private access for personal data

### Data Protection
- Encryption at rest
- Encryption in transit
- Input validation

## Cost Optimization

### Lambda Functions
- Cold start optimization
- Memory allocation tuning
- Timeout configuration

### DynamoDB
- Read/write capacity optimization
- Query optimization
- Index management

### S3 Storage
- Storage class optimization
- Lifecycle policies
- CDN integration

This deployment guide ensures your social network backend is properly set up and running with all the necessary components for a production-ready application.
