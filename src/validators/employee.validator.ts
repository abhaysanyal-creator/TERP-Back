import { badRequest } from "../response/response.ts";
import type { ExpressMiddlewareNext } from "../types/express.types.ts";
import Lang from "../locales/en.json" with {type:"json"}
import enums from "../enums.json" with {type:"json"}
import Constants from "../locales/constants.ts"

export const createEmployeeValidator: ExpressMiddlewareNext = (
  request,
  response,
  next
) => {
  if(!request.body.created_by) {

    return badRequest(response,Lang.CREATED_BY_REQ||"Created By Required")
  }
  if (!request.body.first_Name || request.body.first_Name.trim() === "") {
    return badRequest(
      response,
      Lang.FIRST_NAME_REQUIRED || "First Name is required"
    );
  }

  if (!request.body.last_Name || request.body.last_Name.trim() === "") {
    return badRequest(
      response,
      Lang.LAST_NAME_REQUIRED || "Last Name is required"
    );
  }

  if (!request.body.national_id) {
    return badRequest(
      response,
      Lang.NATIONAL_ID_REQUIRED || "National ID is required"
    );
  }
  
  if (!request.body.employee_type || !enums.EmployeeType.includes(request.body.employee_type)) {
    return badRequest(
      response,
      Lang.INVALID_EMPLOYEE_TYPE || "Invalid employee type"
    );
  }

  if (!request.body.gender || !enums.Gender.includes(request.body.gender)) {
    return badRequest(response, Lang.INVALID_GENDER || "Invalid gender");
  }

  if (!request.body.hire_date || isNaN(Date.parse(request.body.hire_date))) {
    return badRequest(
      response,
      Lang.HIRE_DATE_REQUIRED || "Valid hire date is required"
    );
  }

  if (!request.body.dob || isNaN(Date.parse(request.body.dob))) {
    return badRequest(
      response,
      Lang.DOB_REQUIRED || "Valid date of birth is required"
    );
  }

  if (
    request.body.job_percentage === undefined ||
    typeof request.body.job_percentage !== "number" ||
    request.body.job_percentage < 0 ||
    request.body.job_percentage > 100
  ) {
    return badRequest(
      response,
      Lang.JOB_PERCENTAGE_INVALID || "Job percentage must be between 0 and 100"
    );
  }

  if (!request.body.address) {
    return badRequest(response, Lang.ADDRESS_REQUIRED || "Address is required");
  }
  const { city, street, houseNumber, postalCode } = request.body.address;
  if (!city || !street || !houseNumber || !postalCode) {
    return badRequest(
      response,
      Lang.ADDRESS_FIELDS_REQUIRED || "All address fields are required"
    );
  }

  if (!(request.body.mobile_phones)) {
    return badRequest(
      response,
      Lang.MOBILE_PHONE_REQUIRED ||
        "At least one mobile phone number is required"
    );
  }

  if (!request.body.emails) {
    return badRequest(
      response,
      Lang.EMAIL_REQUIRED || "Email address is required"
    );
  }

  if (typeof request.body.team_leader !== "boolean") {
    return badRequest(
      response,
      Lang.INVALID_TEAM_LEADER || "Team Leader must be true or false"
    );
  }

  if (!Array.isArray(request.body.position_types) || request.body.position_types.length === 0) {
    return badRequest(
      response,
      Lang.POSITION_TYPES_REQUIRED || "At least one position type is required"
    );
  }

  if (!Array.isArray(request.body.employee_roles) || request.body.employee_roles.length === 0) {
    return badRequest(
      response,
      Lang.EMPLOYEE_ROLES_REQUIRED || "At least one employee role is required"
    );
  }

  if (request.body.working_hours && !Array.isArray(request.body.working_hours)) {
    return badRequest(
      response,
      Lang.INVALID_WORKING_HOURS || "Working hours must be an array"
    );
  }
  next();
};

export const viewEmployeeValidator:ExpressMiddlewareNext =(request,response,next) => {
  if(!request.params.id){
return badRequest(response,Lang.ID_REQUIRED)
  }
next()
}

export const updateEmployeeValidator:ExpressMiddlewareNext = (request,response,next) => {
if(!request.params.id){
  return badRequest(response,Lang.ID_REQUIRED)
}
if(!request.body.created_by) {

    return badRequest(response,Lang.CREATED_BY_REQ||"Created By Required")
  }
  if (!request.body.first_Name || request.body.first_Name.trim() === "") {
    return badRequest(
      response,
      Lang.FIRST_NAME_REQUIRED || "First Name is required"
    );
  }

  if (!request.body.last_Name || request.body.last_Name.trim() === "") {
    return badRequest(
      response,
      Lang.LAST_NAME_REQUIRED || "Last Name is required"
    );
  }

  if (!request.body.national_id) {
    return badRequest(
      response,
      Lang.NATIONAL_ID_REQUIRED || "National ID is required"
    );
  }
  
  if (!request.body.employee_type || !enums.EmployeeType.includes(request.body.employee_type)) {
    return badRequest(
      response,
      Lang.INVALID_EMPLOYEE_TYPE || "Invalid employee type"
    );
  }

  if (!request.body.gender || !enums.Gender.includes(request.body.gender)) {
    return badRequest(response, Lang.INVALID_GENDER || "Invalid gender");
  }

  if (!request.body.hire_date || isNaN(Date.parse(request.body.hire_date))) {
    return badRequest(
      response,
      Lang.HIRE_DATE_REQUIRED || "Valid hire date is required"
    );
  }

  if (!request.body.dob || isNaN(Date.parse(request.body.dob))) {
    return badRequest(
      response,
      Lang.DOB_REQUIRED || "Valid date of birth is required"
    );
  }

  if (
    request.body.job_percentage === undefined ||
    typeof request.body.job_percentage !== "number" ||
    request.body.job_percentage < 0 ||
    request.body.job_percentage > 100
  ) {
    return badRequest(
      response,
      Lang.JOB_PERCENTAGE_INVALID || "Job percentage must be between 0 and 100"
    );
  }

  if (!request.body.address) {
    return badRequest(response, Lang.ADDRESS_REQUIRED || "Address is required");
  }
  const { city, street, houseNumber, postalCode } = request.body.address;
  if (!city || !street || !houseNumber || !postalCode) {
    return badRequest(
      response,
      Lang.ADDRESS_FIELDS_REQUIRED || "All address fields are required"
    );
  }

  if (!(request.body.mobile_phones)) {
    return badRequest(
      response,
      Lang.MOBILE_PHONE_REQUIRED ||
        "At least one mobile phone number is required"
    );
  }

  if (!request.body.emails) {
    return badRequest(
      response,
      Lang.EMAIL_REQUIRED || "Email address is required"
    );
  }

  if (typeof request.body.team_leader !== "boolean") {
    return badRequest(
      response,
      Lang.INVALID_TEAM_LEADER || "Team Leader must be true or false"
    );
  }

  if (!Array.isArray(request.body.position_types) || request.body.position_types.length === 0) {
    return badRequest(
      response,
      Lang.POSITION_TYPES_REQUIRED || "At least one position type is required"
    );
  }

  if (!Array.isArray(request.body.employee_roles) || request.body.employee_roles.length === 0) {
    return badRequest(
      response,
      Lang.EMPLOYEE_ROLES_REQUIRED || "At least one employee role is required"
    );
  }

  if (request.body.working_hours && !Array.isArray(request.body.working_hours)) {
    return badRequest(
      response,
      Lang.INVALID_WORKING_HOURS || "Working hours must be an array"
    );
  }
  next();
}

export const deleteEmployeeValidator:ExpressMiddlewareNext = (request,response,next) => {
if(!request.params.id){
return badRequest(response,Constants.MESSAGES.ID_REQ.code)
}
next()
}

export const changeWorkingHoursEmployeeValidator:ExpressMiddlewareNext = (request,response,next) => {

if(!request.body.id){
return badRequest(response,Constants.MESSAGES.ID_REQ.code)
}
if (request.body.working_hours && !Array.isArray(request.body.working_hours)) {
    return badRequest(
      response,
      Constants.MESSAGES.INVALID_FORMAT.code || "Working hours must be an array"
    );
  }
next()
}

export const listEmployeeValidator:ExpressMiddlewareNext =(request,response,next) => {
if(!request.body.page) {
  return badRequest(response,Constants.MESSAGES.PAGE.code)
}
if(!request.body.limit) {
  return badRequest(response,Constants.MESSAGES.LIMIT.code)
}
next();
}