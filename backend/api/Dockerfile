# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000 (or whatever port your backend uses)
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 