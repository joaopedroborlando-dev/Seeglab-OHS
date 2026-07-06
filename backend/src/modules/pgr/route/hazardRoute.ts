import express from 'express';
import * as controller from "../controller/hazardController";
import {requestValidation} from "../../../util/requestValidation";

const router = express.Router();

router.use(requestValidation);

router.post('/create', controller.createHazard);
router.post('/update', controller.updateHazard);
router.get('/find-all', controller.findAllHazards);

export default router;