FROM node:20-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production=false

COPY tsconfig.json tsup.config.ts ./
COPY src/ ./src/

RUN npm run build

# --- Production stage ---
FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --production

COPY --from=builder /app/dist ./dist

# MCP servers communicate via stdio
ENTRYPOINT ["node", "dist/index.js"]
