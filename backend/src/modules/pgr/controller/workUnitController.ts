import { Request, Response } from "express";
import * as service from "../service/workUnitService";
import IWorkUnitDto from "../dto/IWorkUnitDto";

const findManyByInventoryId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: { inventoryId: number } = req.body;
        return res.status(200).send(
            await service.findManyByInventoryId(data.inventoryId)
        )
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const createWorkUnit = async (req: Request, res: Response) => {
    try {
        const data: IWorkUnitDto = req.body;
        if (!data || !data.departmentId || !data.inventoryId) return res.status(400).send("Bad Request");
        const createdDept = await service.createWorkUnit(data);
        return res.status(201).send(createdDept);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const deleteWorkUnit = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.query.id as string);
        if (isNaN(id)) {
            return res.status(400).json({ message: "INVALID_ID" });
        }
        const deleted = await service.deleteById(id);
        return res.status(200).send(deleted);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const findLastUpdatedWorkUnit = async (req: Request, res: Response) => {
    try {
        const workUnit = await service.findLastUpdatedWorkUnit();
        return res.status(200).send(workUnit);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const findRelatedWorkUnits = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.query.id as string);
        if (isNaN(id)) {
            return res.status(400).json({ message: "INVALID_ID" });
        }
        const workUnit = await service.findRelatedWorkUnits(id);
        return res.status(200).json(workUnit);
    } catch (err: any) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}

export {
    findManyByInventoryId,
    createWorkUnit,
    deleteWorkUnit,
    findLastUpdatedWorkUnit,
    findRelatedWorkUnits,
}