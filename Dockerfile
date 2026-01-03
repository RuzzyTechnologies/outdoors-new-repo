FROM node:24-alpine3.21 as base

WORKDIR /usr/src/app

COPY package*.json ./

FROM base as dev

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm install

COPY . .

CMD ["npm", "run", "dev"]

FROM base as production

ENV NODE_ENV development

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci

USER node

COPY --chown=node:node ./healthcheck/ .
COPY --chown=node:node ./src .

EXPOSE 3000

CMD [ "npx", "ts-node", "index.ts" ]
