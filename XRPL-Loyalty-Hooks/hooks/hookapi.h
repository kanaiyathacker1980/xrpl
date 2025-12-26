/*
 * XRPL Hooks API Header
 * 
 * This header provides function definitions for interacting with the XRPL Hooks environment.
 * In production, use the official hookapi.h from XRPL Hooks SDK.
 */

#ifndef HOOKAPI_H
#define HOOKAPI_H

#include <stdint.h>

// Hook return codes
#define accept(msg, msg_len, code) return (code)
#define rollback(msg, msg_len, code) return -(code)

// Transaction field IDs
#define sfTransactionType 0x12U
#define sfAccount 0x81U
#define sfDestination 0x83U
#define sfAmount 0x61U
#define sfMemo 0xF9U

// Guard macro for buffer operations
#define BUFFER_EQUAL_GUARD(buf1, len1, buf2, len2, guard) \
    if (len1 != len2) rollback("Buffer size mismatch", 21, guard); \
    for (int i = 0; i < len1; i++) buf2[i] = buf1[i];

// Guard against infinite loops
#define _g(x, y) // Simplified for demo

// Slot operations
#define SBUF(x) x, sizeof(x)

// Hook API functions (simplified signatures)
extern int64_t otxn_type(uint8_t* buf, uint32_t buf_len);
extern int64_t otxn_field(uint8_t* buf, uint32_t buf_len, uint32_t field_id);
extern int64_t hook_account(uint8_t* buf, uint32_t buf_len);
extern int64_t emit(uint8_t* hash_out, uint32_t hash_len, uint8_t* tx, uint32_t tx_len);
extern int64_t trace(uint8_t* msg, uint32_t msg_len, uint8_t* data, uint32_t data_len, uint32_t as_hex);
extern int64_t state(uint8_t* buf, uint32_t buf_len, uint8_t* key, uint32_t key_len);
extern int64_t state_set(uint8_t* data, uint32_t data_len, uint8_t* key, uint32_t key_len);
extern int64_t slot_set(uint8_t* data, uint32_t data_len, uint32_t slot);
extern int64_t slot_float(uint32_t slot);
extern int64_t util_sha512h(uint8_t* out, uint32_t out_len, uint8_t* in, uint32_t in_len);

#endif // HOOKAPI_H
