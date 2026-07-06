import express from "express";
import * as controller from "../controller/rowFactorController";
import { requestValidation } from "../../../util/requestValidation";

const router = express.Router();

router.use(requestValidation);

router.post('/create', controller.createRowFactor);
router.delete('/delete', controller.deleteRowFactor);

export default router;