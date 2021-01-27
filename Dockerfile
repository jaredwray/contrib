FROM node:15

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copying source files
COPY . /usr/src/app

# Installing dependencies
WORKDIR /usr/src/app/server
RUN yarn

#Expose the App
EXPOSE 3000

# Running the app
CMD "yarn" "start"
