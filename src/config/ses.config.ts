// src/config/sesClient.ts
import { SESClient } from "@aws-sdk/client-ses";
import { awsConfiguration } from "./aws.config";

export const sesClient = new SESClient({
  region: awsConfiguration.region,
  credentials: {
    accessKeyId: awsConfiguration.accessKeyId,
    secretAccessKey: awsConfiguration.secretAccessKey,
  },
});
