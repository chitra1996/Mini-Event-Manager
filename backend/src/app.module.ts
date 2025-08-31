import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { AttendeesModule } from './attendees/attendees.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    EventsModule,
    AttendeesModule,
    CacheModule.register({
      ttl: 30000, // 30 seconds
      isGlobal: true, // Makes the cache module globally available
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
