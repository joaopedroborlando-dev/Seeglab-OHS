import express from "express";
import { requestValidation } from "../../../util/requestValidation";
import * as controller from "../../epi/controller/epiDeliveryController";

const router = express.Router();

router.use(requestValidation);

router.get('/context', controller.getDeliveryContext);
router.get('/work-unit-by-employee-id', controller.getWorkUnitByEmployeeId);
router.get('/recommendations', controller.getRecommendations);
router.post('/create', controller.createDelivery);
router.post('/find-all-deliveries', controller.findAllEpiDeliveries);

export default router;
