import express from 'express';
import * as controller from "../controller/departmentController";
import {requestValidation} from "../../../util/requestValidation";

const router = express.Router();

router.use(requestValidation);
router.post('/create', controller.createDepartment);
router.post('/update', controller.updateDepartment);
router.post('/find-all', controller.findAllDepartments);

export default router;