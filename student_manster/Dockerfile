# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files to install dependencies first (layer cache)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port 3000 (React dev server)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]