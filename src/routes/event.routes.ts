import { Router } from "express";
import { EventController } from "../controllers/event.controllers";
import { EventService } from "../services/eventServices";
import logger from "../config/logger";
import { verifyUser } from "../middlewares/auth.middleware";
import { canAccess } from "../middlewares/canAccess";

const router = Router();

const eventService = new EventService();
const eventController = new EventController(logger, eventService);

router.post(
  "/create-event",
  verifyUser,
  canAccess,
  eventController.createEvent
);

export default router;
