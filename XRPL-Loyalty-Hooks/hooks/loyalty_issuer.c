/*
 * Loyalty Issuer Hook
 * 
 * This hook validates and issues loyalty tokens when customers make purchases.
 * It executes on-chain when a payment transaction is submitted.
 */

#include "hookapi.h"

#define HOOK_ACCOUNT_SIZE 20
#define CURRENCY_CODE_SIZE 20
#define AMOUNT_SIZE 48

// Hook parameters (configured during deployment)
int64_t max_tokens_per_tx = 1000000; // 1000 tokens (with 3 decimals)
int64_t min_purchase_amount = 1000000; // 1 XRP minimum

int64_t hook(uint32_t reserved) {
    
    _g(1,1); // Guard against infinite loops
    
    // Get transaction type
    uint8_t tx_type[1];
    if (otxn_type(SBUF(tx_type)) != 1)
        rollback(SBUF("Loyalty: Could not get transaction type"), 1);
    
    // Only process Payment transactions
    if (tx_type[0] != 0) // 0 = Payment
        accept(SBUF("Loyalty: Not a payment transaction"), 0);
    
    // Get payment amount
    uint8_t amount_buffer[AMOUNT_SIZE];
    int64_t amount_len = otxn_field(SBUF(amount_buffer), sfAmount);
    if (amount_len < 0)
        rollback(SBUF("Loyalty: Could not get amount"), 2);
    
    // Convert amount to int64
    int64_t payment_amount = slot_float(slot_set(SBUF(amount_buffer), 1));
    
    // Check minimum purchase amount
    if (payment_amount < min_purchase_amount)
        accept(SBUF("Loyalty: Payment below minimum"), 0);
    
    // Calculate loyalty tokens (1% of payment)
    int64_t loyalty_tokens = payment_amount / 100;
    
    // Cap at maximum
    if (loyalty_tokens > max_tokens_per_tx)
        loyalty_tokens = max_tokens_per_tx;
    
    // Get customer account (transaction sender)
    uint8_t customer_account[HOOK_ACCOUNT_SIZE];
    if (otxn_field(SBUF(customer_account), sfAccount) != HOOK_ACCOUNT_SIZE)
        rollback(SBUF("Loyalty: Could not get customer account"), 3);
    
    // Get business account (hook account - destination)
    uint8_t business_account[HOOK_ACCOUNT_SIZE];
    if (hook_account(SBUF(business_account)) != HOOK_ACCOUNT_SIZE)
        rollback(SBUF("Loyalty: Could not get hook account"), 4);
    
    // Build loyalty token payment transaction
    uint8_t tx_buffer[512];
    uint32_t tx_len = 0;
    
    // Transaction Type: Payment
    tx_buffer[tx_len++] = 0x12U; // sfTransactionType
    tx_buffer[tx_len++] = 0x00U; // Payment = 0
    
    // Account (issuer - business)
    tx_buffer[tx_len++] = 0x81U; // sfAccount
    tx_buffer[tx_len++] = 0x14U; // Account size
    BUFFER_EQUAL_GUARD(business_account, HOOK_ACCOUNT_SIZE, tx_buffer + tx_len, HOOK_ACCOUNT_SIZE, 1);
    tx_len += HOOK_ACCOUNT_SIZE;
    
    // Destination (customer)
    tx_buffer[tx_len++] = 0x83U; // sfDestination
    tx_buffer[tx_len++] = 0x14U; // Account size
    BUFFER_EQUAL_GUARD(customer_account, HOOK_ACCOUNT_SIZE, tx_buffer + tx_len, HOOK_ACCOUNT_SIZE, 1);
    tx_len += HOOK_ACCOUNT_SIZE;
    
    // Amount (loyalty tokens)
    tx_buffer[tx_len++] = 0x61U; // sfAmount
    // Currency code and amount encoding would go here
    // Simplified for readability
    
    // Emit the loyalty token transaction
    uint8_t hash_out[32];
    int64_t result = emit(SBUF(hash_out), SBUF(tx_buffer));
    
    if (result < 0)
        rollback(SBUF("Loyalty: Failed to emit token transaction"), 5);
    
    // Log the loyalty issuance
    trace(SBUF("Loyalty tokens issued"), SBUF(hash_out), 1);
    
    accept(SBUF("Loyalty: Tokens issued successfully"), 0);
}
