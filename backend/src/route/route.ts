import { Router } from "express";
import hazardRoutes from "../modules/pgr/route/hazardRoute";
import factorRoutes from "../modules/pgr/route/factorRoute";
import roleRoutes from "../modules/business/route/roleRoute";
import departmentRoutes from "../modules/business/route/departmentRoute";
import hazardInventoryRoutes from "../modules/pgr/route/hazardInventoryRoute";
import workUnitRoutes from "../modules/pgr/route/workUnitRoute";
import hazardAssessmentRoutes from "../modules/pgr/route/hazardAssessmentRoute";
import rowFactorRoutes from "../modules/pgr/route/rowFactorRoute";
import organizationRoute from "../shared/organization/route/organizationRoute";
import controlMeasureRoute from "../modules/pgr/route/controlMeasureRoute";
import epiRoute from "../modules/epi/route/epiRoute";

import authRoute from "../modules/auth/route/authRoute";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/pgr/hazard", hazardRoutes);
routes.use("/pgr/factor", factorRoutes);
routes.use("/pgr/inventory", hazardInventoryRoutes);
routes.use("/pgr/work-unit", workUnitRoutes);
routes.use("/pgr/assessment", hazardAssessmentRoutes);
routes.use("/pgr/row", rowFactorRoutes);
routes.use("/pgr/control-measure", controlMeasureRoute);
routes.use("/epi", epiRoute);

routes.use("/business/role", roleRoutes);
routes.use("/business/department", departmentRoutes);

routes.use("/organization", organizationRoute);

export default routes;