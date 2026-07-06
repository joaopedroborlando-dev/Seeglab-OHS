import {Request, Response} from "express";
import * as service from "../service/controlMeasureService";
import IControlMeasureDto from "../dto/IControlMeasureDto";

const createControlMeasure = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: IControlMeasureDto = req.body;
        if (!data) return res.status(400).send("BAD_REQUEST");
        const controlMeasure = await service.createControlMeasure(data);
        return res.status(201).send(controlMeasure);
    } catch (err: any) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}

const deleteControlMeasure = async (req: Request, res: Response): Promise<Response> => {
    try{
        const id = parseInt(req.params.id);
        return res.status(201).send(
            await service.deleteControlMeasure(id)
        );
    }catch(err:any){
        console.log(err);
        return res.status(400).send(err.message);
    }
}

export{
    createControlMeasure,
    deleteControlMeasure,
}