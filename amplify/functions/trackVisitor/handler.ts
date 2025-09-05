import type { Handler } from "aws-lambda";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../data/resource";

// Configure Amplify
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT!,
      region: process.env.AWS_REGION!,
      defaultAuthMode: "apiKey",
    },
  },
});

const client = generateClient<Schema>();

export const handler: Handler = async (event) => {
  console.log("Event: ", JSON.stringify(event, null, 2));

  try {
    const {
      sessionId,
      userId,
      ipAddress,
      userAgent,
      location,
      country,
      city,
      device,
      browser,
      os,
      referrer,
      page,
      timeOnPage,
    } = event.arguments;

    // Check if this is a new or returning visitor
    const existingVisitor = await client.models.VisitorAnalytics.list({
      filter: { sessionId: { eq: sessionId } },
      limit: 1,
    });

    const isNewVisitor = existingVisitor.data.length === 0;
    const isReturningVisitor = !isNewVisitor;

    // Create visitor analytics record
    const visitorAnalytics = await client.models.VisitorAnalytics.create({
      sessionId,
      userId,
      ipAddress,
      userAgent,
      location,
      country,
      city,
      device,
      browser,
      os,
      referrer,
      page,
      timeOnPage,
      timestamp: new Date().toISOString(),
      isNewVisitor,
      isReturningVisitor,
    });

    return visitorAnalytics.data;
  } catch (error) {
    console.error("Error tracking visitor:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to track visitor: ${errorMessage}`);
  }
};
