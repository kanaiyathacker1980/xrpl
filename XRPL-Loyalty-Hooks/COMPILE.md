# Hooks Compilation Guide

## Prerequisites

1. **Docker** (for WASM compilation)
2. **Node.js 18+**
3. **XRPL Hooks Testnet Account**

## Compilation Steps

### 1. Build WASI SDK Docker Image

```bash
cd hooks-compiler
chmod +x docker-build.sh
./docker-build.sh
```

This creates a Docker image with the WebAssembly System Interface (WASI) SDK for compiling C code to WASM.

### 2. Compile Hooks

From the project root:

```bash
npm run compile:hooks
```

Or manually compile a single hook:

```bash
cd hooks-compiler
npm run compile
```

This will:
- Read all `.c` files from the `hooks/` directory
- Compile each to WebAssembly (`.wasm`)
- Generate metadata files (`.json`) with hashes
- Output everything to the `compiled/` directory

### 3. Deploy Hooks

Use the business dashboard to deploy compiled hooks to the XRPL Hooks Testnet:

1. Start the hooks-compiler service: `npm run dev --workspace=hooks-compiler`
2. Open the business dashboard: `npm run dev --workspace=business-dashboard`
3. Go through onboarding and upload your compiled `.wasm` file

## Hook Development

### Writing Hooks

Hooks are written in C using the Hooks API:

```c
#include "hookapi.h"

int64_t hook(uint32_t reserved) {
    _g(1,1); // Guard
    
    // Your hook logic here
    
    accept(SBUF("Success"), 0);
}
```

### Available Hooks

1. **loyalty_issuer.c** - Automatically issues loyalty tokens on payments
2. **reward_validator.c** - Validates and processes reward redemptions

### Hook API Functions

- `otxn_type()` - Get transaction type
- `otxn_field()` - Get transaction field
- `hook_account()` - Get hook's account
- `state()` - Read from hook state
- `state_set()` - Write to hook state
- `emit()` - Emit a transaction
- `accept()` - Accept transaction
- `rollback()` - Reject transaction

## Testing

Test hooks on the Hooks Testnet:

1. Deploy your hook
2. Send test transactions
3. Check hook executions in transaction metadata

## Troubleshooting

### Docker not found
Install Docker from https://docs.docker.com/get-docker/

### Compilation errors
- Check C syntax
- Ensure all includes are correct
- Verify hook API usage

### Deployment errors
- Ensure you have XRP on Hooks Testnet
- Verify WASM is valid
- Check hook parameters
