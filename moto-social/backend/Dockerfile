FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

COPY src ./src
COPY uploads ./uploads

EXPOSE 4107
CMD ["npm", "start"]
