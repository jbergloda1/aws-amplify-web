import { defineFunction } from "@aws-amplify/backend";

export const getUserStats = defineFunction({
  name: "getUserStats",
  entry: "./handler.ts",
  environment: {
    // Add any environment variables needed
  },
});
