# Use Node.js as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the package files
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application files
COPY . .

# Build the React app for production
# RUN npm run build

# Expose the frontend port (e.g., 3000)
EXPOSE 5173

# Start the frontend server
CMD ["npm", "run", "dev"]