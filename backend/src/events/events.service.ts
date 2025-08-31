import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { events } from './data';

@Injectable()
export class EventsService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  private async getEvents(): Promise<any[]> {
    return await this.cacheManager.get<Array<any>>('events') || [];
  }

  private async setEvents(events: any[]): Promise<any[]> {
    return await this.cacheManager.set<Array<any>>('events', events, 864000) || [];
  }

  async findAll(): Promise<any[]> {
    try {
      const existingEvents = await this.getEvents();
      if (existingEvents?.length) {
        return existingEvents;
      } else {
        const cachedEvents = await this.setEvents(events)
        return cachedEvents;
      }
    } catch (error) {
      return [];
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const existingEvents = await this.getEvents();
      if (existingEvents?.length) {
        return existingEvents.find(event => event.id === id);
      } else {
        return events.find(event => event.id === id);
      }
    } catch (error) {
      return null;
    }
  }

  async create(body: any): Promise<any> {
    try {
      const existingEvents = await this.getEvents();
      if (existingEvents?.length) {
        existingEvents.push(body);
        await await this.setEvents(existingEvents)
      } else {
        const eventsList = [...events, body];
        await this.setEvents(eventsList)
      }
      return body;
    } catch (error) {
      return null;
    }
  }

  async update(id: string, body: any): Promise<any> {
    try {
      const existingEvents = await this.getEvents();
      if (existingEvents?.length) {
        const updatedEvents = existingEvents.map((event: any) => {
          if (event.id === id) {
            return body;
          } return event;
        });
        await this.setEvents(updatedEvents)
        return body;
      } else {
        const eventsList = events.map((event: any) => {
          if (event.id === id) {
            return body;
          } return event;
        });
        await this.setEvents(eventsList)
        return body;
      }
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const existingEvents = await this.getEvents();
      if (existingEvents?.length) {
        const remainingEvents = existingEvents.filter((event: any) => event.id !== id);
        await this.setEvents(remainingEvents)
        return id;
      }
    } catch (error) {
      return null;
    }
  }
}
