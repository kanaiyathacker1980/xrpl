# XRPL Loyalty - Hooks Version

An advanced decentralized loyalty rewards platform built on XRP Ledger using **XRPL Hooks** (smart contracts). This version uses C++ Hooks for automated, trustless loyalty program management.

## 🎯 Features

### For Businesses
- Deploy custom loyalty smart contracts (Hooks)
- Automated token issuance based on rules
- Smart contract-enforced reward redemption
- Programmable loyalty tiers and bonuses
- Real-time dashboard with on-chain analytics

### For Customers
- XRPL wallet for all loyalty programs
- Automatic token calculations via Hooks
- Instant, trustless reward redemption
- Smart contract-verified transactions
- Complete on-chain transaction history

## 🏗️ Architecture

### Technology Stack
- **Blockchain**: XRP Ledger with Hooks
- **Smart Contracts**: C++ Hooks (WebAssembly)
- **Business Dashboard**: Next.js 14, TypeScript, Tailwind CSS
- **Customer App**: React PWA with Vite
- **XRPL Integration**: xrpl.js library + Hooks Testnet
- **Wallet**: XUMM or Crossmark
- **Compiler**: hooks-toolkit (C++ to WASM)

### XRPL Hooks Overview

XRPL Hooks are smart contracts written in C that run on the XRP Ledger:
- Execute automatically on transaction events
- Enforce business logic on-chain
- No gas fees (only transaction fees)
- Deterministic and efficient

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **C++ Compiler** (gcc or clang)
- **hooks-toolkit** for compiling Hooks
- **Docker** (optional, for Hook development)
- **XRPL Hooks Testnet** account
- **XUMM** wallet for testing

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/kanaiyathacker1980/XRPL-Loyalty-Hooks.git
cd XRPL-Loyalty-Hooks
```

### 2. Install Dependencies

```bash
npm run install:all
```

### 3. Setup Hook Development Environment

```bash
# Install hooks-toolkit
git clone https://github.com/XRPL-Labs/xrpld-hooks.git
cd xrpld-hooks
docker build -t hooks-builder .

# Or install locally
brew install gcc
npm install -g @xrpl-labs/xrpl-hooks-toolkit
```

### 4. Configure Environment

**Business Dashboard:**
```bash
cd business-dashboard
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_XRPL_NETWORK=hooks-testnet
NEXT_PUBLIC_XRPL_WSS=wss://hooks-testnet-v3.xrpl-labs.com
NEXT_PUBLIC_HOOK_COMPILER_API=http://localhost:3001
DATABASE_URL=your_postgres_url
```

### 5. Run Development Servers

**Business Dashboard:**
```bash
cd business-dashboard
npm run dev
```

**Customer App:**
```bash
cd customer-app
npm run dev
```

**Hook Compiler Service:**
```bash
cd hooks-compiler
npm run dev
```

## 🔧 Writing XRPL Hooks

### Example: Loyalty Token Issuance Hook

```c
// loyalty_issuer.c
#include <stdint.h>
#include "hookapi.h"

#define REWARD_RATE 10  // 10 tokens per transaction

int64_t hook(uint32_t reserved) {
    
    // Get transaction amount
    unsigned char amount_buffer[48];
    int64_t amount = otxn_field(amount_buffer, 48, sfAmount);
    
    // Calculate reward tokens
    int64_t reward = amount / 100 * REWARD_RATE;
    
    // Get customer account
    unsigned char customer[20];
    otxn_field(customer, 20, sfDestination);
    
    // Issue loyalty tokens
    unsigned char token_amount[48];
    float_set(token_amount, reward);
    
    // Create IOU payment
    unsigned char tx[300];
    PREPARE_PAYMENT_SIMPLE(
        tx,
        customer,        // Destination
        token_amount,    // Amount
        0, 0,           // Flags
        0, 0            // Fee
    );
    
    // Emit transaction
    emit(tx, 300);
    
    accept(0,0,0);
    return 0;
}
```

### Compile Hook

```bash
cd hooks/loyalty_issuer
hook-build loyalty_issuer.c
# Output: loyalty_issuer.wasm
```

### Deploy Hook

```javascript
import { XrplClient } from 'xrpl-client'
import fs from 'fs'

const client = new XrplClient('wss://hooks-testnet-v3.xrpl-labs.com')

const hookWasm = fs.readFileSync('loyalty_issuer.wasm')

const setHookTx = {
  Account: businessWallet.address,
  TransactionType: 'SetHook',
  Hooks: [{
    Hook: {
      CreateCode: hookWasm.toString('hex').toUpperCase(),
      HookOn: '0000000000000000', // All transactions
      HookNamespace: 'LOYALTY',
      HookApiVersion: 0
    }
  }]
}

const result = await client.submit(setHookTx, { wallet: businessWallet })
```

## 💡 Hook Use Cases

### 1. Automatic Token Issuance Hook

```c
// Automatically issue loyalty tokens when customer makes payment
if (transaction_type == PAYMENT && destination == business_account) {
    calculate_reward(amount);
    issue_tokens(customer, reward_amount);
}
```

### 2. Tiered Rewards Hook

```c
// Different reward rates based on customer tier
int64_t tier = get_customer_tier(customer);
int64_t multiplier = tier == GOLD ? 3 : tier == SILVER ? 2 : 1;
int64_t reward = base_reward * multiplier;
```

### 3. Expiration Hook

```c
// Automatically expire tokens after certain period
if (current_ledger - last_activity > EXPIRY_LEDGERS) {
    burn_tokens(customer, expired_amount);
}
```

### 4. Redemption Validation Hook

```c
// Verify customer has enough tokens before redemption
if (customer_balance >= reward_cost) {
    burn_tokens(customer, reward_cost);
    emit_voucher(customer, reward_id);
} else {
    rollback("Insufficient tokens");
}
```

## 📂 Project Structure

```
XRPL-Loyalty-Hooks/
├── hooks/                      # C++ Hook source code
│   ├── loyalty-issuer/        # Token issuance Hook
│   ├── reward-validator/      # Redemption validation Hook
│   ├── tier-manager/          # Customer tier Hook
│   └── expiry-manager/        # Token expiration Hook
├── hooks-compiler/            # Hook compilation service
├── business-dashboard/        # Next.js Business App
├── customer-app/             # React PWA Customer App
├── scripts/                  # Deployment scripts
└── tests/                    # Hook unit tests
```

## 🧪 Testing Hooks

### Unit Testing

```javascript
// test/loyalty-issuer.test.js
import { testHook } from '@xrpl-labs/hooks-toolkit'

describe('Loyalty Issuer Hook', () => {
  it('should issue tokens on payment', async () => {
    const result = await testHook({
      hook: 'loyalty_issuer.wasm',
      transaction: {
        TransactionType: 'Payment',
        Amount: '100000000', // 100 XRP
        Destination: customerAddress
      }
    })
    
    expect(result.emittedTxs).toHaveLength(1)
    expect(result.emittedTxs[0].Amount.value).toBe('10') // 10 loyalty tokens
  })
})
```

### Integration Testing on Hooks Testnet

1. Get Hooks Testnet XRP: https://hooks-testnet-v3.xrpl-labs.com
2. Deploy Hook to testnet
3. Execute test transactions
4. Verify Hook behavior

## 🔒 Security Considerations

- **Code Audits**: Audit all Hook code before mainnet deployment
- **State Management**: Careful with Hook state variables
- **Gas Limits**: Hooks have execution limits
- **Determinism**: Ensure Hook logic is deterministic
- **Testing**: Extensive testing on Hooks Testnet
- **Rollback Handling**: Implement proper error handling

## 📊 Hook State Management

```c
// Store customer tier in Hook state
#define STATE_KEY_TIER "TIER"

// Save tier
int64_t tier = GOLD_TIER;
state_set(STATE_KEY_TIER, 4, customer, 20, tier);

// Read tier
int64_t stored_tier;
state_get(&stored_tier, 8, STATE_KEY_TIER, 4, customer, 20);
```

## 🚀 Deployment to Mainnet

⚠️ **Hooks are currently NOT on XRPL Mainnet**

Hooks are available on:
- Hooks Testnet V3
- Xahau Network (Hooks-enabled XRPL sidechain)

For production deployment:
1. Wait for Hooks mainnet release
2. Or deploy on Xahau Network
3. Thorough security audit required

## 📈 Roadmap

- [ ] Week 1-2: Hook development & testing
- [ ] Week 3: Business dashboard integration
- [ ] Week 4: Customer app with Hook interactions
- [ ] Week 5: Hooks Testnet deployment
- [ ] Week 6: Security audit
- [ ] Week 7+: Mainnet preparation

## 🛠️ Hook Development Tools

- **hooks-toolkit**: C compiler for Hooks
- **Hook Cleaner**: Debugging tool
- **XRPL Explorer**: View Hook execution
- **Docker**: Isolated Hook build environment

## 📖 Resources

- [XRPL Hooks Documentation](https://xrpl-hooks.readme.io/)
- [Hooks Tutorial](https://hooks-docs.xrpl.org/)
- [Hooks Testnet](https://hooks-testnet-v3.xrpl-labs.com)
- [Xahau Network](https://xahau.network/)
- [Hook Examples](https://github.com/XRPL-Labs/xrpld-hooks/tree/hooks/hook-examples)

## 🤝 Contributing

Hook contributions welcome! Please test thoroughly on Hooks Testnet.

## 📄 License

MIT License

## 🔗 Links

- **XRPL Hooks**: https://xrpl-hooks.readme.io/
- **GitHub**: https://github.com/kanaiyathacker1980/XRPL-Loyalty-Hooks
- **Xahau**: https://xahau.network/

---

**Built with ⚡ on XRPL Hooks**
