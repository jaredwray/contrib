### CLIENT BUILD IMAGE
FROM node:15 as build-client
WORKDIR /usr/app/build/client

COPY client ./
RUN yarn --non-interactive --no-progress --frozen-lockfile install
RUN yarn build

### SERVER BUILD IMAGE
FROM node:15 as build-server
WORKDIR /usr/app/build/server

COPY server ./
RUN yarn --non-interactive --no-progress --frozen-lockfile install
RUN yarn build

### ASSEMBLE FINAL IMAGE
FROM node:15 as run
WORKDIR /usr/app
EXPOSE 3000
ENV PORT 3000
ENV SERVE_CLIENT_APP true

COPY --from=build-server /usr/app/build/server/dist ./
COPY --from=build-server /usr/app/build/server/node_modules ./node_modules/
COPY --from=build-client /usr/app/build/client/build ./client/

# Running the app
CMD "node" "main.js"
