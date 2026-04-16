import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('summarize')
  summarize(@Body() body: { subject: string; textBody: string }) {
    return this.ai.summarize(body.subject, body.textBody);
  }

  @Post('reply')
  reply(@Body() body: { subject: string; textBody: string }) {
    return this.ai.suggestReply(body.subject, body.textBody);
  }
}
