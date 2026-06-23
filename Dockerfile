FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY server.mjs ./server.mjs
COPY deploy-dist ./deploy-dist

EXPOSE 3000
CMD ["npm", "run", "start"]
