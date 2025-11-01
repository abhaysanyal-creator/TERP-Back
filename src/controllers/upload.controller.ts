import { Request, Response } from "express";
import AWS from "aws-sdk";
import { uploadPaths } from "../config/upload.paths";
import { getS3Key } from "../utils/getS3Key";
import {
  UploadCategory,
  UploadModule,
  UploadParams,
} from "../types/reference.types";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

export const uploadDocumentController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?._id; // employee

    const body = req.body as UploadParams<UploadModule>;
    const { org_id, module, category, fileType, fileName } = body;

    if (!org_id || !module || !fileName) {
      return res.status(400).json({ message: "Missing required params" });
    }

    // Validate category based on module
    // if (
    //   category &&
    //   !uploadPaths[module].includes(category as unknown as string)
    // ) {
    //   return res.status(400).json({ message: "Invalid category for module" });
    // }

    let entityId: string | undefined;
    if (module === "employees") entityId = userId;
    if (module === "patients") entityId = userId;

    // Generate S3 key based on org/module/entity/category/fileName
    const key = getS3Key({
      org_id,
      module,
      entityId,
      category: category as UploadCategory<UploadModule>,
      fileName,
    });

    // Generate signed URL
    const signedUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: fileType,
      Expires: 60 * 5, // 5 minutes
    });

    return res.json({
      signedUrl,
      key,
      url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
    });
  } catch (err: any) {
    console.error("S3 Upload Error:", err);
    return res.status(500).json({ error: err.message });
  }
};
