

FROM node:alpine AS base

ARG FLOW_ACCESS_NODE
ARG FLOW_ACCOUNT_KEY_ID
ARG FLOW_ACCOUNT_PRIVATE_KEY
ARG FLOW_ACCOUNT_PUBLIC_KEY
ARG FLOW_INIT_ACCOUNTS

ARG NEXT_PUBLIC_AVATAR_URL
ARG NEXT_PUBLIC_FLOW_ACCOUNT_ADDRESS

ENV FLOW_ACCESS_NODE=$FLOW_ACCESS_NODE
ENV FLOW_ACCOUNT_KEY_ID=$FLOW_ACCOUNT_KEY_ID
ENV FLOW_ACCOUNT_PRIVATE_KEY=$FLOW_ACCOUNT_PRIVATE_KEY
ENV FLOW_ACCOUNT_PUBLIC_KEY=$FLOW_ACCOUNT_PUBLIC_KEY
ENV FLOW_INIT_ACCOUNTS=$FLOW_INIT_ACCOUNTS

ENV NEXT_PUBLIC_AVATAR_URL=$NEXT_PUBLIC_AVATAR_URL
ENV NEXT_PUBLIC_FLOW_ACCOUNT_ADDRESS=$NEXT_PUBLIC_FLOW_ACCOUNT_ADDRESS

FROM base AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder

ENV NEXT_PUBLIC_AVATAR_URL=$NEXT_PUBLIC_AVATAR_URL
ENV NEXT_PUBLIC_FLOW_ACCOUNT_ADDRESS=$NEXT_PUBLIC_FLOW_ACCOUNT_ADDRESS

WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN mv .env.local .env
RUN npm run build && npm install --production --ignore-scripts

# Production image, copy all the files and run next
FROM base AS runners

ENV FLOW_ACCESS_NODE=$FLOW_ACCESS_NODE
ENV FLOW_ACCOUNT_KEY_ID=$FLOW_ACCOUNT_KEY_ID
ENV FLOW_ACCOUNT_PRIVATE_KEY=$FLOW_ACCOUNT_PRIVATE_KEY
ENV FLOW_ACCOUNT_PUBLIC_KEY=$FLOW_ACCOUNT_PUBLIC_KEY
ENV FLOW_INIT_ACCOUNTS=$FLOW_INIT_ACCOUNTS

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 8701

ENV NEXT_TELEMETRY_DISABLED 1 

CMD ["npm", "run", "start"]
