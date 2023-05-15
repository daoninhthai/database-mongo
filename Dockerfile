# ============================================================================
# Dockerfile for Node.js + MongoDB Application
# ============================================================================

# ── Stage 1: Dependencies ───────────────────────────────────────────────────
FROM node:18-alpine AS dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

# ── Stage 2: Production ─────────────────────────────────────────────────────
FROM node:18-alpine AS production

LABEL maintainer="developer"
LABEL description="Node.js + MongoDB Web Application"

WORKDIR /app

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application source
COPY package*.json ./
COPY index.js ./
COPY views/ ./views/
COPY css/ ./css/
COPY html/ ./html/
COPY image/ ./image/
COPY style.css ./
COPY index.html ./

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "index.js"]
