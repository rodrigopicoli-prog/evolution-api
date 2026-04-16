# Webmail AI Self-Hosted (VPS)

Plataforma completa de webmail com múltiplas contas, IA da OpenAI e arquitetura pronta para evolução multiusuário.

## 1) Estrutura do projeto

```txt
webmail-platform/
  backend/     # NestJS + Prisma + JWT + SMTP/IMAP API
  frontend/    # Next.js + Tailwind (dashboard/helpdesk style)
  worker/      # BullMQ worker para sync IMAP + IA
  nginx/       # Proxy reverso
  docker-compose.yml
  .env.example
```

## 2) Pré-requisitos na VPS

- Ubuntu 22.04+ (ou similar)
- Docker + Docker Compose plugin
- DNS apontando para a VPS

## 3) Instalação passo a passo

1. Copie os arquivos para a VPS.
2. Crie o arquivo de ambiente:
   ```bash
   cp .env.example .env
   ```
3. Edite `.env` com suas credenciais (PostgreSQL, JWT, OpenAI, chave de criptografia).
4. Suba os serviços:
   ```bash
   docker compose up -d
   ```
5. Verifique logs:
   ```bash
   docker compose logs -f backend worker frontend nginx
   ```

## 4) Fluxo funcional

- **Cadastro/Login** com JWT.
- **Múltiplas contas IMAP/SMTP por usuário**.
- **Inbox unificada** com filtros por conta, categoria e busca.
- **Ações de e-mail**: lido/não lido, arquivar, excluir, favoritar.
- **Aba Propaganda** para newsletters/promocionais.
- **Regras automáticas** configuráveis por usuário.
- **Sync periódico** via filas BullMQ + worker IMAP.
- **IA OpenAI** para categoria, prioridade, resumo, ação e sugestão de resposta.

## 5) OpenAI (integração)

1. Defina em `.env`:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (ex.: `gpt-4o-mini`)
2. Endpoints principais:
   - `POST /api/ai/summarize`
   - `POST /api/ai/reply`
3. Worker usa OpenAI durante sincronização para classificação inicial.

## 6) Banco de dados (Prisma)

Tabelas principais:
- `User`
- `EmailAccount`
- `Folder`
- `Email`
- `Attachment`
- `AILog`
- `AutomationRule`
- `AuditLog`

Migração inicial: `backend/prisma/migrations/202604160001_init/migration.sql`.

## 7) Segurança e produção

- Senhas IMAP/SMTP criptografadas com AES-256-CBC (`MAIL_SECRET_KEY`).
- Rotas protegidas por JWT.
- Logs de auditoria e AI logs persistidos.
- Separação de responsabilidades: frontend, backend, worker.
- Pronto para escalar com filas Redis/BullMQ.

## 8) Melhorias recomendadas (roadmap)

- Rotacionar criptografia com KMS/Vault.
- DKIM/SPF/DMARC checker no onboarding de conta.
- Busca semântica com embeddings e pgvector.
- Webhooks e métricas Prometheus/Grafana.
- Testes E2E e observabilidade distribuída.
