FROM node:slim

workdir app

COPY ./package.json package.json

RUN npm i

COPY . .

cmd ['npm', 'run', 'dev']