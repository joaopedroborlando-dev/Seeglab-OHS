import { Request, Response } from "express";
import * as service from "../service/rowFactorService";
import IRowFactorDto from "../dto/IRowFactorDto";

const createRowFactor = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IRowFactorDto = req.body;
        if (!data) return res.status(400).send("Bad Request");
        const createdFactor = await service.createRowFactor(data);
        return res.status(201).send(createdFactor);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const deleteRowFactor = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id: number = Number(req.query.id);
        const deleted = await service.deleteRowFactor(id);
        return res.status(200).send(deleted);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

export {
    createRowFactor,
    deleteRowFactor,
}