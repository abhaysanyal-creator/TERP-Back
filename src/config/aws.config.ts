import dotenv from "dotenv";

dotenv.config();

export const awsConfiguration = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  region: process.env.AWS_REGION as string,
  sesSenderEmail: process.env.SES_SENDER_EMAIL as string,
};
