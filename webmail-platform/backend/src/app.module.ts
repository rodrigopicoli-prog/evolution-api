import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailAccountsModule } from './email-accounts/email-accounts.module';
import { EmailsModule } from './emails/emails.module';
import { AiModule } from './ai/ai.module';
import { QueueModule } from './queue/queue.module';
import { AutomationModule } from './automation/automation.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    EmailAccountsModule,
    EmailsModule,
    AiModule,
    QueueModule,
    AutomationModule,
    AuditModule,
  ],
})
export class AppModule {}
