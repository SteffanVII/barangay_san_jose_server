FROM node:17.6

WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

EXPOSE 443
CMD ["node", "src/index.js"]

