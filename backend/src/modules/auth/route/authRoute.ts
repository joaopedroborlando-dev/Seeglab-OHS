import { Router } from "express";
import { signUp, login } from "../controller/authController";

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", login);

export default authRoute;
