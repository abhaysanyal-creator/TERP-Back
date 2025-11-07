import mongoose from "mongoose";
import type { ExpressMiddleware } from "../types/express.types";
import { badRequest, success } from "../response/response";
import Constants from "../locales/constants";
import {
  createOrganisationService,
  listOrganisationService,
  updateOrganisationService,
  viewOrganisationService,
} from "../services/organisation.service";
import { getErrorMessage } from "../middlewares/app.middlewares";
import { ObjectId } from "../utils/helpers";

export const createOrganisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingOrg = await mongoose
      .model("organisations")
      .findOne({
        $or: [
          { organisation_name: request.body.organisation_name },
          { internal_code: request.body.internal_code },
          { organisation_id: request.body.organisation_id },
        ],
      })
      .exec();

    if (existingOrg) {
      return badRequest(response, Constants.MESSAGES.ALREADY_EXISTS.code);
    }
    const result = await createOrganisationService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

export const viewOrganisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const id = request.params.id as string;

    const existingOrg = await mongoose
      .model("organisations")
      .findOne({ _id: ObjectId(id), is_deleted: false })
      .exec();

    if (!existingOrg) {
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);
    }
    const result = await viewOrganisationService(request.params);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    return badRequest(response, getErrorMessage(error));
  }
};

export const updateOrganisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const existingOrganisation = await mongoose
      .model("organisations")
      .findOne({ _id: ObjectId(request.params.id) })
      .exec();

    if (!existingOrganisation)
      return badRequest(response, Constants.MESSAGES.NOT_FOUND.code);

    const result = await updateOrganisationService(request);
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

export const listOrganisationController: ExpressMiddleware = async (
  request,
  response
) => {
  try {
    const result = await listOrganisationService(request.body);
    return success(response, Constants.MESSAGES.SUCCESS.code, result);
  } catch (error) {
    console.error(error);
    return badRequest(response, getErrorMessage(error));
  }
};

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
