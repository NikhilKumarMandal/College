import { Response, Request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Logger } from "winston";
import { EventService } from "../services/eventServices";
import { ApiResponse } from "../utils/ApiResponse";

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
}
