import mongoose, { PipelineStage } from "mongoose";
import Constants from "../locales/constants";
import { generateCode, ObjectId } from "../utils/helpers";
import { Activity, Employee, IDepartment } from "../types/interface.types";

const activityModel = mongoose.model<Activity>("activities");
const deptModel = mongoose.model<IDepartment>("departments");
const employeeModel = mongoose.model<Employee>("employees");

export const createActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      payload.activity_id = generateCode("ACT", 6);
      const newActivity = await activityModel.create(payload);

      if (!newActivity) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);
      }
      resolve(newActivity);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const id = ObjectId(payload.id);

      const activity = await activityModel.findOne({ _id: id }).exec();

      if (!activity) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.FIND.code);
      }

      resolve(activity);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (payload.body.activity_id) {
        delete payload.body.activity_id;
      }

      if (payload.body.internal_code) {
        delete payload.body.internal_code;
      }

      const updatedActivity = await activityModel
        .findOneAndUpdate(
          { _id: ObjectId(payload.params.id) },
          { $set: payload.body },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedActivity) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }
      resolve(updatedActivity);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedActivity = await activityModel.findOneAndUpdate(
        {
          _id: ObjectId(payload.id),
        },
        {
          $set: { is_deleted: true },
        },
        { new: true }
      );
      resolve(deletedActivity);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const listActivityService = (
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

      if (payload.id) and.push({ id: ObjectId(payload.id) });
      if (payload.activity_name) and.push({ id: payload.activity_name });
      if (payload.organisation_id)
        and.push({
          "organisation.id": ObjectId(payload.organisation_id),
        });
      if (payload.department_id)
        and.push({
          departments: ObjectId(payload.department_id),
        });

      if (payload.protected_space)
        and.push({ protected_space: payload.protected_space });

      if (payload.working_hours)
        and.push({
          operating_hours: payload.operating_hours,
        });

      if (payload.search) {
        or.push(
          {
            "organisation.name": {
              $regex: payload.search.trim(),
              $options: "i",
            },
          },
          {
            "department.name": { $regex: payload.search.trim(), $options: "i" },
          }
        );
      }

      if (or.length) and.push({ $or: or });
      if (and.length) match.$and = and;

      const pipeline: PipelineStage[] = [
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      const countPipeline = [{ $match: match }, { $count: "total" }];

      const [activities, countResult] = await Promise.all([
        activityModel.aggregate(pipeline),
        activityModel.aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      resolve({
        data: activities,
        meta: {
          count: totalCount,
          pages: Math.ceil(totalCount / limit),
          page: page,
          limit: limit,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const createExpenseService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const expenseArray = Array.isArray(payload.body)
        ? payload.body
        : [payload.body];

      const newExpense = await activityModel.findOneAndUpdate(
        {
          _id: ObjectId(payload.params.id),
          is_active: true,
        },
        {
          $push: {
            expenses: { $each: expenseArray },
          },
        },
        { new: true, returnDocument: "after" }
      );

      if (!newExpense)
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);

      resolve(newExpense);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateExpenseService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const setObj: Record<string, any> = {};
      for (const key in payload.body) {
        if (payload.body[key] !== undefined) {
          setObj[`expenses.$[elem].${key}`] = payload.body[key];
        }
      }
      const expIdParam = payload.params.exp_id;

      const arrayFilterId = mongoose.Types.ObjectId.isValid(expIdParam)
        ? ObjectId(expIdParam)
        : expIdParam;

      const newExpense = await activityModel.findOneAndUpdate(
        { _id: ObjectId(payload.params.id), is_active: true },
        { $set: setObj },
        {
          new: true,
          returnDocument: "after",
          arrayFilters: [{ "elem._id": arrayFilterId }],
        }
      );

      if (!newExpense)
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.CREATE.code);

      resolve(newExpense);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteExpenseService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const newExpense = await activityModel.findOneAndUpdate(
        {
          _id: ObjectId(payload.params.id),
          is_active: true,
        },
        {
          $pull: {
            expenses: { _id: ObjectId(payload.params.exp_id) },
          },
        },
        {
          new: true,
        }
      );

      if (!newExpense)
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.DELETE.code);

      resolve(newExpense);
    } catch (error) {
      reject(error);
    }
  });
};

export const addEmployeeActivityService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const activityId = payload.params.id;
      const employees = payload.body; // you are sending an array

      // Update add all employees
      const updatedActivity = await activityModel.findOneAndUpdate(
        { _id: ObjectId(activityId) },
        {
          $push: { employees: { $each: employees } },
        },
        { new: true, runValidators: true }
      );

      if (!updatedActivity) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }

      // Prepare activity reference to push into employee.activities
      const activityRef = {
        id: updatedActivity._id,
        name: updatedActivity.activity_name,
      };

      // Update ALL employees in bulk
      const bulkOps = employees.map((e: any) => ({
        updateOne: {
          filter: { _id: ObjectId(e.id) },
          update: { $addToSet: { activities: activityRef } },
        },
      }));

      await employeeModel.bulkWrite(bulkOps);

      resolve(updatedActivity);
    } catch (error) {
      reject(error);
    }
  });
};

export const addIndexPriceService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedClinic = await deptModel
        .findOneAndUpdate(
          { _id: ObjectId(payload.params.deptId) },
          {
            $push: {
              activities: payload.body,
            },
          },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedClinic) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }

      await activityModel.findOneAndUpdate(
        {
          _id: ObjectId(payload.body.activity.id),
        },
        {
          $push: {
            departments: payload.params.deptId,
          },
        }
      );

      resolve(updatedClinic);
    } catch (error) {
      reject(error);
    }
  });
};
