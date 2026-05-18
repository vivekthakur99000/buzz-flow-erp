import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.js";
import { ApiError } from "../utils/apiResponse.js";

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
    
        if (!req.user || !allowedRoles.includes(req.user.role)) {
           return new ApiError(403, "Forbidden: You do not have permission to perform this action").send(res);
        }

        next();
    };
};