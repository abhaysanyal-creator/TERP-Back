import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { awsConfiguration } from "./aws.config";
dotenv.config();

export const s3Client = new S3Client({
  region: awsConfiguration.region,
  credentials: {
    accessKeyId: awsConfiguration.accessKeyId,
    secretAccessKey: awsConfiguration.secretAccessKey,
  },
});
