import mongoose from "mongoose";
import { adminCheck, generateEmployeeId, ObjectId } from "../utils/helpers";
import Constants from "../locales/constants";

export const createAdmin = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await mongoose
        .model("users")
        .findOne({ email: payload.email })
        .exec();

      if (user) {
        throw new Error(Constants.MESSAGES.ALREADY_EXISTS.code);
      }

      payload.employee_id = generateEmployeeId();

      const role = await mongoose
        .model("roles")
        .findOne({ _id: ObjectId(payload.role._id) });

      payload.permissions = role.permissions;

      const newUser = await mongoose.model("users").create(payload);

      return resolve(newUser);
    } catch (error) {
      return reject(error);
    }
  });
};

export const viewAdminService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await mongoose
        .model("users")
        .findOne({ _id: ObjectId(payload.id) })
        .exec();
      if (!user) return reject(new Error(Constants.MESSAGES.NOT_FOUND.code));
      return resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateAdminService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await mongoose
        .model("users")
        .findOneAndUpdate(
          { _id: ObjectId(payload.params.id) },
          {
            $set: payload.body,
          },
          { new: true, runValidators: true }
        )
        .select("-password")
        .exec();
      return resolve(user);
    } catch (error) {
      reject(error);
    }
  });
};

export const listAdminService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = Number(payload.page) || 1;
      const limit = Number(payload.limit) || 10;
      const skip = (page - 1) * 10;

      const match: Record<string, any> = {
        is_deleted: false,
      };

      const or: any[] = [];
      const and: any[] = [];

      //  username: { type: String, required: true, unique: true },
      //     name: { type: String, required: true },
      // //     email: { type: String, required: true, unique: true },

      // if (payload.contact_number)
      //   and.push({ contact_number: payload.contact_number });
      // if (payload.employee_id) and.push({ employee_id: payload.employee_id });

      if (payload.search) {
        or.push(
          { email: { $regex: payload.search, $options: "i" } },
          { name: { $regex: payload.search, $options: "i" } },
          { username: { $regex: payload.search, $options: "i" } }
        );
      }

      if (or.length) and.push({ $or: or });
      if (and.length) match.$and = and;

      const pipeline: any[] = [
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            password: 0,
          },
        },
      ];

      const countPipeline = [{ $match: match }, { $count: "total" }];

      const [users, countResult] = await Promise.all([
        mongoose.model("users").aggregate(pipeline),
        mongoose.model("users").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: users,
        count: totalCount,
      });
    } catch (error) {
      reject(error);
    }
  });
};
