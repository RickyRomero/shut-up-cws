FROM node:22-alpine

ENV NODE_ENV production
LABEL "repository"="https://github.com/RickyRomero/shut-up-cws"
LABEL "homepage"="https://github.com/RickyRomero/shut-up-cws"
LABEL "maintainer"="Ricky Romero <ricky.romero@gmail.com>"

WORKDIR /usr/app
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
COPY package.json ./
COPY yarn.lock ./
COPY src ./src

RUN yarn --silent --immutable
RUN mkdir -p /cws/build /cws/extension
RUN chown -R 1000:1000 /cws/build /cws/extension

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
