import { Request, Response } from "express";
import * as service from "../service/epiService";
import IEpiDto from "../dto/IEpiDto";

const createEpi = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IEpiDto = req.body;
        if (!data || !data.name) return res.status(400).send("BAD_REQUEST");
        const epi = await service.createEpi(data);
        return res.status(201).send(epi);
    } catch (err: any) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}

const updateEpi = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IEpiDto = req.body;
        if (!data || !data.id) return res.status(400).send("BAD_REQUEST");
        const epi = await service.updateEpi(data);
        return res.status(200).send(epi);
    } catch (err: any) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}

const findAllEpis = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.body.page as string) || 1;
        const limit = parseInt(req.body.limit as string) || 10;
        const filter = req.body.filter;
        const dbRes = await service.findAllEpis({ page, limit, filter });
        return res.status(200).send(dbRes);
    } catch (err: any) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}

const deleteEpi = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id);
        return res.status(200).send(
            await service.deleteEpi(id)
        );
    } catch (err: any) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}

export {
    createEpi,
    updateEpi,
    findAllEpis,
    deleteEpi,
}
