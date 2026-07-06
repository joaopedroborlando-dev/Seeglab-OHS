import express from 'express';
import * as controller from "../controller/factorController";
import {requestValidation} from "../../../util/requestValidation";

const router = express.Router();

router.use(requestValidation);

router.post('/create', controller.createFactor);
router.post('/update', controller.updateFactor);
router.get('/find-all-by-hazard', controller.findAllFactorsByHazardId);

export default router;