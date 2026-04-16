import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AutomationService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.automationRule.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  create(userId: string, payload: { name: string; condition: string; action: string; enabled?: boolean }) {
    return this.prisma.automationRule.create({
      data: {
        userId,
        name: payload.name,
        condition: payload.condition,
        action: payload.action,
        enabled: payload.enabled ?? true,
      },
    });
  }
}
