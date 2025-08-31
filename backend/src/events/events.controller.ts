import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('events')
@UseInterceptors(CacheInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.eventsService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<any> {
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
