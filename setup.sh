#!/bin/bash

echo "🚀 XRPL Loyalty - Quick Setup Script"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Ask which version to set up
echo "Which version would you like to set up?"
echo "1) XRPL Native (JavaScript - Quick Start)"
echo "2) XRPL Hooks (C++ Smart Contracts - Advanced)"
echo "3) Both"
read -p "Enter choice (1-3): " choice

setup_native() {
    echo ""
    echo "📦 Setting up XRPL Native..."
    cd XRPL-Loyalty-Native || exit
    
    # Install dependencies
    echo "Installing dependencies..."
    npm run install:all
    
    # Create .env files if they don't exist
    if [ ! -f business-dashboard/.env.local ]; then
        cp business-dashboard/.env.example business-dashboard/.env.local
        echo "✅ Created business-dashboard/.env.local"
    fi
    
    if [ ! -f customer-app/.env ]; then
        cp customer-app/.env.example customer-app/.env
        echo "✅ Created customer-app/.env"
    fi
    
    echo ""
    echo "✅ XRPL Native setup complete!"
    echo ""
    echo "To start development servers:"
    echo "  cd XRPL-Loyalty-Native"
    echo "  npm run dev"
    echo ""
    
    cd ..
}

setup_hooks() {
    echo ""
    echo "📦 Setting up XRPL Hooks..."
    cd XRPL-Loyalty-Hooks || exit
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo "⚠️  Docker not found. You'll need Docker for hook compilation."
        echo "Install Docker from: https://docs.docker.com/get-docker/"
    else
        echo "✅ Docker detected"
        
        # Build WASI SDK
        echo "Building WASI SDK Docker image..."
        cd hooks-compiler
        chmod +x docker-build.sh
        ./docker-build.sh
        cd ..
    fi
    
    # Install dependencies
    echo "Installing dependencies..."
    npm run install:all
    
    # Create .env files
    if [ ! -f business-dashboard/.env.local ]; then
        cp business-dashboard/.env.example business-dashboard/.env.local
        echo "✅ Created business-dashboard/.env.local"
    fi
    
    if [ ! -f customer-app/.env ]; then
        cp customer-app/.env.example customer-app/.env
        echo "✅ Created customer-app/.env"
    fi
    
    echo ""
    echo "✅ XRPL Hooks setup complete!"
    echo ""
    echo "To compile hooks:"
    echo "  cd XRPL-Loyalty-Hooks"
    echo "  npm run compile:hooks"
    echo ""
    echo "To start development servers:"
    echo "  npm run dev"
    echo ""
    
    cd ..
}

case $choice in
    1)
        setup_native
        ;;
    2)
        setup_hooks
        ;;
    3)
        setup_native
        setup_hooks
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Get XRPL Testnet XRP from: https://xrpl.org/xrp-testnet-faucet.html"
echo "2. Review the README files for detailed documentation"
echo "3. Start the development servers"
echo ""
echo "Happy coding! 🚀"
