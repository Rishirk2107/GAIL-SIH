# Use Node.js as the base image
FROM node:20

# Set the working directory
WORKDIR /app

COPY package.json .

# Copy the rest of the application files
COPY . .

# Install dependencies
RUN npm install

# Expose the backend port (e.g., 5000)
EXPOSE 3001

# Start the backend server
CMD ["node", "server.js"]