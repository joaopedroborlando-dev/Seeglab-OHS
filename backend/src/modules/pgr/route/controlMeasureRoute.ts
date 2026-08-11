import express from "express";
import { requestValidation } from "../../../util/requestValidation";
import * as controller from "../controller/controlMeasureController";

const router = express.Router();

router.use(requestValidation);

router.post('/create', controller.createControlMeasure);
router.delete('/delete', controller.deleteControlMeasure);

export default router;