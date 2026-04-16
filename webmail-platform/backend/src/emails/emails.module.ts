import { Module } from '@nestjs/common';
import { CryptoService } from '../common/crypto.service';
import { EmailsController } from './emails.controller';
import { EmailsService } from './emails.service';

@Module({
  controllers: [EmailsController],
  providers: [EmailsService, CryptoService],
})
export class EmailsModule {}
