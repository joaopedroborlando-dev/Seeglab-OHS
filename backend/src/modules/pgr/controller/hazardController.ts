import {Request, Response} from "express";
import * as service from "../service/hazardService";
import IHazardDto from "../dto/IHazardDto";
import {requestValidation} from "../../../util/requestValidation";

const createHazard = async (req: Request, res: Response): Promise< Response> => {
    try{
        const data:IHazardDto = req.body;
        if(!data) res.status(400).send("Bad Request");
        return res.status(201).send(
            await service.createHazard(data)
        )
    }catch(err:any){
        return res.status(500).send(err.message)
    }
}

const updateHazard = async (req: Request, res: Response): Promise< Response> => {
    try{
        const data:IHazardDto = req.body;
        if(!data || !data.id) res.status(400).send("Bad Request");
        return res.status(201).send(
            await service.updateHazard(data)
        )
    }catch(err:any){
        return res.status(500).send(err.message)
    }
}

const findAllHazards = async (req: Request, res: Response): Promise< Response> => {
    try{
        return res.status(201).send(await service.findAllHazards());
    }catch(err:any){
        return res.status(500).send(err.message)
    }
}

export {
    createHazard,
    updateHazard,
    findAllHazards,
}