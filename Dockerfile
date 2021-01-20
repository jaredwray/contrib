FROM node:12

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copying source files
COPY . /usr/src/app
RUN yarn build-server

# Open the port
EXPOSE 3000

# Running the app
CMD "yarn" "start"