import express from "express";
import * as controller from "../controller/workUnitController";
import {requestValidation} from "../../../util/requestValidation";

const router = express.Router();

router.use(requestValidation);

router.post('/find-many-by-inventory', controller.findManyByInventoryId);
router.post('/create', controller.createWorkUnit);
router.delete('/delete', controller.deleteWorkUnit);
router.get('/find-last', controller.findLastUpdatedWorkUnit);
router.get('/find-related-by-id', controller.findRelatedWorkUnits);

export default router;