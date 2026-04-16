import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(private readonly prisma: PrismaService) {}

  async analyzeEmail(emailId: string, subject: string, body: string) {
    const prompt = `Classifique este email em JSON com campos: category, priority, summary, action, suggestedReply.\nSubject: ${subject}\nBody: ${body}`;
    const completion = await this.client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    await this.prisma.aiLog.create({
      data: { emailId, model: process.env.OPENAI_MODEL || 'gpt-4o-mini', prompt, response: raw },
    });

    return JSON.parse(raw);
  }

  async summarize(subject: string, body: string) {
    const completion = await this.client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: `Resuma este e-mail em até 2 frases: ${subject}\n${body}`,
    });
    return completion.output_text;
  }

  async suggestReply(subject: string, body: string) {
    const completion = await this.client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: `Escreva uma resposta profissional e objetiva para este e-mail: ${subject}\n${body}`,
    });
    return completion.output_text;
  }
}
