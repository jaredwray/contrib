FROM node:18

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/api
WORKDIR /usr/src/api

# Copying source files
COPY ./package.json /usr/src/api/package.json
COPY ./dist /usr/src/api//dist

# Install api dependencies
RUN yarn

#Expose the App
EXPOSE 3000

# Running the app
CMD "node" "./dist/index.js"
