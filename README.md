# Fragments API

Production-ready, authentication-first content microservice for creating, storing, and transforming text, JSON, and images. Built for reliability and fast iterations with clear test coverage.

## Why this exists
Fragments powers a minimal content platform: it stores user-scoped fragments and returns them in their native formats or converted forms (e.g., Markdown → HTML, PNG → JPEG). It’s intentionally modular so storage and auth strategies can evolve without touching the core API.

## Highlights
- Secure, user-scoped access with Basic Auth or Cognito Bearer tokens
- Strong content-type validation and conversion support
- Clean, test-driven API surface with structured error responses
- Extensible storage layer (memory, DynamoDB, S3)

## Tech stack
Node.js, Express, Jest, Supertest, AWS SDK, Sharp, Markdown-it

## Quick start

```powershell
cd fragments
npm install
npm run dev
```

## Scripts

```powershell
npm run dev           # local dev with reload
npm start             # production start
npm run start:prod     # alias for production start
npm test              # unit tests
npm run test:integration
npm run lint
```

## Environment

Create a `.env` file if needed and set values for auth/storage. Typical values include:

- `LOG_LEVEL`
- `NODE_ENV`
- `AWS_REGION`
- `AWS_S3_BUCKET_NAME`
- `HTPASSWD_FILE` (Basic Auth)

## API preview

- `POST /v1/fragments` — create a fragment (Content-Type required)
- `GET /v1/fragments` — list user fragments
- `GET /v1/fragments/:id` — fetch fragment by id
- `GET /v1/fragments/:id.ext` — fetch fragment converted to another format
- `PUT /v1/fragments/:id` — update fragment content
- `DELETE /v1/fragments/:id` — delete fragment

## Architecture

The service is split into clean layers:

- Routes: API entry points and validation
- Model: Fragment entity and storage abstraction
- Auth: Basic/Cognito middleware

This keeps cross-cutting concerns (auth, logging, storage) isolated and maintainable.

## Tests

```powershell
npm test
```

## Deployment

The project is container-ready and designed to run on AWS (ECS + S3 + DynamoDB). Update environment variables and storage configuration for your target environment.
