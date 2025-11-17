import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { ObjectId } from "../utils/helpers";
import {
  createDepartmentService,
  listDepartmentService,
  updateDepartmentService,
  viewDepartmentService,
} from "../services/department.service";

export const createDeptController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingOrg = await mongoose
      .model("departments")
      .findOne({
        department_name: request.body.department_name,
        is_deleted: false,
      })
      .exec();

    if (existingOrg) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }

    if (
      !(await mongoose
        .model("organisations")
        .findById(ObjectId(request.body.organisation.id)))
    ) {
      return badRequest(response, Constants.MESSAGES.ORG_ID_REQUIRED.code);
    }

    // Duplicate companions check

    const companions = request.body.contacts || [];

    const phoneSet = new Set();

    let duplicatePhone = false;

    for (const c of companions) {

      if (phoneSet.has(c.phone)) duplicatePhone = true;
      else phoneSet.add(c.phone);
    }
    if (duplicatePhone) {
      return badRequest(
        response,
        Constants.MESSAGES.COMPANION_NUMBER_REPEATED.code
      );
    }

    const result = await createDepartmentService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewDeptController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const id = request.params.id as string;

    const existingOrg = await mongoose
      .model("departments")
      .findOne({ _id: ObjectId(id), is_deleted: false })
      .exec();

    if (!existingOrg) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }
    const result = await viewDepartmentService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateDeptController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingOrganisation = await mongoose
      .model("departments")
      .findOne({ _id: ObjectId(request.params.id) })
      .exec();

    if (!existingOrganisation)
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);

    const result = await updateDepartmentService(request);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

// export const deleteOrganisationController: ExpressMiddleware = async (
//   request,
//   response
// ) => {
//   try {
//     const id = request.params.id as string;

//     const existingOrg = await mongoose
//       .model("organisations")
//       .findById(ObjectId(id))
//       .exec();

//     if (!existingOrg) {
//       return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
//     }
//     const result = await deleteOrganisationService(request.params);
//     return success(response, Constants.MESSAGES.SUCCESS.code, result);
//   } catch (error) {
//     return badRequest(response, getErrorMessage(error));
//   }
// };

// export const listOrganisationController: ExpressMiddleware = async (
//   request,
//   response
// ) => {
//   try {
//     const result = await listOrganisationService(request.body);
//     return success(response, Constants.MESSAGES.SUCCESS.code, result);
//   } catch (error) {
//     console.error(error);
//     return badRequest(response, getErrorMessage(error));
//   }
// };

// export const changeOperatingHoursOrganisationController: ExpressMiddleware =
//   async (request, response) => {
//     try {
//       const checkOrg = await mongoose
//         .model("organisations")
//         .findOne({ _id: ObjectId(request.body.id), is_deleted: false })
//         .exec();
//       if (!checkOrg)
//         return badRequest(
//           response,
//           Constants.MESSAGES.INSTITUTION_CODE_REQUIRED.code
//         );

//       if (
//         JSON.stringify(checkOrg.operating_hours) ===
//         JSON.stringify(request.body.operating_hours)
//       ) {
//         return badRequest(response, Constants.MESSAGES.CHANGE_HOURS.code);
//       }
//       const result = await changeOperatingHoursOrganisationService(
//         request.body
//       );

//       return success(response, Constants.MESSAGES.SUCCESS.code, result);
//     } catch (error) {
//       console.error(error);
//       return badRequest(response, getErrorMessage(error));
//     }
//   };

export const listDeptController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listDepartmentService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};
