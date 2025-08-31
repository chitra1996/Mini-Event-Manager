import { Inject, Injectable } from '@nestjs/common';
import { attendees } from './data';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class AttendeesService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  private async getAttendees(): Promise<any[]> {
    return await this.cacheManager.get<Array<any>>('attendees') || [];
  }

  private async setAttendees(attendees: any[]): Promise<any[]> {
    return await this.cacheManager.set<Array<any>>('attendees', attendees, 864000) || [];
  }

  async findAll(): Promise<any[]> {
    try {
      const existingAttendees = await this.getAttendees();
      if (existingAttendees?.length) {
        return existingAttendees;
      } else {
        const cachedAttendees = await this.setAttendees(attendees)
        return cachedAttendees;
      }
    } catch (error) {
      return [];
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const existingAttendees = await this.getAttendees();
      if (existingAttendees?.length) {
        return existingAttendees.find(attendee => attendee.id === id);
      } else {
        return attendees.find(attendee => attendee.id === id);
      }
    } catch (error) {
      return null;
    }
  }

  async create(body: any): Promise<any> {
    try {
      const existingAttendees = await this.getAttendees();
      if (existingAttendees?.length) {
        existingAttendees.push(body);
        await await this.setAttendees(existingAttendees)
      } else {
        const attendeesList = [...attendees, body];
        await this.setAttendees(attendeesList)
      }
      return body;
    } catch (error) {
      return null;
    }
  }

  async update(id: string, body: any): Promise<any> {
    try {
      const existingAttendees = await this.getAttendees();
      if (existingAttendees?.length) {
        const updatedAttendees = existingAttendees.map((attendee: any) => {
          if (attendee.id === id) {
            return body;
          } return attendee;
        });
        await this.setAttendees(updatedAttendees)
        return body;
      }
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const existingAttendees = await this.getAttendees();
      if (existingAttendees?.length) {
        const remainingAttendees = existingAttendees.filter((attendee: any) => attendee.id !== id);
        await this.setAttendees(remainingAttendees)
        return id;
      }
    } catch (error) {
      return null;
    }
  }
}
