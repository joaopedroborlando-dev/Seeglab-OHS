import * as service from "../service/factorService";
import IFactorDto from "../dto/IFactorDto";
import { Request, Response } from "express";

const createFactor = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IFactorDto = req.body;
        if (!data) return res.status(400).send("Bad Request");
        const createdFactor = await service.createFactor(data);
        return res.status(201).send(createdFactor);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const updateFactor = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IFactorDto = req.body;
        if (!data || !data.id) return res.status(400).send("Bad Request");
        const updatedFactor = await service.updateFactor(data);
        return res.status(200).send(updatedFactor);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const findAllFactorsByHazardId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const search = req.query.search as string;
        const hazardId = parseInt(req.query.hazardId as string) || -1;
        const dbRes = await service.findAllFactorsByHazardId({page,limit,search},hazardId)
        return res.status(200).send(dbRes);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

export {
    createFactor,
    updateFactor,
    findAllFactorsByHazardId,
}
