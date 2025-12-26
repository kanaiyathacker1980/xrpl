# Testing Guide - XRPL Loyalty Platform

## Overview

This guide covers testing strategies for both XRPL Native and Hooks versions.

## Prerequisites

- XRPL Testnet account with funded XRP
- Node.js 18+
- All dependencies installed

## Getting Test XRP

### XRPL Testnet
```bash
# Visit: https://xrpl.org/xrp-testnet-faucet.html
# Enter your testnet address
# Receive 1000 test XRP instantly
```

### Hooks Testnet
```bash
# Visit: https://hooks-testnet-v3.xrpl-labs.com/
# Generate new account with faucet
# Receive test XRP for hooks testing
```

## Unit Testing

### Setup Jest

```bash
npm install --save-dev jest @types/jest ts-jest
```

**jest.config.js:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
}
```

### Test XRPL Service

```typescript
// __tests__/xrpl.test.ts
import { xrplService } from '../lib/xrpl'
import { Wallet } from 'xrpl'

describe('XRPLService', () => {
  let testWallet: Wallet
  
  beforeAll(() => {
    testWallet = Wallet.fromSeed('sEdVXXXXXXXXXXXXXXXXXXXXX')
  })
  
  test('should connect to testnet', async () => {
    await xrplService.connect()
    expect(xrplService.client.isConnected()).toBe(true)
  })
  
  test('should get account info', async () => {
    const info = await xrplService.getAccountInfo(testWallet.address)
    expect(info.account_data.Account).toBe(testWallet.address)
  })
  
  test('should create trust line', async () => {
    const result = await xrplService.createTrustLine(
      testWallet,
      'rIssuerAddress',
      'LYL'
    )
    expect(result.result.meta.TransactionResult).toBe('tesSUCCESS')
  })
})
```

## Integration Testing

### Test Full Token Flow

```typescript
// __tests__/token-flow.test.ts
describe('Token Issuance Flow', () => {
  let businessWallet: Wallet
  let customerWallet: Wallet
  
  beforeAll(async () => {
    // Generate test wallets
    businessWallet = Wallet.generate()
    customerWallet = Wallet.generate()
    
    // Fund from faucet (manual step or use faucet API)
  })
  
  test('complete token issuance flow', async () => {
    // 1. Customer establishes trust line
    const trustResult = await xrplService.createTrustLine(
      customerWallet,
      businessWallet.address,
      'LYL'
    )
    expect(trustResult.result.meta.TransactionResult).toBe('tesSUCCESS')
    
    // 2. Business issues tokens
    const issueResult = await xrplService.sendToken(
      businessWallet,
      customerWallet.address,
      'LYL',
      '100'
    )
    expect(issueResult.result.meta.TransactionResult).toBe('tesSUCCESS')
    
    // 3. Verify customer balance
    const lines = await xrplService.getTrustLines(customerWallet.address)
    const token = lines.find(l => l.currency === 'LYL')
    expect(token.balance).toBe('100')
  })
})
```

## Manual Testing Checklist

### Business Dashboard

#### Onboarding
- [ ] Generate new business wallet
- [ ] Save wallet information
- [ ] Redirect to dashboard
- [ ] Display wallet address and QR code

#### Token Issuance
- [ ] Enter valid customer address
- [ ] Enter token amount
- [ ] Submit transaction
- [ ] Display success message
- [ ] Show transaction hash
- [ ] Transaction appears on XRPL explorer

#### Dashboard Stats
- [ ] Stats update after token issuance
- [ ] Customer list displays correctly
- [ ] Transaction history loads
- [ ] QR code displays and downloads

### Customer App

#### Wallet Setup
- [ ] Generate new wallet
- [ ] Save wallet securely
- [ ] Display address correctly
- [ ] Request XRP from faucet

#### Token Management
- [ ] View token balances
- [ ] Balances update after receiving tokens
- [ ] Transaction history displays
- [ ] Multiple token issuers supported

#### Scanning
- [ ] QR scanner opens camera
- [ ] Scans business wallet address
- [ ] Validates XRPL address
- [ ] Requests trust line creation

#### Rewards
- [ ] Display available rewards
- [ ] Check token balance requirements
- [ ] Redeem reward
- [ ] Token balance updates

## Hooks Testing

### Compile Hooks

```bash
cd XRPL-Loyalty-Hooks
npm run compile:hooks

# Verify output
ls -la compiled/
# Should see .wasm and .json files
```

### Test Hook Deployment

```typescript
describe('Hook Deployment', () => {
  test('deploy loyalty issuer hook', async () => {
    const wasmFile = fs.readFileSync('./compiled/loyalty_issuer.wasm')
    const wasmHex = wasmFile.toString('hex')
    
    const result = await xrplHooksService.deployHook({
      name: 'loyalty_issuer',
      wasm: wasmHex,
      hash: 'ABC123...'
    })
    
    expect(result).toBeTruthy()
  })
})
```

### Test Hook Execution

```typescript
describe('Loyalty Issuer Hook', () => {
  test('hook issues tokens on payment', async () => {
    // Send payment to business with hook
    const payment = await xrplService.invokeHook(
      businessWallet.address,
      '10000000'  // 10 XRP
    )
    
    // Check hook execution
    const executions = await xrplHooksService.getHookExecutions(
      payment.result.hash
    )
    
    expect(executions.length).toBeGreaterThan(0)
    expect(executions[0].HookExecution.HookResult).toBe('0')
  })
})
```

## Performance Testing

### Load Test Token Issuance

```typescript
import { performance } from 'perf_hooks'

describe('Performance', () => {
  test('issue 100 tokens in parallel', async () => {
    const start = performance.now()
    
    const promises = Array.from({ length: 100 }, (_, i) => 
      xrplService.sendToken(
        businessWallet,
        customerWallet.address,
        'LYL',
        '1'
      )
    )
    
    await Promise.all(promises)
    
    const end = performance.now()
    const duration = end - start
    
    console.log(`Issued 100 tokens in ${duration}ms`)
    expect(duration).toBeLessThan(60000)  // Under 1 minute
  })
})
```

## E2E Testing with Playwright

```bash
npm install --save-dev @playwright/test
```

**e2e/business-onboarding.spec.ts:**
```typescript
import { test, expect } from '@playwright/test'

test('business onboarding flow', async ({ page }) => {
  await page.goto('http://localhost:3000')
  
  // Should redirect to onboarding
  await expect(page).toHaveURL(/\/onboarding/)
  
  // Fill business info
  await page.fill('input[name="businessName"]', 'Test Coffee Shop')
  await page.fill('input[name="tokenSymbol"]', 'TST')
  
  // Generate wallet
  await page.click('button:has-text("Generate Wallet")')
  
  // Should show wallet info
  await expect(page.locator('text=Wallet Generated')).toBeVisible()
  
  // Complete setup
  await page.click('button:has-text("Complete Setup")')
  
  // Should redirect to dashboard
  await expect(page).toHaveURL(/\/dashboard/)
})
```

## Debugging

### Enable XRPL Debug Logging

```typescript
import { Client } from 'xrpl'

const client = new Client('wss://s.altnet.rippletest.net:51233', {
  trace: true  // Enable debug logging
})
```

### View Transaction Details

```typescript
const tx = await client.request({
  command: 'tx',
  transaction: txHash,
  binary: false
})

console.log('Transaction:', JSON.stringify(tx, null, 2))
```

### Check Hook Executions

```typescript
const tx = await client.request({
  command: 'tx',
  transaction: txHash
})

const hookExecutions = tx.result.meta.HookExecutions
console.log('Hook Executions:', hookExecutions)
```

## Common Issues

### Issue: Trust line not established
**Solution:** Customer must create trust line before receiving tokens

### Issue: Insufficient XRP reserve
**Solution:** Ensure account has minimum 10 XRP reserve + owner reserve

### Issue: Hook not triggering
**Solution:** Check HookOn field and transaction type

### Issue: Transaction fails with tecUNFUNDED
**Solution:** Fund account from testnet faucet

## Continuous Integration

**GitHub Actions:**
```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Resources

- **XRPL Test Explorer**: https://testnet.xrpl.org
- **Hooks Testnet Explorer**: https://hooks-testnet-v3.xrpl-labs.com
- **WebSocket Tool**: https://xrpl.org/websocket-tool.html
