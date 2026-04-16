import { Module } from '@nestjs/common';
import { CryptoService } from '../common/crypto.service';
import { EmailAccountsController } from './email-accounts.controller';
import { EmailAccountsService } from './email-accounts.service';

@Module({
  controllers: [EmailAccountsController],
  providers: [EmailAccountsService, CryptoService],
  exports: [EmailAccountsService],
})
export class EmailAccountsModule {}
