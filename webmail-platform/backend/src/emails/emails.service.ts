import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CryptoService } from '../common/crypto.service';
import { PrismaService } from '../prisma/prisma.service';
import { SendEmailDto, UpdateEmailDto } from './dto';

@Injectable()
export class EmailsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
  ) {}

  inbox(userId: string, params: { accountId?: string; category?: string; search?: string }) {
    return this.prisma.email.findMany({
      where: {
        userId,
        emailAccountId: params.accountId,
        aiCategory: params.category,
        OR: params.search
          ? [
              { subject: { contains: params.search, mode: 'insensitive' } },
              { fromAddress: { contains: params.search, mode: 'insensitive' } },
              { textBody: { contains: params.search, mode: 'insensitive' } },
            ]
          : undefined,
      },
      orderBy: { receivedAt: 'desc' },
      take: 100,
    });
  }

  async update(userId: string, id: string, dto: UpdateEmailDto) {
    await this.prisma.email.updateMany({ where: { id, userId }, data: dto });
    return this.prisma.email.findFirst({ where: { id, userId } });
  }

  async send(userId: string, dto: SendEmailDto) {
    const account = await this.prisma.emailAccount.findFirstOrThrow({ where: { id: dto.accountId, userId } });
    const transporter = nodemailer.createTransport({
      host: account.smtpHost,
      port: account.smtpPort,
      secure: account.useTls,
      auth: {
        user: account.username,
        pass: this.crypto.decrypt(account.passwordEncrypted),
      },
    });

    const info = await transporter.sendMail({
      from: account.email,
      to: dto.to,
      subject: dto.subject,
      text: dto.body,
    });

    await this.prisma.auditLog.create({
      data: { userId, action: 'EMAIL_SENT', metadata: JSON.stringify({ messageId: info.messageId, to: dto.to }) },
    });

    return { messageId: info.messageId };
  }
}
