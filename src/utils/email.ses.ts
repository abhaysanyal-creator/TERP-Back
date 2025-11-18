import { sesClient } from "../config/ses.config";
import { SendEmailCommand } from "@aws-sdk/client-ses";

export const sendOtpEmail = async (toEmail: string, otp: string) => {
  const command = new SendEmailCommand({
    Source: process.env.SES_SENDER_EMAIL,
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: "Your OTP Code" },
      Body: { Text: { Data: `Your OTP is: ${otp}` } },
    },
  });

  try {
    const result = await sesClient.send(command);
    console.log(`OTP sent to ${toEmail}, MessageId: ${result.MessageId}`);
    return result;
  } catch (error) {
    console.error(`Error sending OTP to ${toEmail}:`, error);
    throw error;
  }
};

export const sendEmail = async (
  toEmail: string,
  password: string,
  subject: string
) => {
  const command = new SendEmailCommand({
    Source: process.env.SES_SENDER_EMAIL,
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: `Your password for login is: ${password}` } },
    },
  });

  try {
    const result = await sesClient.send(command);
    console.log(`Email sent to ${toEmail}, MessageId: ${result.MessageId}`);
    return result;
  } catch (error) {
    console.error(`Error sending Email to ${toEmail}:`, error);
    throw error;
  }
};
