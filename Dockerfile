  FROM node:lts

WORKDIR /usr/src/app

COPY package.json ./
# COPY package*.json ./

ENV NODE_ENV=production

RUN npm install
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 7777 
CMD ["npm", "start"]
