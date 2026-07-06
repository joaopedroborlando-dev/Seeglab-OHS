import express from "express";
import { requestValidation } from "../../../util/requestValidation";
import * as controller from "../../epi/controller/epiController";

const router = express.Router();

router.use(requestValidation);

router.post('/create', controller.createEpi);
router.post('/update', controller.updateEpi);
router.post('/find-all', controller.findAllEpis);
router.delete('/delete/:id', controller.deleteEpi);

export default router;
