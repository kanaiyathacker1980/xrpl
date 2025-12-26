# Quick Start Guide - XRPL Loyalty Platform

## 5-Minute Setup

### For XRPL Native (Recommended for Beginners)

#### 1. Prerequisites
```bash
# Check Node.js version (need 18+)
node --version

# If not installed, download from: https://nodejs.org
```

#### 2. Clone & Install
```bash
cd XRPL-Loyalty-Native
npm run install:all
```

#### 3. Get Test XRP
1. Visit https://xrpl.org/xrp-testnet-faucet.html
2. You'll get a testnet address automatically
3. Click "Generate Credentials" to receive 1000 test XRP

#### 4. Start Development
```bash
npm run dev
```

This starts:
- Business Dashboard: http://localhost:3000
- Customer App: http://localhost:5173

#### 5. Set Up Your Business

1. Open http://localhost:3000
2. Click "Get Started"
3. Enter your business name (e.g., "My Coffee Shop")
4. Enter token symbol (3 letters, e.g., "COF")
5. Click "Generate Wallet"
6. **SAVE YOUR SEED PHRASE!** (Copy it somewhere safe)
7. Click "Complete Setup"

#### 6. Fund Your Business Wallet

1. Copy your business wallet address from the dashboard
2. Visit https://xrpl.org/xrp-testnet-faucet.html
3. Paste your address and request test XRP

#### 7. Issue Your First Tokens

**In Business Dashboard:**
1. Go to "Issue Tokens" section
2. Enter a customer XRPL address
3. Enter amount (e.g., 100)
4. Click "Issue Tokens"

**In Customer App:**
1. Open http://localhost:5173
2. Create/login with your wallet
3. View your token balance!

## First Transaction Walkthrough

### Scenario: Coffee Shop Loyalty Program

#### Business Side (Owner)

1. **Create Business Account**
   - Name: "Java Joe's Coffee"
   - Token: "JJC"
   - Generates XRPL wallet automatically

2. **Issue Tokens to Customer**
   - Customer makes $10 purchase
   - Issue 10 JJC tokens (1 token = $1)
   - Customer receives tokens instantly

3. **Monitor Dashboard**
   - See total tokens issued
   - Track customer balances
   - View transaction history

#### Customer Side (User)

1. **Set Up Wallet**
   - Download customer app
   - Generate XRPL wallet
   - Get address (starts with 'r')

2. **Establish Trust Line**
   - Scan business QR code
   - Approve trust line (one-time)
   - Now ready to receive tokens

3. **Receive Tokens**
   - Make purchase at store
   - Tokens appear in wallet automatically
   - Balance updates in real-time

4. **Redeem Rewards**
   - Browse available rewards
   - Select reward (e.g., "Free Coffee - 100 JJC")
   - Click "Redeem"
   - Tokens deducted, reward activated

## Common First-Time Issues

### "Transaction failed: tecUNFUNDED_PAYMENT"
**Solution:** Your wallet needs XRP. Visit the testnet faucet.

### "Trust line not established"
**Solution:** Customer must create trust line first (scan QR in app).

### "Insufficient XRP reserve"
**Solution:** XRPL requires 10 XRP base reserve + 2 XRP per trust line.

### "Cannot connect to XRPL"
**Solution:** Check your internet connection and WSS URL in .env file.

## Next Steps

### Customize Your Loyalty Program

1. **Adjust Token Ratios**
   - Edit in business dashboard
   - Example: 1 token per $2 spent

2. **Create Reward Catalog**
   - Define rewards (name, description, cost)
   - Set redemption rules
   - Add images

3. **Set Up Tiers**
   - Bronze: 100+ tokens
   - Silver: 500+ tokens
   - Gold: 1000+ tokens

### Test Different Scenarios

1. **Multiple Customers**
   - Generate several customer wallets
   - Issue tokens to each
   - Test balance tracking

2. **Reward Redemption**
   - Issue enough tokens
   - Redeem a reward
   - Verify token deduction

3. **Transaction History**
   - Make several transactions
   - View in dashboard
   - Check XRPL explorer

## Development Tips

### Hot Reload
Both apps support hot reload - changes appear instantly!

### Debug Mode
```bash
# Business Dashboard
cd business-dashboard
npm run dev -- --debug

# Customer App
cd customer-app
npm run dev -- --debug
```

### View XRPL Transactions
Visit https://testnet.xrpl.org and search your address to see all transactions.

### Reset Everything
```bash
# Clear local storage in browser DevTools
localStorage.clear()

# Regenerate everything
```

## What's Next?

### Learn More
- Read [API.md](./API.md) for integration details
- Check [TESTING.md](./TESTING.md) for testing strategies
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production

### Try Advanced Features
- Set up database for customer data
- Add email notifications
- Implement QR scanning
- Deploy to production

### Try XRPL Hooks Version
```bash
cd ../XRPL-Loyalty-Hooks
npm run install:all
npm run compile:hooks
npm run dev
```

## Getting Help

- **Documentation**: Check the docs in this repo
- **XRPL Discord**: https://discord.gg/xrpl
- **XRPL Forum**: https://forum.xrpl.org
- **GitHub Issues**: Report bugs or request features

## Quick Reference

### Important URLs
- **Testnet Faucet**: https://xrpl.org/xrp-testnet-faucet.html
- **Testnet Explorer**: https://testnet.xrpl.org
- **XRPL Docs**: https://xrpl.org/docs.html
- **xrpl.js Docs**: https://js.xrpl.org

### Key Commands
```bash
npm run dev              # Start development servers
npm run build           # Build for production
npm test                # Run tests
npm run install:all     # Install all dependencies
```

### Environment Variables
```bash
# Business Dashboard (.env.local)
NEXT_PUBLIC_XRPL_WSS=wss://s.altnet.rippletest.net:51233

# Customer App (.env)
VITE_XRPL_WSS=wss://s.altnet.rippletest.net:51233
```

## Success! 🎉

You now have a working XRPL loyalty program! 

Next steps:
1. Customize the UI
2. Add your branding
3. Test thoroughly
4. Deploy to production (see DEPLOYMENT.md)
5. Star the repo if you found it useful! ⭐
