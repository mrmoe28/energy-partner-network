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

COPY public ./public
COPY docker-artifacts/standalone ./
COPY docker-artifacts/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
