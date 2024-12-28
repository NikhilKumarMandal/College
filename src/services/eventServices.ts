import { EventData } from "../types/types";
import { Event } from "../models/event.model";

export class EventService {
  async create(data: EventData) {
    const event = await Event.create(data);
    return event.save();
  }
}
