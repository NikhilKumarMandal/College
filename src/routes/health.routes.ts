import express from "express";
import { checkHealth } from "../controllers/health.controllers";

const router = express.Router();

router.get("/", checkHealth);

export default router;
