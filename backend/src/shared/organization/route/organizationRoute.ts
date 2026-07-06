import express from "express";
import * as controller from "../../../shared/organization/controller/organizationController";

const router = express.Router();

router.post('/register', controller.createOrganization);

export default router;