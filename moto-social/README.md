# Moto Social (MVP)

Plataforma web para motociclistas com foco em eventos, bandas e moderação administrativa, construída para **deploy isolado em VPS com múltiplos projetos**.

## 1) Visão geral

Este MVP entrega:

- Área pública: Home, eventos, detalhe de evento, bandas, perfil de banda, login e cadastro.
- Área logada: perfil, meus eventos, novo evento e favoritos.
- Área administrativa: aprovação/ocultação de eventos e bandas.

## 2) Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Banco: PostgreSQL
- Auth: JWT
- Deploy: Docker Compose
- Proxy: Nginx (via configuração separada)
- Upload: local (`backend/uploads`)

## 3) Estrutura

```bash
moto-social/
  backend/
  frontend/
  db/
    init.sql
  docs/
    nginx-subdomain.conf.example
  docker-compose.yml
  .env.example
  README.md
```

## 4) Variáveis de ambiente

1. Copie:

```bash
cp .env.example .env
```

2. Ajuste obrigatoriamente:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `DATABASE_URL`
- `VITE_API_URL` (se usar subdomínio/API diferente)

## 5) Portas padrão e isolamento

Portas sugeridas (exclusivas deste projeto):

- Frontend: `3107`
- Backend: `4107`
- PostgreSQL: `5437`

Se houver conflito, altere no `.env`:

```env
FRONTEND_PORT=3117
BACKEND_PORT=4117
POSTGRES_PORT=5447
```

> Não reutilize portas de outros sistemas já rodando.

## 6) Como rodar localmente

Dentro de `/opt/moto-social` (ou pasta equivalente):

```bash
cp .env.example .env
docker compose up -d --build
```

Verificação:

- Frontend: `http://localhost:3107`
- API health: `http://localhost:4107/api/health`

## 7) Como subir na VPS sem afetar outros projetos

1. Crie pasta dedicada:

```bash
mkdir -p /opt/moto-social
```

2. Copie apenas este projeto para `/opt/moto-social`.
3. Crie `.env` próprio do projeto (não compartilhar com outros sistemas).
4. Suba **somente** este compose:

```bash
cd /opt/moto-social
docker compose up -d --build
```

5. Nunca use comandos globais destrutivos (`docker system prune -a`, parar todos os containers, etc.).
6. Não altere containers, bancos ou volumes de outros sistemas.

## 8) Banco de dados

O schema inicial está em `db/init.sql` e é aplicado automaticamente na primeira subida do PostgreSQL.

Tabelas criadas:

- `users`
- `events`
- `bands`
- `favorites` (com `UNIQUE(user_id, event_id)`)

## 9) Build e manutenção

Subir/atualizar:

```bash
docker compose up -d --build
```

Parar somente este projeto:

```bash
docker compose down
```

Logs:

```bash
docker compose logs -f moto_social_backend
docker compose logs -f moto_social_frontend
docker compose logs -f moto_social_db
```

## 10) Subdomínio com Nginx

Use o arquivo de exemplo `docs/nginx-subdomain.conf.example`.

Fluxo recomendado:

- Nginx existente no host recebe `moto-social.seudominio.com`
- Encaminha `/` para frontend (`127.0.0.1:3107`)
- Encaminha `/api/` e `/uploads/` para backend (`127.0.0.1:4107`)

> Isso permite compartilhar apenas o proxy reverso, mantendo containers, rede e banco isolados.

## 11) Alertas de segurança e isolamento

- Projeto usa:
  - containers exclusivos (`moto_social_*`)
  - network exclusiva (`moto_social_net`)
  - volume exclusivo (`moto_social_postgres_data`)
  - banco/usuário exclusivos
- Não usa recursos compartilhados de outros projetos.
- Troque segredos padrão antes da produção.
- Ideal ativar HTTPS com Certbot no Nginx host.

## 12) Endpoints principais

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Events
- `GET /api/events`
- `GET /api/events/:id`
- `POST /api/events`
- `PUT /api/events/:id`
- `PATCH /api/events/:id/status`
- `POST /api/events/:id/favorite`
- `DELETE /api/events/:id/favorite`

### Bands
- `GET /api/bands`
- `GET /api/bands/:id`
- `POST /api/bands`
- `PUT /api/bands/:id`
- `PATCH /api/bands/:id/status`
