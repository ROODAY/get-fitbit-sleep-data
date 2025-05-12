FROM node:18

WORKDIR /usr/src/app

# Copy package.json
COPY package.json ./
COPY .env ./

# Install dependencies
RUN npm install

# Copy the entire src directory
COPY ./src ./src

# Expose the application port
EXPOSE 3000

# Run the server
CMD ["node", "./src/server.js"]