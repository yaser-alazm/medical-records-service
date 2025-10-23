FROM node:18-alpine

# Install OpenSSL for Prisma compatibility
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for hot reload)
RUN npm install

# Install NestJS CLI globally to ensure nest command is available
RUN npm install -g @nestjs/cli

# Copy source code
COPY . .

# Download Prisma engines for the platform
RUN npx prisma generate --no-engine
RUN npx prisma generate

# Clean any existing build artifacts
RUN rm -rf dist/

# Build the application to create the nest executable
RUN nest build

# Expose port
EXPOSE 4004

# Start in development mode with hot reload
CMD ["npm", "run", "start:with-db"]
