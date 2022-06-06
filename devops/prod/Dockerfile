FROM node:16

# Docker working directory
WORKDIR /app

# Copying file into APP directory of docker
COPY ["../../package.json", "./"]
COPY ["../../yarn.lock", "./"]
COPY ["../../tsconfig.build.json", "./"]

# Then install the NPM module
RUN yarn

# Build production
RUN yarn build

# Copy current directory to APP folder
COPY ["../../dist", "./"]

EXPOSE 3000

CMD ["node", "main.js"]
