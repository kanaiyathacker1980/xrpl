/*
 * Reward Validator Hook
 * 
 * This hook validates reward redemptions before allowing them.
 * It checks token balance, reward eligibility, and business rules.
 */

#include "hookapi.h"

#define HOOK_ACCOUNT_SIZE 20
#define REWARD_NAMESPACE "LOYALTY_REWARDS"

// Reward tier thresholds
int64_t bronze_threshold = 100000; // 100 tokens
int64_t silver_threshold = 500000; // 500 tokens
int64_t gold_threshold = 1000000;  // 1000 tokens

int64_t hook(uint32_t reserved) {
    
    _g(1,1);
    
    // Get transaction type
    uint8_t tx_type[1];
    if (otxn_type(SBUF(tx_type)) != 1)
        rollback(SBUF("Reward: Could not get transaction type"), 1);
    
    // Check if this is a reward redemption (check Memo field)
    uint8_t memo_buffer[256];
    int64_t memo_len = otxn_field(SBUF(memo_buffer), sfMemo);
    
    if (memo_len < 0)
        accept(SBUF("Reward: No memo, skipping validation"), 0);
    
    // Check if memo contains "REDEEM_REWARD"
    uint8_t redeem_marker[] = "REDEEM_REWARD";
    if (memo_len < sizeof(redeem_marker))
        accept(SBUF("Reward: Not a redemption"), 0);
    
    // Get customer account
    uint8_t customer_account[HOOK_ACCOUNT_SIZE];
    if (otxn_field(SBUF(customer_account), sfAccount) != HOOK_ACCOUNT_SIZE)
        rollback(SBUF("Reward: Could not get customer account"), 2);
    
    // Get customer's token balance from state
    uint8_t balance_key[32];
    util_sha512h(SBUF(balance_key), SBUF(customer_account));
    
    uint8_t balance_buffer[8];
    int64_t balance_len = state(SBUF(balance_buffer), SBUF(balance_key));
    
    if (balance_len < 0)
        rollback(SBUF("Reward: Customer has no token balance"), 3);
    
    // Convert balance to int64
    int64_t customer_balance = *(int64_t*)balance_buffer;
    
    // Get reward cost from memo
    // In production, this would parse the memo for reward ID and cost
    int64_t reward_cost = 100000; // Example: 100 tokens
    
    // Validate sufficient balance
    if (customer_balance < reward_cost)
        rollback(SBUF("Reward: Insufficient token balance"), 4);
    
    // Determine customer tier
    uint8_t tier_message[32];
    if (customer_balance >= gold_threshold) {
        BUFFER_EQUAL_GUARD("Gold Tier Customer", 18, tier_message, 32, 1);
        // Gold customers get 20% discount
        reward_cost = reward_cost * 80 / 100;
    } else if (customer_balance >= silver_threshold) {
        BUFFER_EQUAL_GUARD("Silver Tier Customer", 20, tier_message, 32, 1);
        // Silver customers get 10% discount
        reward_cost = reward_cost * 90 / 100;
    } else if (customer_balance >= bronze_threshold) {
        BUFFER_EQUAL_GUARD("Bronze Tier Customer", 20, tier_message, 32, 1);
        // Bronze customers get 5% discount
        reward_cost = reward_cost * 95 / 100;
    } else {
        BUFFER_EQUAL_GUARD("Standard Customer", 17, tier_message, 32, 1);
    }
    
    trace(SBUF("Reward validation"), SBUF(tier_message), 1);
    
    // Update customer balance (deduct reward cost)
    int64_t new_balance = customer_balance - reward_cost;
    *(int64_t*)balance_buffer = new_balance;
    
    if (state_set(SBUF(balance_buffer), SBUF(balance_key)) < 0)
        rollback(SBUF("Reward: Could not update balance"), 5);
    
    // Log the reward redemption
    trace(SBUF("Reward redeemed successfully"), SBUF(balance_key), 1);
    
    accept(SBUF("Reward: Validation successful"), 0);
}
