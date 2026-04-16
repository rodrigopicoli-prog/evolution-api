import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { SendEmailDto, UpdateEmailDto } from './dto';
import { EmailsService } from './emails.service';

@Controller('emails')
@UseGuards(JwtAuthGuard)
export class EmailsController {
  constructor(private readonly service: EmailsService) {}

  @Get()
  inbox(
    @CurrentUser() user: { userId: string },
    @Query('accountId') accountId?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.service.inbox(user.userId, { accountId, category, search });
  }

  @Patch(':id')
  update(@CurrentUser() user: { userId: string }, @Param('id') id: string, @Body() body: UpdateEmailDto) {
    return this.service.update(user.userId, id, body);
  }

  @Post('send')
  send(@CurrentUser() user: { userId: string }, @Body() body: SendEmailDto) {
    return this.service.send(user.userId, body);
  }
}
