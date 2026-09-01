import express from "express";
import { requestValidation } from "../../../util/requestValidation";
import * as controller from "../../epi/controller/epiDeliveryController";

const router = express.Router();

router.use(requestValidation);

router.get('/context', controller.getDeliveryContext);
router.get('/recommendations', controller.getRecommendations);
router.post('/create', controller.createDelivery);

export default router;
