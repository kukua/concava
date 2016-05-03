FROM node:4.2.1
MAINTAINER Maurits van Mastrigt <maurits@kukua.cc>

WORKDIR /data
COPY ./ /data/
RUN npm install

EXPOSE 3000

CMD npm start
