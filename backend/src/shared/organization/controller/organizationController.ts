import {Request, Response} from "express";
import * as service from "../../../shared/organization/service/organizationService";

const createOrganization = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: any = req.body;
        if (!data) return res.status(400).send("Bad Request");
        await service.createOrganization(data);
        return res.status(201).send(true);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

export {
    createOrganization,
}