import { PrismaClient } from '@prisma/client';
import { Worker } from 'bullmq';
import { ImapFlow } from 'imapflow';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

new Worker(
  'imap-sync',
  async (job) => {
    const { emailAccountId } = job.data as { emailAccountId: string };
    const account = await prisma.emailAccount.findUniqueOrThrow({ where: { id: emailAccountId } });

    const client = new ImapFlow({
      host: account.imapHost,
      port: account.imapPort,
      secure: account.useTls,
      auth: { user: account.username, pass: 'DECRYPT_IN_WORKER' },
    });

    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    try {
      for await (const msg of client.fetch('1:*', { envelope: true, source: true })) {
        const subject = msg.envelope?.subject || '(sem assunto)';
        const fromAddress = msg.envelope?.from?.[0]?.address || 'unknown';
        const textBody = Buffer.from(msg.source).toString('utf8').slice(0, 10000);

        const ai = await openai.responses.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          input: `Classifique em categoria e prioridade: ${subject}\n${textBody}`,
        });

        await prisma.email.upsert({
          where: { externalId_emailAccountId: { externalId: String(msg.uid), emailAccountId } },
          update: { subject, fromAddress, textBody, aiSummary: ai.output_text.slice(0, 500) },
          create: {
            externalId: String(msg.uid),
            emailAccountId,
            userId: account.userId,
            folderId: null,
            subject,
            fromAddress,
            toAddress: account.email,
            textBody,
            htmlBody: null,
            receivedAt: new Date(),
            aiSummary: ai.output_text.slice(0, 500),
          },
        });
      }
    } finally {
      lock.release();
      await client.logout();
    }
  },
  {
    connection: { host: process.env.REDIS_HOST || 'redis', port: Number(process.env.REDIS_PORT || 6379) },
  },
);

console.log('Worker IMAP iniciado');
