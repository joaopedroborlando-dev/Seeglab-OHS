import express from "express";
import * as controller from "../controller/hazardAssessmentController";
import {requestValidation} from "../../../util/requestValidation";

const router = express.Router();

router.use(requestValidation);

router.post('/create', controller.createHazardAssessment);
router.get('/find-by-id', controller.findById);

export default router;