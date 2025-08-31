import { Body, Controller, Delete, Get, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('attendees')
@UseInterceptors(CacheInterceptor)
export class AttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.attendeesService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<any> {
    return this.attendeesService.findById(id)
  }

  @Post()
  create(@Body() body: any): Promise<any> {
    return this.attendeesService.create(body)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any): Promise<any> {
    return this.attendeesService.update(id, body)
  }

  @Delete(':id')
  delete(@Param('id') id: string,): Promise<any> {
    return this.attendeesService.delete(id)
  }
}   
