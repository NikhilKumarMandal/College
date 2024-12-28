import { Router } from "express";
import { AuthController } from "../controllers/auth.controllers";
import { Logger } from "winston";
import logger from "../config/logger";

const router = Router();

const authController = new AuthController(logger);

router.post("/google", authController.create);

export default router;
