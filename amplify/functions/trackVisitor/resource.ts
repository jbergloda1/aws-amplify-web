import { defineFunction } from "@aws-amplify/backend";

export const trackVisitor = defineFunction({
  name: "trackVisitor",
  entry: "./handler.ts",
  environment: {
    // Add any environment variables needed
  },
});
