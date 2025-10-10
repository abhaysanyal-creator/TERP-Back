import { badRequest, success } from "../response/response.js";
import { changeWorkingHoursEmployeeService, createEmployeeService,deleteEmployeeService,updateEmployeeService, viewEmployeeService } from "../services/employee.service.js";
import type { ExpressMiddleware } from "../types/express.types.js";
import Lang from "../locales/en.json" with {type: "json"}
import { getErrorMessage } from "../middlewares/app.middlewares.js";
import mongoose from "mongoose";
import { adminCheck, ObjectId } from "../utils/helpers.js";
import Constants from "../locales/constants.js"

export const createEmployeeController: ExpressMiddleware = async (
    request,
    response
) => {
    try {
        const creator = await mongoose
            .model("users")
            .findOne({ _id: request.body.created_by })
            .exec();

        if (!creator) return badRequest(response, Lang.CREATED_BY_REQ)
if(!adminCheck(creator)) return badRequest(response,Lang.ADMIN_ACCESS)

const existingEmployee  =await mongoose.model("employees").findOne({email:request.body.email}).exec();

if(existingEmployee) return badRequest(response,Lang.EMAIL_ALREADY_EXISTS)

        const result = await createEmployeeService(request.body)
        return success(response, Lang.USER_CREATED, result)
    } catch (error) {
        console.error(error)
        return badRequest(response, getErrorMessage(error))
    }
};

export const viewEmployeeController:ExpressMiddleware = async (request,response) => {
    try {
   const result = await viewEmployeeService(request.params)
        return success(response, Lang.SUCCESS, result)
    } catch (error) {
        console.error(error)
        return badRequest(response, getErrorMessage(error))
    }
}

export const updateEmployeeController:ExpressMiddleware = async (request,response) => {
try {
    const employeeExists = await mongoose.model("employees").findById(request.params.id).exec();
if(!employeeExists) return badRequest(response,Constants.MESSAGES.EMP_NOT_FOUND.code)

    const result = await updateEmployeeService(request)
    return success(response,Constants.MESSAGES.SUCCESS.code,result)
} catch (error) {
    console.error(error)
    return badRequest(response,getErrorMessage(error))
}
}

export const deleteEmployeeController:ExpressMiddleware =async (request,response )=> {
try {
    const existingUser = await mongoose.model("employees").findById(request.params.id)
    if(!existingUser) return badRequest(response,Constants.MESSAGES.EMP_NOT_FOUND.code)

        const result = await deleteEmployeeService(request.params)
return success(response,Constants.MESSAGES.SUCCESS.code,{deleted_id:result._id,
    deleted_employee:result.emails,
    is_deleted:result.is_deleted
})
} catch (error) {
    console.error(error)
    return badRequest(response,getErrorMessage(error))
}
}

export const changeWorkingHoursEmployeeController:ExpressMiddleware = async(request,response) => {
try {
    const checkEmployee = await mongoose.model("employees").findOne({_id:ObjectId(request.body.id)}).exec()
if(!checkEmployee) return badRequest(response,Constants.MESSAGES.EMP_NOT_FOUND.code)
    console.log(checkEmployee.working_hours)
console.log(request.body.working_hours)
if(JSON.stringify(checkEmployee.working_hours)===JSON.stringify(request.body.working_hours)) {return badRequest(response,Constants.MESSAGES.CHANGE_HOURS.code)}
const result = await changeWorkingHoursEmployeeService(request.body)

return success(response,Constants.MESSAGES.SUCCESS.code,result)

} catch (error) {
    console.error(error)
    return badRequest(response,getErrorMessage(error))
}
}