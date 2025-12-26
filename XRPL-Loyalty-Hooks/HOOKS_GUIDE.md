# XRPL Loyalty Hooks - Detailed Implementation Guide

## Project Overview

XRPL-Loyalty-Hooks uses **XRPL Hooks** - smart contracts written in C that execute on-chain. This enables trustless, automated loyalty token distribution with custom business logic.

## Key Differences from Native Version

### Native (XRPL-Loyalty-Native)
- **Client-side logic**: All validation happens in the application
- **Trust-based**: Requires trusting the business to issue tokens correctly
- **Flexible**: Easy to modify and update
- **Simple**: JavaScript/TypeScript only

### Hooks (XRPL-Loyalty-Hooks)
- **On-chain logic**: Validation and issuance happens on the XRPL ledger
- **Trustless**: Rules are enforced by the blockchain
- **Efficient**: Compiled C code runs very fast
- **Complex**: Requires C programming and WASM compilation

## Hook Architecture

### 1. loyalty_issuer.c
**Purpose**: Automatically issues loyalty tokens when customers make purchases

**Trigger**: Payment transaction to business wallet

**Logic**:
1. Validate payment amount meets minimum ($1 = 1 XRP)
2. Calculate loyalty tokens (1% of payment amount)
3. Cap tokens at maximum per transaction
4. Emit token payment to customer's wallet
5. Log transaction on-chain

**Parameters**:
- `max_tokens_per_tx`: 1000 tokens maximum
- `min_purchase_amount`: 1 XRP minimum ($1)

### 2. reward_validator.c
**Purpose**: Validates reward redemptions with tier-based discounts

**Trigger**: Payment with "REDEEM_REWARD" memo

**Logic**:
1. Check customer's token balance from hook state
2. Determine customer tier (Bronze/Silver/Gold)
3. Apply tier-based discount to reward cost
4. Deduct tokens from customer balance
5. Update state and allow redemption

**Tiers**:
- Bronze: 100+ tokens (5% discount)
- Silver: 500+ tokens (10% discount)
- Gold: 1000+ tokens (20% discount)

## Setup Instructions

### Prerequisites

1. **Docker** (for WASM compilation)
```bash
docker --version
```

2. **Node.js 18+**
```bash
node --version
```

3. **XRPL Hooks Testnet Account**
- Get test XRP from: https://hooks-testnet-v3.xrpl-labs.com/

### Installation

```bash
# Install all dependencies
npm run install:all

# Build WASI SDK Docker image
cd hooks-compiler
chmod +x docker-build.sh
./docker-build.sh
cd ..
```

### Compile Hooks

```bash
# Compile all C hooks to WASM
npm run compile:hooks
```

This creates:
- `compiled/loyalty_issuer.wasm` - Loyalty issuance hook
- `compiled/reward_validator.wasm` - Reward validation hook
- `compiled/*.json` - Metadata files with hashes

### Development

```bash
# Run all services
npm run dev
```

Services:
- Business Dashboard: http://localhost:3001
- Customer App: http://localhost:5174
- Hooks Compiler: http://localhost:3002

## Deploying Hooks to XRPL

### Step 1: Compile Hooks
```bash
npm run compile:hooks
```

### Step 2: Deploy via Business Dashboard

1. Go to http://localhost:3001/onboarding
2. Enter business name and token symbol
3. Generate XRPL wallet
4. Upload compiled `loyalty_issuer.wasm`
5. Click "Deploy Hook to XRPL"

This submits a `SetHook` transaction to install the hook on your account.

### Step 3: Configure Hook Parameters

Edit hook parameters in the dashboard:
- Maximum tokens per transaction
- Minimum purchase amount
- Reward tier thresholds

### Step 4: Test Hook Execution

1. Send a payment to your business wallet
2. Hook automatically executes
3. Loyalty tokens are issued to customer
4. Check hook execution in XRPL explorer

## Hook API Reference

### Key Functions Used

#### otxn_field()
```c
int64_t otxn_field(uint8_t* buf, uint32_t buf_len, uint32_t field_id);
```
Retrieves a field from the originating transaction.

#### emit()
```c
int64_t emit(uint8_t* hash_out, uint32_t hash_len, uint8_t* tx, uint32_t tx_len);
```
Emits a new transaction from the hook.

#### state() / state_set()
```c
int64_t state(uint8_t* buf, uint32_t buf_len, uint8_t* key, uint32_t key_len);
int64_t state_set(uint8_t* data, uint32_t data_len, uint8_t* key, uint32_t key_len);
```
Read/write persistent state associated with the hook.

#### trace()
```c
int64_t trace(uint8_t* msg, uint32_t msg_len, uint8_t* data, uint32_t data_len, uint32_t as_hex);
```
Logs debug information visible in transaction metadata.

## Testing

### Local Testing
```bash
# Test hook compilation
npm run compile:hooks

# Verify WASM output
ls -lh compiled/

# Check metadata
cat compiled/loyalty_issuer.json
```

### Testnet Testing

1. Fund your wallet with test XRP
2. Deploy hooks to Hooks Testnet
3. Send test payments to trigger hooks
4. View execution in explorer: https://hooks-testnet-v3-explorer.xrpl-labs.com/

### Production Checklist

- [ ] Security audit of C code
- [ ] Load testing with multiple transactions
- [ ] Gas cost analysis
- [ ] Backup plan for hook updates
- [ ] Monitoring and alerting setup
- [ ] Customer communication plan

## Hook Updates

Hooks are **immutable** once deployed. To update:

1. Compile new version
2. Deploy to new namespace
3. Migrate customers to new hook
4. OR: Use `hsfOverride` flag to replace existing hook

## Troubleshooting

### Hook Compilation Fails
- Check Docker is running
- Verify WASI SDK image built correctly
- Check C syntax errors in hook code

### Hook Doesn't Execute
- Verify hook deployed successfully
- Check HookOn field is correct
- Ensure triggering transaction matches hook logic
- View execution logs in transaction metadata

### State Not Persisting
- Verify state_set() returns success (>= 0)
- Check key length (must be 32 bytes)
- Ensure sufficient hook execution budget

## Resources

- [XRPL Hooks Documentation](https://xrpl-hooks.readme.io/)
- [Hooks Builder](https://hooks-builder.xrpl.org/)
- [Hooks Testnet Explorer](https://hooks-testnet-v3-explorer.xrpl-labs.com/)
- [XRPL Hooks GitHub](https://github.com/XRPL-Labs/xrpld-hooks)

## Support

For questions about XRPL Hooks:
- XRPL Hooks Discord: https://discord.gg/xrpl
- GitHub Issues: https://github.com/XRPL-Labs/xrpld-hooks/issues
