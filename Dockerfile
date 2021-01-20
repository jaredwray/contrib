FROM node:12

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app


# Copying source files
COPY . /usr/src/app
WORKDIR /usr/src/app/server
RUN yarn

# Open the port
EXPOSE 3000

# Running the app
CMD "yarn" "start"