import { defineFunction } from "@aws-amplify/backend";

export const followUser = defineFunction({
  name: "followUser",
  entry: "./handler.ts",
  environment: {
    // Add any environment variables needed
  },
});
