import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): any[] {
    return this.eventsService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string): string {
    return this.eventsService.findById(id)
  }

  @Post()
  create(@Body() body: any): any {
    return this.eventsService.create(body)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any): any {
    return this.eventsService.update(id, body)
  }

  @Delete(':id')
  delete(@Param('id') id: string,): any {
    return this.eventsService.delete(id)
  }
}   
