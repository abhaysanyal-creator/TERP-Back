import type { ExpressMiddlewareNext } from "../types/express.types.ts";
import Lang from "../locales/en.json" with {type:"json"}
import { badRequest } from "../response/response.ts";

export const adminCreateValidator:ExpressMiddlewareNext = (request,response,next) => {
    if(!request.body.username) {
        return badRequest(response,Lang.USERNAME_IS_REQUIRED)
    }
    if(!request.body.created_by) {
        return badRequest(response,Lang.CREATED_BY_REQ)
    }
    if(!request.body.name) {
        return badRequest(response,Lang.USERNAME_IS_REQUIRED)
    }
    if(!request.body.email) {
        return badRequest(response,Lang.EMAIL_IS_REQUIRED)
    }
    if(!request.body.password) {
        return badRequest(response,Lang.PASSWORD_IS_REQUIRED)
    }
    if(!request.body.contact_number) {
        return badRequest(response,Lang.CONTACT_REQUIRED)
    }
    if(!request.body.password) {
        return badRequest(response,Lang.PASSWORD_IS_REQUIRED)
}
if(!request.body.department) {
    return badRequest(response,Lang.DEPT_REQUIRED)
}
if(!request.body.role) {
    return badRequest(response,Lang.ROLE_IS_REQUIRED)
}
next()
}

export const viewAdminValidator:ExpressMiddlewareNext = (request,response,next) => {
    if(!request.params.id) {
        return badRequest(response,Lang.ID_REQUIRED)
    }
next()
}

export const updateAdminValidator:ExpressMiddlewareNext = (request,response,next) => {
    if(!request.params.id) {
        return badRequest(response,Lang.ID_REQUIRED)
    }
next()
}