import {verifyToken} from '../auth/jwt';
import { Request, Response, NextFunction } from 'express';
import {requestContext} from "../context/requestContext";

declare global {
    namespace Express {
        interface Request {
            user?: string,
            organizationId?: string,
        }
    }
}

export const auth=async  (
    req: Request,
    res: Response,
    next: NextFunction
):Promise<any> => {
    if (req.path.startsWith('/auth/')) {
        return next();
    }

    try {
        const { authorization } = req.headers;
        if (!authorization) {
            return res.status(401).json({message: "UNAUTHORIZED"});
        }

        const token: string = authorization.replace('Bearer ', '');
        const payload = verifyToken(token);
        const { userId, organizationId } = payload;

        requestContext.run({ organizationId, userId }, () => {
            next();
        });

    } catch (err) {
        res.status(401).send("UNAUTHORIZED");
    }
}