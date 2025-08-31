import { Module } from '@nestjs/common';
import { AttendeesController } from './attendees.controller';
import { AttendeesService } from './attendees.service';

@Module({
  controllers: [AttendeesController],
  providers: [AttendeesService]
})
export class AttendeesModule {}
