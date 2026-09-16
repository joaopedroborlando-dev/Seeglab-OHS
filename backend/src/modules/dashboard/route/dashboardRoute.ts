import { Router } from "express";
import * as controller from "../controller/dashboardController";

const routes = Router();

routes.get("/row-factors-scores", controller.getRowFactorsScores);
routes.get("/epi-delivery-stats", controller.getEpiDeliveryStats);

export default routes;
