import mongoose from "mongoose";
import Constants from "../locales/constants";
import { generateCode, ObjectId } from "../utils/helpers";

export const createDepartmentService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newOrganisation = await mongoose
        .model("departments")
        .create(payload);

      newOrganisation
        ? resolve(newOrganisation)
        : reject(Constants.MESSAGES.INVALID_FORMAT.code);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const viewDepartmentService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const aggregationPipeline: any[] = [
        {
          $match: {
            _id: ObjectId(payload.id),
            is_deleted: false,
          },
        },
        {
          $lookup: {
            localField: "_id",
            foreignField: "department.id",
            as: "activities",
            from: "activities",
          },
        },
      ];

      const existingOrganisation = await mongoose
        .model("departments")
        .aggregate(aggregationPipeline);

      const department = existingOrganisation[0] || null;

      department
        ? resolve(department)
        : reject(Constants.MESSAGES.INVALID_FORMAT.code);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const updateDepartmentService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      delete payload.department_id;
      delete payload.internal_code;

      const updatedOrganisation = await mongoose
        .model("departments")
        .findOneAndUpdate(
          { _id: ObjectId(payload.params.id), is_deleted: false },
          { $set: payload.body },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedOrganisation)
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);

      resolve(updatedOrganisation);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const deleteOrganisationService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedOrganisation = await mongoose
        .model("organisations")
        .findOneAndUpdate(
          {
            _id: ObjectId(payload.id),
            is_deleted: false,
          },
          {
            $set: { is_deleted: true },
          },
          { new: true }
        );
      resolve(deletedOrganisation);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

// export const changeOperatingHoursOrganisationService = (
//   payload: Record<string, any>
// ): Record<string, any> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const operatingHours = payload.operating_hours;
//       const id = payload.id;

//       const changedOperatingHours = await mongoose
//         .model("organisations")
//         .findOneAndUpdate(
//           { _id: ObjectId(id), is_deleted: { $ne: true } },
//           { $set: { working_hours: operatingHours } },
//           { returnDocument: "after" }
//         )
//         .exec();

//       if (!changedOperatingHours) {
//         throw new Error("Problem Changing the working hours!!");
//       }
//       resolve(changedOperatingHours);
//     } catch (error) {
//       console.error(error);
//       reject(error);
//     }
//   });
// };

export const listDepartmentService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = Number(payload.page) || 1;
      const limit = Number(payload.limit) || 10;
      const skip = (page - 1) * limit;

      const match: Record<string, any> = { is_deleted: false };
      const and: any[] = [];
      const or: any[] = [];

      if (payload.department_name)
        and.push({ department_name: payload.department_name });

      if (payload.organisation_id)
        and.push({ "organisation.id": ObjectId(payload.organisation_id) });

      if (payload.search) {
        or.push(
          { "organisation.name": { $regex: payload.search, $options: "i" } },
          { institution_code: { $regex: payload.search, $options: "i" } }
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
          $lookup: {
            localField: "organisation.id",
            from: "organisations",
            foreignField: "_id",
            as: "organisation",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  organisation_type: 1,
                  organisation_name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: {
            path: "$organisation",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            localField: "_id",
            from: "activities",
            foreignField: "department.id",
            as: "activities",
            pipeline: [
              {
                $project: {
                  _id: 1,
                  type: 1,
                  activity_name: 1,
                },
              },
            ],
          },
        },
      ];

      const countPipeline = [{ $match: match }, { $count: "total" }];

      const [departments, countResult] = await Promise.all([
        mongoose.model("departments").aggregate(pipeline),
        mongoose.model("departments").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: departments,
        meta: {
          count: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};
