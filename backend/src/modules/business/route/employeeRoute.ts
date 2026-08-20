import { Router } from "express";
import * as controller from "../controller/EmployeeController";

const employeeRoutes = Router();

employeeRoutes.post("/create", controller.createEmployee);
employeeRoutes.post("/update", controller.updateEmployee);
employeeRoutes.delete("/delete/:id", controller.deleteEmployee);
employeeRoutes.post("/find-all", controller.findAllEmployees);

export default employeeRoutes;
