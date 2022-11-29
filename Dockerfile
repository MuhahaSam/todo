FROM alpine:3.16 as build

RUN apk add --update tzdata \
  nodejs npm \
  py-pip make gcc g++ libxml2 ca-certificates git

RUN npm i -g npm@latest

RUN npm install pkg@5.3.1 pkg-fetch@3.2.2 -g
RUN pkg-fetch -n node16 -p alpine -a x64

WORKDIR /todo 

# зависимости
COPY /*package* /
RUN npm i
copy . .
RUN npx prisma generate
EXPOSE 8080
CMD ["npx", "ts-node" ,"/todo/index.ts"]
