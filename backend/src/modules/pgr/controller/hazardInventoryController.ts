import { Request, Response } from "express";
import IHazardInventoryDto from "../dto/IHzardInventoryDto";
import * as service from "../service/hazardInventoryService";

const createHazardInventory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IHazardInventoryDto = req.body;
        if (!data || data.name.trim().length == 0) return res.status(400).send("BAD_REQUEST");
        return res.status(200).send(
            await service.createHazardInventory(data)
        )
    } catch (err: any) {
        return res.status(500).send(err.message)
    }
}

const findAllInventories = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.body.page as string) || 1;
        const limit = parseInt(req.body.limit as string) || 10;
        const search = req.body.search as string;
        const dbRes = await service.findAllInventories({ page, limit, search })
        return res.status(200).send(dbRes);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const findOneById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: { inventoryId: number } = req.body;
        return res.status(201).send(
            await service.findOneById(data.inventoryId)
        )
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}
export {
    createHazardInventory,
    findAllInventories,
    findOneById,
}