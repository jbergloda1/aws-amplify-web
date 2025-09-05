import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { storage } from './storage/resource.js';
import { createPost } from './functions/createPost/resource.js';
import { followUser } from './functions/followUser/resource.js';
import { likePost } from './functions/likePost/resource.js';
import { getFeed } from './functions/getFeed/resource.js';
import { getUserStats } from './functions/getUserStats/resource.js';
import { trackVisitor } from './functions/trackVisitor/resource.js';

const backend = defineBackend({
  auth,
  data,
  storage,
  createPost,
  followUser,
  likePost,
  getFeed,
  getUserStats,
  trackVisitor,
});

// Grant the functions access to the data API
backend.createPost.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    'appsync:GraphQL',
  ],
  Resource: [
    `${backend.data.resources.graphqlApi.arn}/*`,
  ],
});

backend.followUser.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    'appsync:GraphQL',
  ],
  Resource: [
    `${backend.data.resources.graphqlApi.arn}/*`,
  ],
});

backend.likePost.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    'appsync:GraphQL',
  ],
  Resource: [
    `${backend.data.resources.graphqlApi.arn}/*`,
  ],
});

backend.getFeed.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    'appsync:GraphQL',
  ],
  Resource: [
    `${backend.data.resources.graphqlApi.arn}/*`,
  ],
});

backend.getUserStats.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    'appsync:GraphQL',
  ],
  Resource: [
    `${backend.data.resources.graphqlApi.arn}/*`,
  ],
});

backend.trackVisitor.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    'appsync:GraphQL',
  ],
  Resource: [
    `${backend.data.resources.graphqlApi.arn}/*`,
  ],
});

// Grant the functions access to the storage
backend.createPost.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
    's3:DeleteObject',
  ],
  Resource: [
    `${backend.storage.resources.bucket.bucketArn}/*`,
  ],
});

backend.followUser.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
    's3:DeleteObject',
  ],
  Resource: [
    `${backend.storage.resources.bucket.bucketArn}/*`,
  ],
});

backend.likePost.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
    's3:DeleteObject',
  ],
  Resource: [
    `${backend.storage.resources.bucket.bucketArn}/*`,
  ],
});

backend.getFeed.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
    's3:DeleteObject',
  ],
  Resource: [
    `${backend.storage.resources.bucket.bucketArn}/*`,
  ],
});

backend.getUserStats.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
    's3:DeleteObject',
  ],
  Resource: [
    `${backend.storage.resources.bucket.bucketArn}/*`,
  ],
});

backend.trackVisitor.addToRolePolicy({
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
    's3:DeleteObject',
  ],
  Resource: [
    `${backend.storage.resources.bucket.bucketArn}/*`,
  ],
});
