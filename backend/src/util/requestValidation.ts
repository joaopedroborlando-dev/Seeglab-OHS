import { Request, Response, NextFunction } from "express";
import {getContext} from "../context/requestContext";

export const requestValidation = (req: Request, res: Response, next: NextFunction) => {
    const { organizationId, userId } = getContext();
    if (!userId || !organizationId) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
    }

    next();
};