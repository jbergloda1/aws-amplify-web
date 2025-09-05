import { defineFunction } from "@aws-amplify/backend";

export const likePost = defineFunction({
  name: "likePost",
  entry: "./handler.ts",
  environment: {
    // Add any environment variables needed
  },
});
