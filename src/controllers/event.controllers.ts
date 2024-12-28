import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Logger } from "winston";
import { EventService } from "../services/eventServices";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

export class EventController {
  constructor(
    private logger: Logger,
    private eventService: EventService
  ) {}

  createEvent = asyncHandler(async (req: Request, res: Response) => {
    const {
      name,
      description,
      date,
      location,
      maxTeams,
      maxMembersPerTeam,
      type,
    } = req.body;

    const eventData = {
      name,
      description,
      date,
      location,
      maxTeams,
      maxMembersPerTeam,
      type,
    };

    const event = await this.eventService.create(eventData);
    this.logger.info("Event created successfully");
    res
      .status(200)
      .json(new ApiResponse(201, event, "Event creted successfully!"));
  });

  updateEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new ApiError(400, "Invalid event Id:");
    }

    const {
      name,
      description,
      date,
      location,
      maxTeams,
      maxMembersPerTeam,
      type,
    } = req.body;

    const eventData = {
      name,
      description,
      date,
      location,
      maxTeams,
      maxMembersPerTeam,
      type,
    };

    const updatedEvent = await this.eventService.update(eventId, eventData);
    this.logger.info("Event updated successfully");

    res
      .status(200)
      .json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
  });

  getAllEvent = asyncHandler(async (req: Request, res: Response) => {
    const allEvent = await this.eventService.getAll();
    this.logger.info("Fected all Event!");

    res
      .status(200)
      .json(new ApiResponse(200, allEvent, "Fected all event successfully"));
  });

  deleteEvent = asyncHandler(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new ApiError(400, "Invalid event Id:");
    }

    await this.eventService.delete(eventId);
    this.logger.info("Event deleted successfully!");

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Event deleted successfully!"));
  });
}
