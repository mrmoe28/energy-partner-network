FROM node:20-bookworm AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_DISABLE_SWC=1
ENV CI=true
WORKDIR /app

RUN cat /usr/local/bin/node > /usr/local/bin/node.new && \
    chmod 755 /usr/local/bin/node.new && \
    rm -f /usr/local/bin/node && \
    mv /usr/local/bin/node.new /usr/local/bin/node && \
    test -x /usr/local/bin/node && \
    /usr/local/bin/node --version

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts && npm cache clean --force

COPY . .
RUN npm run build

FROM node:20-bookworm
WORKDIR /app
RUN cat /usr/local/bin/node > /usr/local/bin/node.new && \
    chmod 755 /usr/local/bin/node.new && \
    rm -f /usr/local/bin/node && \
    mv /usr/local/bin/node.new /usr/local/bin/node && \
    test -x /usr/local/bin/node && \
    /usr/local/bin/node --version

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
