import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly service: StatsService) {}

  @Get(':id')
  async findOne(
    @Param('id') userId: string,
    @Query() query: Record<string, any>,
  ) {
    return query['$from']
      ? this.service.findAllUserStatsByDate(userId, new Date(query['$from']))
      : this.service.findAllUserStats(userId);
  }
}
