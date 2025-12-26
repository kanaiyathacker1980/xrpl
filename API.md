# XRPL Loyalty Platform - API Documentation

## Overview

This document describes the XRPL interactions and API patterns used in both Native and Hooks versions.

## XRPL Native - Token Operations

### 1. Create Business Wallet

```typescript
import { Wallet } from 'xrpl'

const businessWallet = Wallet.generate()
// Store businessWallet.seed securely
// Use businessWallet.address as token issuer
```

### 2. Issue Custom Token (Trust Line)

Customer must first establish a trust line:

```typescript
const trustSet = {
  TransactionType: 'TrustSet',
  Account: customerWallet.address,
  LimitAmount: {
    currency: 'LYL',  // 3-character token code
    issuer: businessWallet.address,
    value: '1000000'  // Maximum trust line limit
  }
}

const prepared = await client.autofill(trustSet)
const signed = customerWallet.sign(prepared)
const result = await client.submitAndWait(signed.tx_blob)
```

### 3. Send Loyalty Tokens

```typescript
const payment = {
  TransactionType: 'Payment',
  Account: businessWallet.address,  // Issuer
  Destination: customerWallet.address,
  Amount: {
    currency: 'LYL',
    value: '100',  // Token amount
    issuer: businessWallet.address
  }
}

const prepared = await client.autofill(payment)
const signed = businessWallet.sign(prepared)
const result = await client.submitAndWait(signed.tx_blob)
```

### 4. Get Token Balance

```typescript
const response = await client.request({
  command: 'account_lines',
  account: customerWallet.address,
  ledger_index: 'validated'
})

const tokens = response.result.lines
// Filter by issuer and currency
```

### 5. Redeem Reward (Send Tokens Back)

```typescript
const redemption = {
  TransactionType: 'Payment',
  Account: customerWallet.address,
  Destination: businessWallet.address,
  Amount: {
    currency: 'LYL',
    value: '50',  // Reward cost
    issuer: businessWallet.address
  }
}
```

## XRPL Hooks - Smart Contract Operations

### 1. Deploy Hook

```typescript
import { SetHookFlags } from 'xrpl'

const hookTx = {
  TransactionType: 'SetHook',
  Account: businessWallet.address,
  Hooks: [{
    Hook: {
      CreateCode: wasmHexString,  // Compiled WASM
      HookOn: '0000000000000000',  // Hook triggers
      HookNamespace: Buffer.from('loyalty').toString('hex'),
      HookApiVersion: 0,
      Flags: SetHookFlags.hsfOverride
    }
  }]
}

const prepared = await client.autofill(hookTx)
const signed = businessWallet.sign(prepared)
const result = await client.submitAndWait(signed.tx_blob)
```

### 2. Trigger Loyalty Issuance Hook

The loyalty_issuer hook automatically triggers on incoming payments:

```typescript
// Customer makes purchase payment
const payment = {
  TransactionType: 'Payment',
  Account: customerWallet.address,
  Destination: businessWallet.address,  // Has hook installed
  Amount: '10000000'  // 10 XRP purchase
}

// Hook automatically:
// 1. Detects payment
// 2. Calculates loyalty tokens (1% = 0.1 XRP worth)
// 3. Emits token payment back to customer
```

### 3. Trigger Reward Validation Hook

```typescript
const redemption = {
  TransactionType: 'Payment',
  Account: customerWallet.address,
  Destination: businessWallet.address,
  Amount: '1000000',  // 1 XRP
  Memos: [{
    Memo: {
      MemoData: Buffer.from('REDEEM_REWARD').toString('hex')
    }
  }]
}

// Hook automatically:
// 1. Detects REDEEM_REWARD memo
// 2. Checks customer tier
// 3. Applies discount
// 4. Deducts tokens from state
```

### 4. Read Hook State

```typescript
const response = await client.request({
  command: 'account_namespace',
  account: businessWallet.address,
  namespace_id: hookHash
})

const entries = response.result.namespace_entries
// Parse hook state data
```

## Business Dashboard API Patterns

### Authentication

```typescript
// Store in localStorage (development only)
localStorage.setItem('xrpl_business_wallet', JSON.stringify({
  address: wallet.address,
  seed: wallet.seed,  // NEVER in production!
  businessName: 'My Shop',
  tokenSymbol: 'LYL'
}))

// Production: Use secure authentication
// - Clerk
// - Auth0
// - Firebase Auth
```

### Issue Tokens Endpoint Pattern

```typescript
// API Route: /api/issue-tokens
export async function POST(req: Request) {
  const { customerAddress, amount } = await req.json()
  
  // Get business wallet from secure storage
  const businessWallet = await getBusinessWallet()
  
  // Send tokens
  const result = await xrplService.sendToken(
    businessWallet,
    customerAddress,
    'LYL',
    amount
  )
  
  return Response.json({ success: true, txHash: result.result.hash })
}
```

## Customer App API Patterns

### Wallet Management

```typescript
// Generate customer wallet
const customerWallet = Wallet.generate()

// Store securely
import * as Keychain from 'react-native-keychain'
await Keychain.setGenericPassword('xrpl_wallet', JSON.stringify({
  address: customerWallet.address,
  seed: customerWallet.seed
}))

// Retrieve
const credentials = await Keychain.getGenericPassword()
const walletData = JSON.parse(credentials.password)
```

### QR Code Scanning

```typescript
// Scan business wallet QR
import { BarcodeScanner } from '@capacitor/barcode-scanner'

const result = await BarcodeScanner.startScan()
const businessAddress = result.content  // rXXXXXXXXXXX...

// Establish trust line
await xrplService.createTrustLine(
  customerWallet,
  businessAddress,
  'LYL'
)
```

## Error Handling

### Common XRPL Errors

```typescript
try {
  await xrplService.sendToken(...)
} catch (error: any) {
  if (error.data?.error === 'tecUNFUNDED_PAYMENT') {
    // Insufficient balance
  } else if (error.data?.error === 'tecNO_DST_INSUF_XRP') {
    // Destination needs more XRP for reserve
  } else if (error.data?.error === 'tecNO_LINE') {
    // Trust line not established
  }
}
```

### Best Practices

1. **Always check balance before operations**
2. **Validate addresses** (use `isValidClassicAddress()`)
3. **Handle network disconnections gracefully**
4. **Implement retry logic with exponential backoff**
5. **Log all transactions for audit**

## Rate Limits

XRPL has no rate limits, but:
- Transaction fees scale with load
- Keep connections open (don't reconnect frequently)
- Use websocket subscriptions for real-time updates

## Testing

### Testnet Faucets

- **XRPL Testnet**: https://xrpl.org/xrp-testnet-faucet.html
- **Hooks Testnet**: https://hooks-testnet-v3.xrpl-labs.com/

### Test Transactions

```typescript
// Always use testnet for development
const client = new Client('wss://s.altnet.rippletest.net:51233')

// Fund test accounts
// Use faucet to get 1000 test XRP
```

## Security

### Production Checklist

- [ ] Never expose seeds/private keys
- [ ] Use hardware wallets for business accounts
- [ ] Implement multi-signature for high-value operations
- [ ] Validate all inputs
- [ ] Use HTTPS only
- [ ] Rate limit API endpoints
- [ ] Implement proper authentication
- [ ] Monitor for suspicious transactions
- [ ] Regular security audits
- [ ] Backup procedures in place

## Resources

- **XRPL Docs**: https://xrpl.org
- **xrpl.js Library**: https://js.xrpl.org
- **Hooks Documentation**: https://hooks-docs.xrpl.org
- **XRPL Explorer**: https://livenet.xrpl.org
