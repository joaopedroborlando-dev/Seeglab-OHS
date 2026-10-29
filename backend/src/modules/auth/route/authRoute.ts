import { Router } from "express";
import { signUp, login } from "../controller/authController";
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  ipv6Subnet: 56,
  message: { error: "TOO_MANY_ATTEMPS" },
});

const authRoute = Router();

authRoute.post("/signup", signUp);
authRoute.post("/login", loginLimiter, login);

export default authRoute;
