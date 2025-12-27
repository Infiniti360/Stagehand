#!/bin/bash

# Stagehand One-Command Setup Script
# This script sets up Stagehand with all dependencies and configurations

set -e

echo "🎭 Stagehand Setup - Starting..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo -e "${BLUE}Checking Node.js version...${NC}"
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${YELLOW}Warning: Node.js 18+ is required. Current version: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Install Playwright browsers
echo -e "${BLUE}Installing Playwright browsers...${NC}"
npm run playwright:install
echo -e "${GREEN}✓ Playwright browsers installed${NC}"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please update .env with your configuration${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Create necessary directories
echo -e "${BLUE}Creating directories...${NC}"
mkdir -p reports/{html,junit,json,allure-results}
mkdir -p test-results
mkdir -p builds
echo -e "${GREEN}✓ Directories created${NC}"

# Verify installation
echo -e "${BLUE}Verifying installation...${NC}"
if npm run test -- --list > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Installation verified${NC}"
else
    echo -e "${YELLOW}⚠ Some tests may need configuration${NC}"
fi

echo ""
echo -e "${GREEN}🎭 Stagehand setup complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Update .env with your configuration"
echo "  2. Run tests: npm test"
echo "  3. View examples: examples/"
echo ""
echo "For more information, see README.md"

