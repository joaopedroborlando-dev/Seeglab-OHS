import * as service from "../service/roleService";
import IRoleDto from "../dto/IRoleDto";
import { Request, Response } from "express";

const createRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IRoleDto = req.body;
        if (!data || !data.departmentId || !data.description) return res.status(400).send("BAD_REQUEST");
        const createdRole = await service.createRole(data);
        return res.status(201).send(createdRole);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const updateRole = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IRoleDto = req.body;
        if (!data || !data.id) return res.status(400).send("BAD_REQUEST");
        const updatedRole = await service.updateRole(data);
        return res.status(200).send(updatedRole);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const findAllRoles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.body.page as string) || 1;
        const limit = parseInt(req.body.limit as string) || 10;
        const search = req.query.search as string;
        const dbRes = await service.findAllRoles({ page, limit, search })
        return res.status(200).send(dbRes);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

const findAllRolesByDepartmentId = async (req: Request, res: Response): Promise<Response> => {
    try {
        const page = parseInt(req.body.page as string) || 1;
        const limit = parseInt(req.body.limit as string) || 100;
        const search = req.body.search as string;
        const departmentId = parseInt(req.body.departmentId) || -1;
        const dbRes = await service.findAllRolesByDepartmentId({ page, limit, search }, departmentId);
        return res.status(200).send(dbRes);
    } catch (err: any) {
        return res.status(400).send(err.message);
    }
}

export {
    createRole,
    updateRole,
    findAllRoles,
    findAllRolesByDepartmentId,
}
