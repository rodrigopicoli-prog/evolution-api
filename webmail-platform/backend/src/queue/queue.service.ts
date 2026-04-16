import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private readonly syncQueue = new Queue('imap-sync', {
    connection: { host: process.env.REDIS_HOST || 'redis', port: Number(process.env.REDIS_PORT || 6379) },
  });

  enqueueImapSync(emailAccountId: string) {
    return this.syncQueue.add('sync-account', { emailAccountId }, { removeOnComplete: true, attempts: 3 });
  }
}
