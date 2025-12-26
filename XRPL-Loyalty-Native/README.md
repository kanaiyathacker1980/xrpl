# XRPL Loyalty - Native Token Version

A decentralized loyalty rewards platform built on XRP Ledger using native token features. Businesses can issue custom loyalty tokens to customers who can manage all their rewards in one wallet.

## 🎯 Features

### For Businesses
- Issue custom loyalty tokens on XRPL
- Create token trust lines with customers
- Set up reward catalogs with token requirements
- Real-time dashboard with analytics
- QR code generation for easy token distribution

### For Customers
- Single XRPL wallet for all loyalty programs
- Scan QR codes to receive tokens
- Browse and redeem rewards
- Transfer tokens to friends
- View complete transaction history on XRPL

## 🏗️ Architecture

### Technology Stack
- **Blockchain**: XRP Ledger (Mainnet/Testnet)
- **Smart Tokens**: XRPL Fungible Tokens (Trust Lines)
- **Business Dashboard**: Next.js 14, TypeScript, Tailwind CSS
- **Customer App**: React PWA with Vite
- **XRPL Integration**: xrpl.js library
- **Wallet**: XUMM or Crossmark integration
- **Database**: PostgreSQL/Supabase (off-chain data)

### How It Works

1. **Business Onboarding**
   - Business creates XRPL wallet
   - Issues custom currency token (e.g., COFFEE, PIZZA)
   - Sets token properties (supply, transferability)

2. **Token Issuance**
   - Customer scans QR code at checkout
   - Business sends tokens via XRPL Payment transaction
   - Customer establishes trust line (first-time only)

3. **Reward Redemption**
   - Customer browses available rewards
   - Redeems by sending tokens back to business
   - Transaction recorded on XRPL

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **XRPL Account** on Testnet (get from https://xrpl.org/xrp-testnet-faucet.html)
- **PostgreSQL** or **Supabase** account
- **XUMM** or **Crossmark** wallet for testing

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/kanaiyathacker1980/XRPL-Loyalty-Native.git
cd XRPL-Loyalty-Native
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Configure Environment

**Business Dashboard:**
```bash
cd business-dashboard
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_XRPL_NETWORK=testnet
NEXT_PUBLIC_XRPL_WSS=wss://s.altnet.rippletest.net:51233
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
DATABASE_URL=your_postgres_url
```

**Customer App:**
```bash
cd customer-app
cp .env.example .env
```

Edit `.env`:
```env
VITE_XRPL_NETWORK=testnet
VITE_XRPL_WSS=wss://s.altnet.rippletest.net:51233
```

### 4. Run Development Servers

**Business Dashboard:**
```bash
cd business-dashboard
npm run dev
```
Open http://localhost:3000

**Customer App:**
```bash
cd customer-app
npm run dev
```
Open http://localhost:5173

## 💡 How to Use

### For Businesses

1. **Setup Your Business**
   - Sign up and create business profile
   - Generate XRPL wallet or import existing
   - Define your loyalty token (name, symbol, supply)

2. **Issue Tokens**
   - Customer scans QR code at point of sale
   - Enter amount to issue
   - Transaction sent to XRPL
   - Customer receives tokens instantly

3. **Manage Rewards**
   - Create reward items with token costs
   - Monitor redemptions
   - View analytics

### For Customers

1. **Setup Wallet**
   - Install XUMM or Crossmark wallet
   - Connect to app
   - Establish trust lines with businesses

2. **Earn Tokens**
   - Scan QR codes at participating businesses
   - Approve trust line (first time per business)
   - Receive tokens in wallet

3. **Redeem Rewards**
   - Browse available rewards
   - Select reward to redeem
   - Send tokens back to business
   - Show confirmation at business

## 🔧 XRPL Integration

### Token Creation

```javascript
// Create custom currency token
const trustSet = {
  TransactionType: "TrustSet",
  Account: customerWallet.address,
  LimitAmount: {
    currency: "COFFEE", // 3-letter currency code
    issuer: businessWallet.address,
    value: "1000000" // Trust line limit
  }
}
```

### Issuing Tokens

```javascript
// Send tokens to customer
const payment = {
  TransactionType: "Payment",
  Account: businessWallet.address,
  Destination: customerWallet.address,
  Amount: {
    currency: "COFFEE",
    issuer: businessWallet.address,
    value: "10" // Amount to send
  }
}
```

### Redeeming Tokens

```javascript
// Customer sends tokens back for reward
const redemption = {
  TransactionType: "Payment",
  Account: customerWallet.address,
  Destination: businessWallet.address,
  Amount: {
    currency: "COFFEE",
    issuer: businessWallet.address,
    value: "50" // Cost of reward
  }
}
```

## 📱 XUMM Integration

```javascript
import { XummSdk } from 'xumm'

const xumm = new XummSdk(apiKey, apiSecret)

// Create sign request
const payload = await xumm.payload.create({
  txjson: payment
})

// User signs in XUMM app
const qr = payload.refs.qr_png
```

## 🧪 Testing on Testnet

1. Get test XRP: https://xrpl.org/xrp-testnet-faucet.html
2. Use Testnet endpoints:
   - WSS: `wss://s.altnet.rippletest.net:51233`
   - JSON-RPC: `https://s.altnet.rippletest.net:51234`
3. Verify transactions: https://testnet.xrpl.org

## 📊 Database Schema

```sql
-- Business profiles
CREATE TABLE businesses (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  xrpl_address TEXT UNIQUE NOT NULL,
  token_currency TEXT NOT NULL,
  token_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rewards catalog
CREATE TABLE rewards (
  id UUID PRIMARY KEY,
  business_id UUID REFERENCES businesses(id),
  name TEXT NOT NULL,
  description TEXT,
  token_cost DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions (off-chain cache)
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  xrpl_hash TEXT UNIQUE NOT NULL,
  business_id UUID REFERENCES businesses(id),
  customer_address TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  type TEXT NOT NULL, -- 'issuance' or 'redemption'
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Deploy to Production

1. **Get Production XRPL Wallets**
   - Use Mainnet with real XRP
   - Secure private keys properly

2. **Deploy Frontend**
   ```bash
   # Business Dashboard
   cd business-dashboard
   vercel deploy --prod
   
   # Customer App
   cd customer-app
   vercel deploy --prod
   ```

3. **Configure Mainnet**
   ```env
   NEXT_PUBLIC_XRPL_NETWORK=mainnet
   NEXT_PUBLIC_XRPL_WSS=wss://xrplcluster.com
   ```

## 🔒 Security Considerations

- Never expose private keys in frontend
- Use XUMM/Crossmark for wallet operations
- Implement rate limiting on token issuance
- Validate all XRPL transactions server-side
- Use HTTPS only in production
- Implement proper key management

## 📈 Roadmap

- [ ] Week 1: Core XRPL integration
- [ ] Week 2: Business dashboard
- [ ] Week 3: Customer PWA
- [ ] Week 4: XUMM integration
- [ ] Week 5: Testing & security audit
- [ ] Week 6: Mainnet deployment

## 📖 Resources

- [XRPL Documentation](https://xrpl.org/)
- [xrpl.js Library](https://js.xrpl.org/)
- [XUMM SDK](https://xumm.readme.io/)
- [Testnet Faucet](https://xrpl.org/xrp-testnet-faucet.html)
- [Transaction Explorer](https://livenet.xrpl.org/)

## 🤝 Contributing

Contributions welcome! Please open issues and PRs.

## 📄 License

MIT License

## 🔗 Links

- **XRPL**: https://xrpl.org/
- **GitHub**: https://github.com/kanaiyathacker1980/XRPL-Loyalty-Native
- **Twitter**: Tag @Ripple @XRPLF

---

**Built with ❤️ on XRP Ledger**
