import { Injectable } from '@nestjs/common';
import { events } from './data';

@Injectable()
export class EventsService {
    findAll(): any[] {
      try {
        return events
      } catch (error) {
        return [];
      }
    }
  
    findById(id: string): any {
      const events = this.findAll();
      return events.find(event => event.id === parseInt(id));
    }
  
    create(body: any): any {
      return 'This action creates an event';
    }
  
    update(id: string, body: any): any {
      return 'This action updates an event';
    }
  
    delete(id: string): any {
      return 'This action deletes an event';
    }
}
