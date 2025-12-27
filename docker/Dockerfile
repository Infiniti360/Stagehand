# Playwright Docker Setup
# Using official Playwright image with pre-installed browsers
# This avoids slow browser downloads during build on ARM64/Apple Silicon

FROM mcr.microsoft.com/playwright:v1.56.1-noble

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies (skip postinstall scripts that might try to download browsers again)
RUN npm ci --ignore-scripts

# Create directories for reports and tests
RUN mkdir -p /app/reports /app/test-results /app/tests /app/src

# Set environment variables
ENV CI=true
ENV NODE_ENV=test
ENV HEADLESS=true

# Tests and source will be mounted as volumes
# Default command - run all Playwright tests
CMD ["sh", "-c", "npx playwright test"]
