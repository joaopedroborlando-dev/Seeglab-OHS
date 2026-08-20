import * as service from "../service/EmployeeService";
import IEmployeeDto from "../dto/IEmployeeDto";
import { Request, Response } from "express";

const createEmployee = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IEmployeeDto = req.body;
        if (!data || !data.name) return res.status(400).send("BAD_REQUEST");
        const createdEmployee = await service.createEmployee(data);
        return res.status(201).send(createdEmployee);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const updateEmployee = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IEmployeeDto = req.body;
        if (!data || !data.id) return res.status(400).send("BAD_REQUEST");
        const updatedEmployee = await service.updateEmployee(data);
        return res.status(200).send(updatedEmployee);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const findAllEmployees = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.body.page as string) || 1;
        const limit = parseInt(req.body.limit as string) || 10;
        const search = req.body.filter?.description || req.body.search as string;
        const dbRes = await service.findAllEmployees({ page, limit, search })
        return res.status(200).send(dbRes);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const deleteEmployee = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = parseInt(req.params.id as string);
        if (!id) return res.status(400).send("BAD_REQUEST");
        await service.deleteEmployee(id);
        return res.status(200).send({ message: "DELETED" });
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

export {
    createEmployee,
    updateEmployee,
    findAllEmployees,
    deleteEmployee,
}
