import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware.js";

export const authorizeRoles = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
    
        if (!allowedRoles.includes(req.user.role)) {
           return res.status(403).json({ 
                success: false, 
                message: "Forbidden: You do not have permission to perform this action" 
            });
        }

        next();
    };
};