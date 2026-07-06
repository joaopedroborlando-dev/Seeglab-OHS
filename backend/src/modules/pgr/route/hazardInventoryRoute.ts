import express from "express";
import * as controller from "../controller/hazardInventoryController";
import {requestValidation} from "../../../util/requestValidation";

const router = express.Router();

router.use(requestValidation);

router.post('/create', controller.createHazardInventory);
router.post('/find-all', controller.findAllInventories);
router.post('/find-one', controller.findOneById);

export default router;