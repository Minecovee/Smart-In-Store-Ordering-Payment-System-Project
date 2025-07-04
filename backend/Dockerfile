# Use the official Node.js 20 (LTS) Alpine image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
# This step is done separately to leverage Docker's layer caching
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your Node.js application will listen on
EXPOSE 3000

# Define the command to run when the container starts
CMD [ "npm", "start" ]
