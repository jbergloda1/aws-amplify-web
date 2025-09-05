import { defineFunction } from "@aws-amplify/backend";

export const getFeed = defineFunction({
  name: "getFeed",
  entry: "./handler.ts",
  environment: {
    // Add any environment variables needed
  },
});
