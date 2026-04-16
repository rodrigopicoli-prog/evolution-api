import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { AutomationService } from './automation.service';

@Controller('automation-rules')
@UseGuards(JwtAuthGuard)
export class AutomationController {
  constructor(private readonly service: AutomationService) {}

  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.service.list(user.userId);
  }

  @Post()
  create(
    @CurrentUser() user: { userId: string },
    @Body() body: { name: string; condition: string; action: string; enabled?: boolean },
  ) {
    return this.service.create(user.userId, body);
  }
}
