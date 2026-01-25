#!/bin/bash

# Deployment script for Cloudflare Workers
# This script helps deploy workersverdis to Cloudflare Workers

set -e

echo "========================================="
echo "  Workersverdis Deployment Script"
echo "========================================="
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler is not installed."
    echo "   Install it with: npm install -g wrangler"
    exit 1
fi

echo "✅ Wrangler is installed"
echo ""

# Check if we're in a git repository
if [ -d .git ]; then
    echo "⚠️  Warning: Deploying from a git repository."
    echo "   The .git directory can cause deployment issues."
    echo "   Creating a clean deployment copy is recommended."
    echo ""
    read -p "Create clean deployment copy? (Y/n) " -n 1 -r
    echo ""
    # Default to Yes if user just presses Enter
    if [[ -z $REPLY ]] || [[ $REPLY =~ ^[Yy]$ ]]; then
        DEPLOY_DIR="/tmp/deploy-workersverdis-$(date +%s)"
        echo "📁 Creating deployment directory: $DEPLOY_DIR"
        mkdir -p "$DEPLOY_DIR"
        
        echo "📋 Copying files (excluding .git, node_modules, etc.)..."
        rsync -av \
            --exclude='.git' \
            --exclude='node_modules' \
            --exclude='functions' \
            --exclude='scripts' \
            --exclude='.wranglerignore.old' \
            ./ "$DEPLOY_DIR/"
        
        cd "$DEPLOY_DIR"
        echo "✅ Clean deployment directory created"
        echo ""
    fi
fi

# Check if API_KEY secret is set (we can't directly check, but we can remind the user)
echo "🔑 Make sure you've set your API_KEY secret:"
echo "   Run: wrangler secret put API_KEY"
echo ""
read -p "Have you set the API_KEY secret? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "   Please set it first with: wrangler secret put API_KEY"
    echo "   Then run this script again."
    exit 1
fi

# Deploy
echo "🚀 Deploying to Cloudflare Workers..."
echo ""

wrangler deploy --assets ./

echo ""
echo "========================================="
echo "  ✅ Deployment Complete!"
echo "========================================="
echo ""
echo "Your site should now be live at:"
echo "https://workersverdis.<your-subdomain>.workers.dev"
echo ""
echo "To set up a custom domain, visit:"
echo "https://dash.cloudflare.com/workers"
echo ""
