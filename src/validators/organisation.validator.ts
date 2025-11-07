import { badRequest } from "../response/response";
import Constants from "../locales/constants";
import type { ExpressMiddlewareNext } from "../types/express.types";
import enums from "../enums.json";

export const createOrganisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.organisation_name) {
    return badRequest(response, Constants.MESSAGES.ORG_NAME_REQUIRED.code);
  }

  if (
    !request.body.organisation_type ||
    !Object.values(enums.OrganisationType).includes(
      request.body.organisation_type
    )
  ) {
    return badRequest(response, Constants.MESSAGES.INVALID_ORG_TYPE.code);
  }
  if (!request.body.organisation_id) {
    return badRequest(response, Constants.MESSAGES.ORG_ID_REQUIRED.code);
  }

  if (!request.body.address) {
    return badRequest(response, Constants.MESSAGES.ADDRESS_REQUIRED.code);
  }

  if (
    !Array.isArray(request.body.contacts) ||
    request.body.contacts.length === 0
  ) {
    return badRequest(response, Constants.MESSAGES.CONTACT_REQUIRED.code);
  }
  for (const contact of request.body.contacts) {
    if (!contact.name || !contact.role || !contact.phone ) {
      return badRequest(response, Constants.MESSAGES.INVALID_CONTACT.code);
    }
  }
  next();
};

export const viewOrganisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

// export const updateOrganisationValidator: ExpressMiddlewareNext = (
//   request,
//   response,
//   next
// ) => {
//   if (!request.body.id) {
//     return badRequest(response, Constants.MESSAGES.ID_REQ.code);
//   }
//   if (
//     request.body.org_name !== undefined &&
//     request.body.org_name.trim() === ""
//   ) {
//     return badRequest(response, Constants.MESSAGES.ORG_NAME_REQUIRED.code);
//   }

//   // if (
//   //   request.body.org_type !== undefined &&
//   //   !enums.OrganisationType.includes(request.body.org_type)
//   // ) {
//   //   return badRequest(response, Constants.MESSAGES.INVALID_ORG_TYPE.code);
//   // }

//   if (
//     request.body.institution_code !== undefined ||
//     request.body.internal_code !== undefined
//   ) {
//     return badRequest(
//       response,
//       Constants.MESSAGES.FORBIDDEN_INTERNAL_FIELDS.FORBIDDEN.code
//     );
//   }

//   if (
//     request.body.building_size !== undefined &&
//     (typeof request.body.building_size !== "number" ||
//       request.body.building_size < 3 ||
//       request.body.building_size > 1000)
//   ) {
//     return badRequest(response, Constants.MESSAGES.INVALID_BUILDING_SIZE.code);
//   }

//   // if (
//   //   request.body.area_in !== undefined &&
//   //   !enums.AreaIn.includes(request.body.area_in)
//   // ) {
//   //   return badRequest(response, Constants.MESSAGES.INVALID_AREA_IN.code);
//   // }

//   if (
//     request.body.number_of_rooms !== undefined &&
//     (typeof request.body.number_of_rooms !== "number" ||
//       request.body.number_of_rooms < 0)
//   ) {
//     return badRequest(response, Constants.MESSAGES.INVALID_ROOMS.code);
//   }

//   if (
//     request.body.protected_space !== undefined &&
//     typeof request.body.protected_space !== "boolean"
//   ) {
//     return badRequest(
//       response,
//       Constants.MESSAGES.INVALID_PROTECTED_SPACE.code
//     );
//   }

//   if (
//     request.body.number_of_patients !== undefined &&
//     (typeof request.body.number_of_patients !== "number" ||
//       request.body.number_of_patients < 0 ||
//       request.body.number_of_patients > 30)
//   ) {
//     return badRequest(response, Constants.MESSAGES.INVALID_PATIENT_COUNT.code);
//   }

//   if (request.body.operating_hours !== undefined) {
//     if (
//       !Array.isArray(request.body.operating_hours) ||
//       request.body.operating_hours.length === 0
//     ) {
//       return badRequest(
//         response,
//         Constants.MESSAGES.OPERATING_HOURS_REQUIRED.code
//       );
//     }
//     for (const item of request.body.operating_hours) {
//       if (!item.day || !item.startTime || !item.endTime) {
//         return badRequest(
//           response,
//           Constants.MESSAGES.INVALID_OPERATING_HOURS.code
//         );
//       }
//     }
//   }

//   if (request.body.contacts !== undefined) {
//     if (
//       !Array.isArray(request.body.contacts) ||
//       request.body.contacts.length === 0
//     ) {
//       return badRequest(response, Constants.MESSAGES.CONTACT_REQUIRED.code);
//     }
//     for (const contact of request.body.contacts) {
//       if (!contact.name || !contact.role || !contact.phone || !contact.email) {
//         return badRequest(response, Constants.MESSAGES.INVALID_CONTACT.code);
//       }
//     }
//   }

//   if (Array.isArray(request.body.fixed_cost)) {
//     for (const cost of request.body.fixed_cost) {
//       if (
//         !cost.type ||
//         typeof cost.amount !== "number" ||
//         !["monthly", "yearly"].includes(cost.recurrence)
//       ) {
//         return badRequest(response, Constants.MESSAGES.INVALID_FIXED_COST.code);
//       }
//     }
//   }

//   next();
// };

export const updateOrganisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ORG_ID_REQUIRED.code);
  }

  if (request.body.organisation_id) {
    return badRequest(
      response,
      Constants.MESSAGES.FORBIDDEN_INTERNAL_FIELDS.FORBIDDEN.code
    );
  }
  if (request.body.internal_code) {
    return badRequest(
      response,
      Constants.MESSAGES.FORBIDDEN_INTERNAL_FIELDS.FORBIDDEN.code
    );
  }
  if (request.body.is_deleted) {
    return badRequest(
      response,
      Constants.MESSAGES.FORBIDDEN_INTERNAL_FIELDS.FORBIDDEN.code
    );
  }

  next();
};

export const deleteOrganisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.params.id) {
    return badRequest(response, Constants.MESSAGES.ID_REQ.code);
  }
  next();
};

export const listOrganisationValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if (!request.body.page) {
    return badRequest(response, Constants.MESSAGES.PAGE.code);
  }
  if (!request.body.limit) {
    return badRequest(response, Constants.MESSAGES.LIMIT.code);
  }
  next();
};

export const changeOperatingHoursOrganisationValidator: ExpressMiddlewareNext =
  (request, response, next) => {
    if (!request.body.id) {
      return badRequest(response, Constants.MESSAGES.ID_REQ.code);
    }
    if (
      request.body.operating_hours &&
      !Array.isArray(request.body.operating_hours)
    ) {
      return badRequest(
        response,
        Constants.MESSAGES.INVALID_FORMAT.code ||
          "Working hours must be an array"
      );
    }
    next();
  };
