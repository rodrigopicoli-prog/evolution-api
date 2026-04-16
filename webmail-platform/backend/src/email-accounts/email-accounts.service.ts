import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../common/crypto.service';
import { CreateEmailAccountDto } from './dto';

@Injectable()
export class EmailAccountsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
  ) {}

  create(userId: string, dto: CreateEmailAccountDto) {
    return this.prisma.emailAccount.create({
      data: {
        userId,
        name: dto.name,
        email: dto.email,
        imapHost: dto.imapHost,
        imapPort: dto.imapPort,
        smtpHost: dto.smtpHost,
        smtpPort: dto.smtpPort,
        username: dto.username,
        passwordEncrypted: this.crypto.encrypt(dto.password),
        useTls: dto.useTls,
      },
      select: { id: true, name: true, email: true, imapHost: true, smtpHost: true, useTls: true },
    });
  }

  list(userId: string) {
    return this.prisma.emailAccount.findMany({
      where: { userId },
      select: { id: true, name: true, email: true, imapHost: true, smtpHost: true, useTls: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
