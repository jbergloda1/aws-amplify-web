import { defineFunction } from "@aws-amplify/backend";

export const createPost = defineFunction({
  name: "createPost",
  entry: "./handler.ts",
  environment: {
    // Add any environment variables needed
  },
});
