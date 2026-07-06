import express from 'express';
import * as controller from "../controller/roleController";
import {requestValidation} from "../../../util/requestValidation";

const router = express.Router();

router.use(requestValidation);

router.post('/create', controller.createRole);
router.post('/update', controller.updateRole);
router.post('/find-all', controller.findAllRoles);
router.post('/find-all-by-department', controller.findAllRolesByDepartmentId);

export default router;