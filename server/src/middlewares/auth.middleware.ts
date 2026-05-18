import type { Request,  Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import { ApiError } from "../utils/apiResponse.js";

export interface AuthRequest extends Request{
    user? : any
}

export const authMiddleware = async (req : AuthRequest, res : Response, next : NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Bearer ')){
        return new ApiError(401, 'Unauthorized: No token provided').send(res);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
            return new ApiError(401, 'Unauthorized: Token missing').send(res);
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);

        req.user = decoded;

        next();


    } catch (error) {
        return new ApiError(401, 'Unauthorized: Invalid token').send(res);
    }
}
