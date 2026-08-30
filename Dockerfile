# syntax=docker/dockerfile:1

# ---------- stage 1: build the frontend ----------
FROM node:20-alpine AS client

WORKDIR /build/client
COPY client/package.json client/package-lock.json* ./
RUN npm ci --no-audit --no-fund

COPY client/ ./
RUN npm run build


# ---------- stage 2: runtime ----------
FROM node:20-alpine AS runtime

# dumb-init gives us correct signal handling so the platform can stop the
# container cleanly instead of killing it mid-request.
RUN apk add --no-cache dumb-init

ENV NODE_ENV=production
WORKDIR /app

COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm ci --omit=dev --no-audit --no-fund

COPY server/src ./server/src
COPY --from=client /build/client/dist ./client/dist

# Run unprivileged.
USER node

EXPOSE 5050
ENV PORT=5050

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5050)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/src/index.js"]