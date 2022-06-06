FROM node:16 as deps
WORKDIR /app
COPY ./package.json .
COPY ./yarn.lock .
COPY ./tsconfig.build.json .
RUN yarn

FROM node:16 as build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:16
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/main" ]
