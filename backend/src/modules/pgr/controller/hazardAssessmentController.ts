import {Request, Response} from "express";
import * as service from "../service/hazardAssessmentService";
import IHazardAssessmentDto from "../dto/IHazardAssessmentDto";

const createHazardAssessment = async (req: Request, res: Response): Promise< Response> => {
    try{
        const data:IHazardAssessmentDto = req.body;
        if(!data) res.status(400).send("Bad Request");
        return res.status(201).send(
            await service.createHazardAssessment(data)
        )
    }catch(err:any){
        return res.status(500).send(err.message)
    }
}

const findById = async (req: Request, res: Response):Promise<Response> => {
    try {
        const id = parseInt(req.query.id as string);
        if(!id) res.status(400).send("Bad Request");
        return res.status(201).send(
            await service.findById(id)
        )
    }catch(err:any){
        return res.status(500).send(err.message)
    }
}

export {
    createHazardAssessment,
    findById
}