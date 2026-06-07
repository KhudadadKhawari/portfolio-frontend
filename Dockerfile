ARG NODE_IMAGE=node:22-alpine

FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM ${NODE_IMAGE} AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE_URL=/api/v1
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ARG NEXT_PUBLIC_API_BASE_URL=/api/v1
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_SERVER_PORT=3001 \
    NEXT_SERVER_HOSTNAME=127.0.0.1
RUN npm install -g npm@11.16.0 \
    && apk add --no-cache nginx su-exec \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs \
    && mkdir -p /run/nginx /var/cache/nginx /var/lib/nginx/tmp \
    && chown -R nginx:nginx /run/nginx /var/cache/nginx /var/lib/nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/entrypoint.sh /entrypoint.sh
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN chmod +x /entrypoint.sh
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
    CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
ENTRYPOINT ["/entrypoint.sh"]
