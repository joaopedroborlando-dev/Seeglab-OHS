import { Request, Response } from "express";
import * as service from "../service/dashboardService";

export const getRowFactorsScores = async (req: Request, res: Response): Promise<Response> => {
    try {
        const counts = await service.getRowFactorScoreCounts();
        return res.status(200).send(counts);
    } catch (err: any) {
        return res.status(500).send({ message: err.message });
    }
};

export const getEpiDeliveryStats = async (req: Request, res: Response): Promise<Response> => {
    try {
        const stats = await service.getEpiDeliveryStats();
        return res.status(200).send(stats);
    } catch (err: any) {
        return res.status(500).send({ message: err.message });
    }
};
