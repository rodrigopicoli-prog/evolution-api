import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AuditService {
  private readonly logger = new Logger('AuditService');

  log(message: string, metadata?: Record<string, unknown>) {
    this.logger.log(JSON.stringify({ message, metadata }));
  }

  error(message: string, error: unknown, metadata?: Record<string, unknown>) {
    this.logger.error(JSON.stringify({ message, metadata, error }));
  }
}
