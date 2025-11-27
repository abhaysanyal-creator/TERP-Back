import { Request, Response } from "express";
import AWS from "aws-sdk";
import { uploadPaths } from "../config/upload.paths";
import { getS3Key } from "../utils/getS3Key";
import {
  UploadCategory,
  UploadModule,
  UploadParams,
} from "../types/reference.types";
import { ExpressMiddleware } from "../types/express.types";
import mongoose from "mongoose";
import { ObjectId } from "../utils/helpers";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import { getErrorMessage } from "../middlewares/app.middlewares";

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const getSignedUrlController: ExpressMiddleware = async (req, res) => {
  try {
    const body = req.body as UploadParams<UploadModule>;
    const { organisation_id, module, category, fileType, fileName, entityId } =
      body;

    if (!organisation_id || !module || !fileName) {
      return res.status(400).json({ code: "MISSING_PARAMS" });
    }

    // let entityId: string | undefined;
    // if (module === "employees") entityId = userId;
    // if (module === "patients") entityId = userId;

    // Generate S3 key based on org/module/entity/category/fileName
    const key = getS3Key({
      organisation_id,
      module,
      entityId,
      category: category as UploadCategory<UploadModule>,
      fileName,
    });

    // signed URL for the frontend
    const signedUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      ContentType: fileType,
      Expires: 60 * 5, // 5 minutes
    });

    return res.json({
      signedUrl,
      key,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`,
    });
  } catch (error: any) {
    console.error("S3 Upload Error:", error);
    return badRequest(res, getErrorMessage(error));
  }
};

export const getSignedUrlForView = async (key: string) => {
  return s3.getSignedUrl("getObject", {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Expires: 900,
  });
};

export const confirmUploadController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const { entityId, type, key, file_name, module, category } = request.body;

    const entity = await mongoose
      .model(module)
      .findById(ObjectId(entityId))
      .exec();

    if (!entity) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }

    const obj = {
      type,
      key,
      file_name: file_name || null,
      category: category,
    };

    try {
      entity.documents.push(obj);

      await entity.save();
    } catch (error) {
      return badRequest(response, getErrorMessage(error));
    }

    return success(response, Constants.MESSAGES.SUCCESS.code, {});
  } catch (error) {
    console.error("Upload confirm error", error);
    return badRequest(response, getErrorMessage(error));
  }
};
