FROM node:18-alpine

WORKDIR /app

# Copy package files first to install dependencies
COPY package*.json ./
RUN npm install

# Now copy your full code
COPY . .

EXPOSE 3001
CMD ["npm", "start"]
