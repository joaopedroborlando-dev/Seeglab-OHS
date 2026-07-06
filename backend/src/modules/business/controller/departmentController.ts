import * as service from "../service/departmentService";
import IDepartmentDto from "../dto/IDepartmentDto";
import { Request, Response } from "express";

const createDepartment = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IDepartmentDto = req.body;
        if (!data) return res.status(400).send("BAD_REQUEST");
        const createdDepartment = await service.createDepartment(data);
        return res.status(201).send(createdDepartment);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const updateDepartment = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IDepartmentDto = req.body;
        if (!data || !data.id) return res.status(400).send("BAD_REQUEST");
        const updatedDepartment = await service.updateDepartment(data);
        return res.status(200).send(updatedDepartment);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const findAllDepartments = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.body.page as string) || 1;
        const limit = parseInt(req.body.limit as string) || 10;
        const search = req.body.search as string;
        const dbRes = await service.findAllDepartments({page,limit,search});
        return res.status(200).send(dbRes);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

export {
    createDepartment,
    updateDepartment,
    findAllDepartments,
}
