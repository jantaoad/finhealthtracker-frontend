FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies  
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Install serve globally to serve the built app
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the app with serve
CMD ["serve", "-s", "dist", "-l", "3000"]
