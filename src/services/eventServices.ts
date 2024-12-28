import { EventData } from "../types/types";
import { Event } from "../models/event.model";

export class EventService {
  async create(data: EventData) {
    const event = await Event.create(data);
    return event.save();
  }

  async update(eventId: string, data: EventData) {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        $set: {
          ...data,
        },
      },
      {
        new: true,
      }
    );
    return updatedEvent;
  }

  async getAll() {
    const allEvent = await Event.find();
    return allEvent;
  }

  async delete(eventId: string) {
    const deleteEvent = await Event.findOneAndDelete({ _id: eventId });
    return deleteEvent;
  }
}
