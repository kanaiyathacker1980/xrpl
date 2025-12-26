# XRPL Loyalty Rewards Platform

A comprehensive decentralized loyalty rewards ecosystem built on the XRP Ledger with two implementation approaches.

## � Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in 5 minutes
- **[Feature Comparison](./COMPARISON.md)** - Native vs Hooks detailed comparison
- **[FAQ](./FAQ.md)** - Frequently asked questions
- **[API Documentation](./API.md)** - XRPL integration patterns
- **[Testing Guide](./TESTING.md)** - Comprehensive testing strategies  
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions

## 📁 Projects

### 1. [XRPL-Loyalty-Native](./XRPL-Loyalty-Native) - JavaScript Version
XRPL implementation using native token features with JavaScript/TypeScript.

**Technology**: XRPL, xrpl.js, TrustLines, Next.js, React  
**Status**: 🚧 In Development  
**Best For**: Quick deployment with JavaScript, no C++ knowledge required

[View Documentation →](./XRPL-Loyalty-Native/README.md)

### 2. [XRPL-Loyalty-Hooks](./XRPL-Loyalty-Hooks) - Smart Contracts Version
Advanced XRPL implementation using Hooks (C++ smart contracts).

**Technology**: XRPL Hooks, C++, WebAssembly, Next.js, React  
**Status**: 🚧 In Development  
**Best For**: Complex business logic, automated on-chain rules, advanced features

[View Documentation →](./XRPL-Loyalty-Hooks/README.md)

## 🎯 Feature Comparison

| Feature | XRPL Native | XRPL Hooks |
|---------|-------------|------------|
| **Smart Contracts** | None (Native) | C++ Hooks |
| **Transaction Speed** | Very Fast | Very Fast |
| **Privacy** | Medium | Medium |
| **Complexity** | Low | High |
| **Gas Fees** | Very Low | Very Low |
| **Mainnet Ready** | ✅ Yes | ⚠️ Testnet Only |
| **Programming Language** | JavaScript/TypeScript | C++ |
| **Automation** | Client-side | On-chain Hooks |

## 🚀 Quick Start

### XRPL Native (JavaScript)
```bash
cd XRPL-Loyalty-Native
npm run install:all
npm run dev
```

### XRPL Hooks (Advanced)
```bash
cd XRPL-Loyalty-Hooks
npm run install:all
npm run compile:hooks  # Compile C hooks to WASM
npm run dev
```

## 🏗️ Architecture

Both implementations share a common architecture:
- **Business Dashboard**: Next.js 14 app for merchants
- **Customer App**: React PWA for end users
- **Core Features**: Token issuance, rewards management, QR scanning

The main difference is the blockchain layer:
- **XRPL Native**: Direct XRPL transactions with xrpl.js
- **XRPL Hooks**: Smart contract automation with C++ Hooks

## 📊 Use Cases

### Retail Loyalty Programs
Point-based rewards for purchases with instant token issuance.

### Coffee Shop Chains
Issue loyalty tokens for each purchase, redeem for free items.

### Multi-Merchant Networks
Create shared loyalty ecosystems across multiple businesses.

## 🛠️ Development

### Quick Start

**Automated Setup:**
```bash
chmod +x setup.sh
./setup.sh
```

**Manual Setup:**

Native Version:
```bash
cd XRPL-Loyalty-Native
npm run install:all
npm run dev
```

Hooks Version:
```bash
cd XRPL-Loyalty-Hooks
npm run install:all
npm run compile:hooks  # Compile C hooks to WASM
npm run dev
```

### Project Structure

```
XRPL-Loyalty-Native/
├── business-dashboard/  # Next.js business dashboard
├── customer-app/        # React PWA for customers
└── package.json

XRPL-Loyalty-Hooks/
├── business-dashboard/  # Next.js with hooks integration
├── customer-app/        # React PWA with hooks support
├── hooks/               # C smart contracts
│   ├── loyalty_issuer.c
│   └── reward_validator.c
├── hooks-compiler/      # WASM compilation service
└── package.json
```

## 📚 Documentation

- **[API Documentation](./API.md)** - XRPL integration patterns and API reference
- **[Testing Guide](./TESTING.md)** - Comprehensive testing strategies
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions
- **[Hooks Guide](./XRPL-Loyalty-Hooks/HOOKS_GUIDE.md)** - Detailed hooks implementation

## 🔐 Security

### Development
- Use XRPL Testnet only
- Test wallets can be stored locally
- Never commit seeds to version control

### Production
- Use XRPL Mainnet
- Store seeds in secure vault (AWS Secrets Manager, etc.)
- Implement proper authentication
- Use hardware wallets for business accounts
- Enable multi-signature for high-value operations

## 🧪 Testing

```bash
# Get testnet XRP
# Visit: https://xrpl.org/xrp-testnet-faucet.html

# Run tests (when implemented)
npm test

# E2E tests
npm run test:e2e
```

## 📦 Building

Native Version:
```bash
cd XRPL-Loyalty-Native
npm run build
```

Hooks Version:
```bash
cd XRPL-Loyalty-Hooks
npm run compile:hooks  # Compile hooks first
npm run build
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy to Vercel:**
```bash
cd XRPL-Loyalty-Native/business-dashboard
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on testnet
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **XRPL Labs** - For XRPL Hooks technology
- **Ripple** - For the XRP Ledger
- **XRPL Community** - For documentation and support

## 📞 Support

- **XRPL Docs**: https://xrpl.org
- **XRPL Discord**: https://discord.gg/xrpl  
- **Hooks Documentation**: https://hooks-docs.xrpl.org
- **GitHub Issues**: For bug reports and features

## 🗺️ Roadmap

### Native Version
- [x] Basic token issuance
- [x] Customer wallet management
- [x] QR code scanning
- [ ] Reward catalog system
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-currency support

### Hooks Version  
- [x] Loyalty issuer hook
- [x] Reward validator hook
- [x] Hook compiler service
- [ ] Advanced tier system
- [ ] Automated rewards
- [ ] Governance hooks
- [ ] Hook monitoring dashboard

### Both Versions
- [ ] Database integration
- [ ] Advanced analytics
- [ ] Email/SMS notifications
- [ ] Multi-business federation
- [ ] NFT rewards
- [ ] DeFi integrations

## ⭐ Star History

If you find this project useful, please consider giving it a star!

Each project has its own dependencies and setup:

```bash
# Install all dependencies for a specific project
cd [project-name]
npm run install:all

# Run development servers
npm run dev

# Build for production
npm run build
```

## � External Resources

### XRP Ledger
- [XRPL Docs](https://xrpl.org/)
- [xrpl.js Library](https://js.xrpl.org/)
- [XRPL Hooks](https://xrpl-hooks.readme.io/)
- [Hooks Testnet](https://hooks-testnet-v3.xrpl-labs.com)

## 🤝 Contributing

Contributions welcome! Each project has its own development workflow.

## 📄 License

MIT License - See individual project directories for details.

## 🌟 Project Roadmap

- [x] XRPL Native version design
- [x] XRPL Hooks version design
- [x] Basic token issuance
- [x] Wallet management
- [ ] Complete reward catalog system
- [ ] Mobile native apps (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] NFT rewards integration

## 📞 Support

- **Issues**: GitHub Issues for bug reports and features
- **Discussions**: GitHub Discussions for questions
- **XRPL Discord**: https://discord.gg/xrpl

---

**Build Amazing Loyalty Programs on XRPL** 🚀
