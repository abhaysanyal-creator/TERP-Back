import mongoose from "mongoose";
import { generateCode, getDateRange, ObjectId } from "../utils/helpers";
import { getSignedUrlForView } from "../controllers/upload.controller";
import { Employee } from "../types/interface.types";
import Constants from "../locales/constants";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/email.ses";
import enums from "../enums.json";

export const createEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      payload.employee_id = generateCode("EMP", 6);

      const plainPassword = generateCode("Pass", 6);

      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      payload.password = hashedPassword;
      payload.is_first_login = true;
      payload.role = ObjectId(payload.employee_roles.id);
      
      const newEmployee = await mongoose.model("employees").create(payload);

      await sendEmail(newEmployee.email, plainPassword, "Password for Login");
      resolve(newEmployee);
    } catch (error) {
      reject(error);
    }
  });
};

export const viewEmployeeService = async (payload: Record<string, any>) => {
  try {
    const EmployeeModel = mongoose.model<Employee>("employees");

    const employee = await EmployeeModel.findOne({ _id: ObjectId(payload.id) })
      .lean()
      .select("-password")
      .exec();

    if (!employee) {
      throw new Error(Constants.MESSAGES.NOT_FOUND.code);
    }

    employee.documents = await Promise.all(
      (employee.documents || []).map(async (doc) => ({
        ...doc,
        signedUrl: await getSignedUrlForView(doc.key),
      }))
    );

    return employee;
  } catch (error) {
    throw error;
  }
};

export const updateEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const requestBody = payload;
      const id = payload.id;

      const updatedEmployee = await mongoose
        .model("employees")
        .findOneAndUpdate(
          { _id: ObjectId(id) },
          { $set: requestBody },
          { new: true, runValidators: true }
        )
        .exec();

      if (!updatedEmployee) {
        throw new Error("Employee not found or could not be updated");
      }

      resolve(updatedEmployee);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const deletedUser = await mongoose
        .model("employees")
        .findOneAndUpdate(
          { _id: ObjectId(payload.id), is_deleted: { $ne: true } },
          { $set: { is_deleted: true } },
          { returnDocument: "after" }
        )
        .exec();

      if (!deletedUser) {
        throw new Error("Employee not found or already deleted");
      }
      resolve(deletedUser);
    } catch (error) {
      reject(error);
    }
  });
};

export const blockTimeEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedUser = await mongoose
        .model("employees")
        .findOneAndUpdate(
          { _id: ObjectId(payload.id), is_deleted: { $ne: true } },
          { $set: { blocked_times: payload } },
          { returnDocument: "after" }
        )
        .exec();

      if (!updatedUser) {
        throw new Error(Constants.MESSAGES.SOMETHING_WENT_WRONG.UPDATE.code);
      }

      resolve(updatedUser);
    } catch (error) {
      reject(error);
    }
  });
};

export const changeWorkingHoursEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const workingHours = payload.working_hours;
      const id = payload.id;

      const changedWorkingHours = await mongoose
        .model("employees")
        .findOneAndUpdate(
          { _id: ObjectId(id), is_deleted: { $ne: true } },
          { $set: { working_hours: workingHours } },
          { returnDocument: "after" }
        )
        .exec();

      if (!changedWorkingHours) {
        throw new Error("Problem Changing the working hours!!");
      }
      resolve(changedWorkingHours);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const listEmployeeService = (
  payload: Record<string, any>
): Record<string, any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const page = Number(payload.page) || 1;
      const limit = Number(payload.limit) || 10;
      const skip = (page - 1) * limit;

      const match: Record<string, any> = {
        is_deleted: false,
      };

      const or: any[] = [];
      const and: any[] = [];

      if (payload.mobile_phone)
        and.push({ mobile_phone: payload.mobile_phone });

      if (payload.employee_roles)
        and.push({ "employee_roles.id": ObjectId(payload.employee_roles) });

      if (payload.is_active !== undefined)
        and.push({ is_active: payload.is_active });

      if (payload.search) {
        or.push({
          $expr: {
            $regexMatch: {
              input: { $concat: ["$first_name", " ", "$last_name"] },
              regex: payload.search.trim(),
              options: "i",
            },
          },
        });
        or.push({
          employee_id: { $regex: payload.search.trim(), $options: "i" },
        });
      }

      if (or.length) and.push({ $or: or });
      if (and.length) match.$and = and;

      const pipeline: any[] = [
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ];

      const countPipeline = [{ $match: match }, { $count: "total" }];

      const [employees, countResult] = await Promise.all([
        mongoose.model("employees").aggregate(pipeline),
        mongoose.model("employees").aggregate(countPipeline),
      ]);

      const totalCount = countResult[0]?.total || 0;

      // const employeesWithSignedUrls = await Promise.all(
      //   employees.map(async (employee: any) => {
      //     if (employee.documents && employee.documents.length > 0) {
      //       employee.documents = await Promise.all(
      //         employee.documents.map(async (doc: any) => ({
      //           ...doc,
      //           signedUrl: await getSignedUrlForView(doc.key),
      //         }))
      //       );
      //     }
      //     return employee;
      //   })
      // );

      resolve({
        data: employees,
        meta: {
          pages: Math.ceil(totalCount / limit),
          page,
          limit,
          total: totalCount,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const getAllAvailabilityService = async (
  startDate: string,
  endDate: string
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Generate list of dates
  const dates: string[] = getDateRange(start, end);

  const therapists = await mongoose
    .model("employees")
    .find({ is_active: true, "employee_roles.name": "Therapist" });

  if (!therapists || therapists.length === 0) {
    throw new Error(Constants.MESSAGES.NOT_FOUND.code);
  }

  const finalResponse: any[] = [];

  for (const therapist of therapists) {
    const therapistData: any = {
      therapist_id: therapist._id,
      therapist_name: therapist.first_name,
      availability: {},
    };

    for (const d of dates) {
      const jsDay = new Date(d).getDay(); // 0-6 (Sun=0)
      const mongoDay = jsDay === 0 ? 7 : jsDay; // Convert to 1-7

      // Find working day and enabled
      const daySchedule = therapist.working_hours.find(
        (x: any) => x.day === mongoDay && x.enabled
      );

      if (!daySchedule || daySchedule.slots.length === 0) {
        therapistData.availability[d] = [];
        continue;
      }

      // Fetch all sessions for that therapist on this date
      const dayStart = new Date(d);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const bookings = await mongoose.model("sessions").find({
        "therapist.id": therapist._id,
        scheduled_start: { $gte: dayStart, $lte: dayEnd },
        status: {
          $in: [enums.SessionStatus.IN_PROGRESS, enums.SessionStatus.SCHEDULED],
        },
      });

      const bookedBlocks = bookings.map((b: any) => ({
        start: new Date(b.scheduled_start),
        end: new Date(b.scheduled_end),
      }));

      const freeSlots: any[] = [];

      // Loop through each working slot for that day
      for (const slot of daySchedule.slots) {
        // Combine date with slot times
        const workStart = new Date(`${d}T${slot.start_time.slice(11)}`);
        const workEnd = new Date(`${d}T${slot.end_time.slice(11)}`);

        let current = new Date(workStart);
        const slotDuration = 60; // minutes

        while (current < workEnd) {
          const slotStart = new Date(current);
          const slotEnd = new Date(current.getTime() + slotDuration * 60000);
          if (slotEnd > workEnd) break;

          const isBooked = bookedBlocks.some(
            (b) => slotStart < b.end && slotEnd > b.start
          );

          if (!isBooked) {
            freeSlots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
            });
          }

          current = slotEnd;
        }
      }

      therapistData.availability[d] = freeSlots;
    }

    finalResponse.push(therapistData);
  }

  return finalResponse;
};

