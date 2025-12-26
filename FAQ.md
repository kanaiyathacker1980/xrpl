# FAQ - XRPL Loyalty Platform

## General Questions

### What is this project?

A decentralized loyalty rewards platform built on XRP Ledger. Businesses can issue custom loyalty tokens to customers who can manage all their rewards in one wallet.

### Do I need cryptocurrency experience?

No! The platform handles all blockchain complexity behind the scenes. Businesses and customers interact through simple web/mobile apps.

### Is this production-ready?

The Native version is production-ready. The Hooks version is experimental (Hooks are on testnet only).

### Which version should I use?

- **XRPL Native**: For production deployments, simpler to maintain
- **XRPL Hooks**: For advanced automation, complex business logic

### What are the costs?

- **XRPL transactions**: ~$0.00001 USD per transaction (negligible)
- **Infrastructure**: Normal hosting costs (Vercel, AWS, etc.)
- **No monthly blockchain fees**

## Technical Questions

### What programming languages are used?

- **Frontend**: TypeScript, React, Next.js
- **Backend**: Node.js, TypeScript
- **Smart Contracts (Hooks only)**: C
- **Blockchain**: XRPL

### Can I customize the UI?

Yes! All code is open source. You can customize:
- Colors and branding
- User flows
- Features
- Integrations

### Does it work on mobile?

Yes! The customer app is a Progressive Web App (PWA) that works on:
- iOS Safari
- Android Chrome
- Desktop browsers

For native mobile apps, you can adapt the code to React Native.

### How does it scale?

XRPL handles 1,500 transactions per second. The limiting factor is usually your backend infrastructure, not the blockchain.

### Can I use my own database?

Yes! The platform uses XRPL for token transactions but you can add PostgreSQL, MongoDB, etc. for:
- User profiles
- Reward catalogs
- Analytics
- Audit logs

## XRPL Questions

### What is XRP Ledger?

A fast, low-cost blockchain designed for payments. Features:
- 3-5 second settlement
- $0.00001 transaction fees
- Built-in DEX
- Native token support

### Do customers need XRP?

Yes, but very little:
- **Initial setup**: ~10 XRP (one-time, ~$5-10)
- **Per trust line**: +2 XRP reserve
- **Transaction fees**: $0.00001 each

The business can sponsor these costs if desired.

### What's a trust line?

A consent mechanism on XRPL. Customers must "trust" a business's tokens before receiving them. Think of it like adding a business's loyalty program to your wallet.

### Can tokens be transferred between users?

Yes! XRPL tokens are fully transferable unless you configure them otherwise. Customers can:
- Send tokens to friends
- Trade on DEX
- Use across multiple businesses

### What's the difference between testnet and mainnet?

- **Testnet**: Free test XRP, for development/testing
- **Mainnet**: Real XRP, for production use

Always test on testnet first!

## Business Questions

### How do customers sign up?

1. Download customer app
2. Generate XRPL wallet (automatic)
3. Scan business QR code
4. Accept trust line
5. Start earning tokens!

### Can I have multiple locations?

Yes! Options:
1. **Single wallet**: All locations use same business wallet
2. **Multiple wallets**: Each location has own wallet
3. **Federation**: Shared loyalty network across businesses

### How do I prevent fraud?

- All transactions are on blockchain (immutable audit trail)
- Implement KYC if needed
- Rate limit token issuance
- Monitor suspicious patterns
- Use multi-signature for high-value operations

### Can I revoke tokens?

Only if you configure a "clawback" feature. By default, tokens are permanent once issued (like cash).

### How do refunds work?

Customers can send tokens back to you, or you can implement a refund system in your dashboard.

### Can I expire tokens?

Yes! Implement expiration logic in your backend:
- Track issuance dates
- Deny redemption of expired tokens
- Send reminders before expiration

## Hooks-Specific Questions

### What are XRPL Hooks?

Smart contracts for XRPL written in C. They execute automatically when transactions occur.

### Why use Hooks over Native?

Hooks enable:
- Automatic loyalty calculation
- Complex business rules on-chain
- Trustless automation
- Advanced tier systems

### Do I need to know C?

For Hooks development, yes. But you can use the pre-built hooks and just deploy them.

### Can I update a deployed Hook?

Yes! Deploy a new version with the same namespace. Previous executions remain on-chain.

### Are Hooks on mainnet?

Not yet. Hooks are currently on testnet (v3). Mainnet launch is planned.

### What if Hooks never launch on mainnet?

You can always use the Native version which works on mainnet today.

## Development Questions

### How do I test locally?

```bash
npm run dev
```

Both business dashboard and customer app run locally. Use testnet for XRPL operations.

### Can I use a different blockchain?

The code is XRPL-specific, but the architecture could be adapted to:
- Ethereum (with gas costs)
- Solana
- Other EVM chains

### How do I deploy to production?

See [DEPLOYMENT.md](./DEPLOYMENT.md). Quick options:
- Vercel (easiest)
- AWS/GCP/Azure
- Docker containers
- Traditional hosting

### Do I need a backend server?

Optional. You can run fully client-side with:
- Frontend apps only
- Direct XRPL integration
- No database

Add a backend for:
- User authentication
- Reward catalogs
- Analytics
- Business logic

### How do I handle environment variables?

```bash
# Copy example files
cp .env.example .env.local

# Edit with your values
NEXT_PUBLIC_XRPL_WSS=your_wss_url
```

Never commit `.env.local` to git!

## Security Questions

### Is it secure?

Yes, if you follow best practices:
- Never expose seed phrases
- Use HTTPS only
- Implement authentication
- Validate all inputs
- Use hardware wallets for business accounts
- Regular security audits

### Can someone steal my tokens?

Not without your seed phrase. Keep it:
- Offline (write it down)
- In a password manager
- In a hardware wallet
- NEVER in code or email

### What if I lose my seed phrase?

Your tokens are gone forever. There's no "forgot password" on blockchain. Always:
- Back up in multiple locations
- Test recovery process
- Use hardware wallets for large amounts

### Can transactions be reversed?

No. Blockchain transactions are permanent. Always:
- Double-check addresses
- Test with small amounts first
- Implement confirmation dialogs

### How do I handle customer data privacy?

XRPL is public - all transactions are visible. For privacy:
- Don't put PII in transaction memos
- Store sensitive data off-chain
- Comply with GDPR/CCPA
- Use separate customer IDs

## Integration Questions

### Can I integrate with existing POS systems?

Yes! Options:
1. API integration
2. QR code scanning at checkout
3. Webhook notifications
4. Custom middleware

### Can I integrate with mobile wallets?

Yes! Use:
- XUMM wallet (easiest)
- Crossmark
- GemWallet
- Custom wallet integration

### Can I use existing customer databases?

Yes! Map customer IDs to XRPL addresses:
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  xrpl_address VARCHAR(255) UNIQUE
);
```

### Can I integrate with Shopify/WooCommerce?

Yes! Create plugins that:
- Generate XRPL wallets for customers
- Issue tokens on purchase
- Allow token redemption at checkout

## Pricing Questions

### Is this free to use?

The code is free (MIT License). Costs:
- XRPL transactions: ~$0.00001 each
- Hosting: Varies ($0-100/month)
- Domain: ~$10/year
- Development time

### What are ongoing costs?

- **XRPL fees**: Negligible ($1/month for 100k transactions)
- **Hosting**: $0-100/month depending on scale
- **Maintenance**: Developer time

### Can I charge customers?

Yes! You can:
- Charge for premium features
- Take a fee on redemptions
- Sell tokens
- Monetize however you want

## Support Questions

### Where do I get help?

1. **Documentation**: Check docs in this repo
2. **XRPL Discord**: https://discord.gg/xrpl
3. **GitHub Issues**: Report bugs
4. **XRPL Forum**: https://forum.xrpl.org

### Can I hire someone to customize this?

Yes! Look for developers with:
- React/Next.js experience
- XRPL/blockchain knowledge
- Full-stack skills

### Is there commercial support?

Community-driven. For enterprise support:
- XRPL Labs
- Ripple partnerships
- Independent consultants

### How do I contribute?

1. Fork the repo
2. Make improvements
3. Submit pull request
4. Join discussions

## Future Features

### What's on the roadmap?

- NFT rewards
- Multi-currency support
- Advanced analytics
- Mobile apps (React Native)
- Multi-business federation
- DeFi integrations

### Can I suggest features?

Yes! Open a GitHub issue with:
- Feature description
- Use case
- Why it's valuable

### When will Hooks be on mainnet?

Timeline is TBD. Follow XRPL Labs announcements.

## Comparison Questions

### How is this different from traditional loyalty programs?

**Traditional:**
- Closed systems
- Points trapped per business
- Controlled by one company
- Expensive infrastructure
- No interoperability

**XRPL Loyalty:**
- Open standard
- Tokens portable across businesses
- Decentralized
- Low cost
- Full interoperability

### How does it compare to other blockchain loyalty platforms?

**vs Ethereum:**
- Much lower fees ($0.00001 vs $1-50)
- Faster (3s vs 15s)
- Simpler (built-in tokens)

**vs Solana:**
- More stable/mature
- Better documentation
- Lower complexity

**vs Private Blockchains:**
- True decentralization
- No vendor lock-in
- Public verifiability

### Can it replace my existing loyalty system?

Yes! Migration steps:
1. Deploy XRPL platform
2. Run both systems in parallel
3. Migrate customers gradually
4. Sunset old system

---

**More questions?** Open a GitHub issue or ask on XRPL Discord!
