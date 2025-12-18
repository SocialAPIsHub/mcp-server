FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy all source files
COPY . .

# Make wrapper executable
RUN chmod +x mcp-wrapper.js

# Expose HTTP proxy port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start HTTP proxy server
CMD ["node", "server.js"]