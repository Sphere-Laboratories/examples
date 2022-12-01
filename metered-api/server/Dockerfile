FROM node:16

EXPOSE 8080

WORKDIR /app

COPY . /app

RUN npm install --force

# RUN npm run build 

# ENV NODE_ENV=development

# This needs to be a production build... okay for now
CMD ["npm", "run", "dev"]