import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CreateEmailAccountDto } from './dto';
import { EmailAccountsService } from './email-accounts.service';

@Controller('email-accounts')
@UseGuards(JwtAuthGuard)
export class EmailAccountsController {
  constructor(private readonly service: EmailAccountsService) {}

  @Post()
  create(@CurrentUser() user: { userId: string }, @Body() body: CreateEmailAccountDto) {
    return this.service.create(user.userId, body);
  }

  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.service.list(user.userId);
  }
}
