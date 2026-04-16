import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@local.test' },
    update: {},
    create: {
      email: 'admin@local.test',
      name: 'Admin',
      passwordHash: await bcrypt.hash('Admin@12345', 10),
    },
  });

  await prisma.folder.createMany({
    data: [
      { userId: user.id, name: 'Inbox', systemKey: 'inbox' },
      { userId: user.id, name: 'Propaganda', systemKey: 'propaganda' },
      { userId: user.id, name: 'Arquivados', systemKey: 'archive' },
    ],
    skipDuplicates: true,
  });
}

main().finally(async () => prisma.$disconnect());
