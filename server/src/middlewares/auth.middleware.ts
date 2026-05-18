import type { Request,  Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request{
    user? : any
}

export const authMiddleware = async (req : AuthRequest, res : Response, next : NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({ success : false,  message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token missing' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET as string);

        req.user = decoded;

        next();


    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}
