import { Request, Response } from "express";
import * as service from "../service/epiDeliveryService";
import IEpiDeliveryDto from "../dto/IEpiDeliveryDto";

export const getDeliveryContext = async (req: Request, res: Response): Promise<Response> => {
    try {
        const inventoryId = parseInt(req.query.inventoryId as string);
        if (!inventoryId) return res.status(400).send("inventoryId is required");
        const context = await service.getDeliveryContext(inventoryId);
        return res.status(200).send(context);
    } catch (err: any) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}

export const getRecommendations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const workUnitId = parseInt(req.query.workUnitId as string);
        if (!workUnitId) return res.status(400).send("workUnitId is required");
        const recommendations = await service.getRecommendations(workUnitId);
        return res.status(200).send(recommendations);
    } catch (err: any) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}

export const createDelivery = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IEpiDeliveryDto = req.body;
        if (!data || !data.employeeId || !data.items) {
            return res.status(400).send("BAD_REQUEST: employeeId and items are required");
        }
        const delivery = await service.createDelivery(data);
        return res.status(201).send(delivery);
    } catch (err: any) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}
