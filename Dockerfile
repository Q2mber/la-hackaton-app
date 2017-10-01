FROM node:6.11.2-alpine

ENV HOME=/home/app
WORKDIR $HOME
COPY package.json ./
COPY . ./
RUN npm install -g @angular/cli@1.3.2 && npm install -g nodemon
RUN npm install
RUN ng build
#RUN npm cache clean

EXPOSE 4200

CMD ["npm","run", "startExpress"]
