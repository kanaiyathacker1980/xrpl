# XRPL Loyalty Program - Deployment Guide

## Overview

This guide covers deployment for both XRPL Native and XRPL Hooks versions.

## Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **XRPL Account** (Testnet for development)
- **PostgreSQL** (optional, for storing business data)

## Deployment Options

### Option 1: XRPL Native (Recommended for Quick Start)

#### Local Development

```bash
cd XRPL-Loyalty-Native
npm run install:all
npm run dev
```

#### Production Deployment

**Vercel (Recommended):**

```bash
# Deploy business dashboard
cd business-dashboard
vercel

# Deploy customer app
cd ../customer-app
vercel
```

**Environment Variables:**
```
NEXT_PUBLIC_XRPL_NETWORK=mainnet
NEXT_PUBLIC_XRPL_WSS=wss://xrplcluster.com
DATABASE_URL=your_production_db_url
```

**Docker:**

```bash
# Build images
docker build -t xrpl-loyalty-business ./business-dashboard
docker build -t xrpl-loyalty-customer ./customer-app

# Run containers
docker run -p 3000:3000 xrpl-loyalty-business
docker run -p 3001:3001 xrpl-loyalty-customer
```

### Option 2: XRPL Hooks (Advanced)

#### Prerequisites
- Docker (for hook compilation)
- XRPL Hooks Testnet account

#### Local Development

```bash
cd XRPL-Loyalty-Hooks

# Build WASI SDK Docker image
cd hooks-compiler
chmod +x docker-build.sh
./docker-build.sh

# Install dependencies
cd ..
npm run install:all

# Compile hooks
npm run compile:hooks

# Start all services
npm run dev
```

#### Production Deployment

**Note:** XRPL Hooks are currently on testnet only.

1. **Deploy Hooks Compiler Service:**

```bash
cd hooks-compiler
npm run build
node dist/server.js
```

2. **Deploy Dashboards:**

Follow the same Vercel/Docker process as Native version, but use:
```
NEXT_PUBLIC_XRPL_NETWORK=hooks-testnet
NEXT_PUBLIC_XRPL_WSS=wss://hooks-testnet-v3.xrpl-labs.com
NEXT_PUBLIC_HOOK_COMPILER_API=https://your-compiler-api.com
```

## Database Setup

### PostgreSQL Schema (Optional)

```sql
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  xrpl_address VARCHAR(255) UNIQUE NOT NULL,
  token_symbol VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  xrpl_address VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  business_id INTEGER REFERENCES businesses(id),
  customer_id INTEGER REFERENCES customers(id),
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  amount DECIMAL(20, 6) NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

### Production Checklist

- [ ] Use environment variables for all sensitive data
- [ ] Never commit seeds/private keys to version control
- [ ] Implement proper authentication (Clerk, Auth0, etc.)
- [ ] Use HTTPS for all connections
- [ ] Rate limit API endpoints
- [ ] Validate all XRPL transactions
- [ ] Implement proper error handling
- [ ] Set up monitoring and logging
- [ ] Use XRPL Mainnet for production
- [ ] Back up wallet seeds securely (hardware wallet recommended)

### Environment Security

**Development:**
- Use XRPL Testnet
- Test wallet seeds can be stored in `.env.local` (gitignored)

**Production:**
- Use XRPL Mainnet
- Store secrets in secure vault (AWS Secrets Manager, HashiCorp Vault)
- Use hardware wallets for business accounts
- Implement multi-signature for high-value operations

## Monitoring

### Recommended Tools

- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Datadog** - Infrastructure monitoring
- **XRPL Explorer** - Transaction monitoring

### Health Checks

```javascript
// Add to your API
app.get('/health', async (req, res) => {
  const xrplConnected = await xrplService.client.isConnected()
  res.json({
    status: 'ok',
    xrpl: xrplConnected,
    timestamp: new Date().toISOString()
  })
})
```

## Scaling

### Performance Optimization

1. **XRPL Connection Pooling**
2. **Redis for caching**
3. **CDN for static assets**
4. **Database indexing**
5. **Load balancing**

### Cost Optimization

- XRPL transactions cost ~0.00001 XRP (negligible)
- Focus on infrastructure costs
- Use serverless where possible

## Support

For issues:
1. Check XRPL documentation: https://xrpl.org
2. Join XRPL Discord: https://discord.gg/xrpl
3. Review GitHub issues

## Maintenance

### Regular Tasks

- Update dependencies monthly
- Monitor XRPL network status
- Backup database regularly
- Review transaction logs
- Update hook code (for Hooks version)
- Test disaster recovery procedures
