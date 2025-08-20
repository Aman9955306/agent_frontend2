# Use Node for dev
FROM node:18

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose React dev server port
EXPOSE 3000

# Run in dev mode
CMD ["npm", "run","dev"]
