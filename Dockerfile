FROM node:16-alpine

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copying source files
COPY ./client/build /usr/src/app/client/build
COPY ./server/package.json /usr/src/app/server/package.json
COPY ./server/dist /usr/src/app/server/dist
COPY ./server/views /usr/src/app/server/views

# Install Server Dependencies
WORKDIR /usr/src/app/server
RUN yarn

#Expose the App
EXPOSE 3000

# Running the app
CMD "node" "./dist/index.js"
