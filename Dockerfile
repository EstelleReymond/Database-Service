FROM node

WORKDIR /usr/src/app
ENV NODE_ENV production

COPY package*.json ./
COPY src/ src/

RUN npm install

EXPOSE 8080
CMD ["npm", "run", "dev"]
