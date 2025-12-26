"use client";

import { useState } from "react";
import { Wallet } from "xrpl";
import { xrplService } from "@/lib/xrpl";

export function TokenIssuance() {
  const [customerAddress, setCustomerAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleIssueTokens = async () => {
    if (!customerAddress || !amount) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Get business wallet from localStorage
      const businessData = localStorage.getItem("xrpl_business_wallet");
      if (!businessData) {
        throw new Error("Business wallet not found");
      }

      const { seed, tokenSymbol } = JSON.parse(businessData);
      const businessWallet = Wallet.fromSeed(seed);

      // Issue tokens
      await xrplService.sendToken(
        businessWallet,
        customerAddress,
        tokenSymbol,
        amount
      );

      setMessage(`Successfully issued ${amount} ${tokenSymbol} tokens!`);
      setCustomerAddress("");
      setAmount("");
    } catch (error: any) {
      console.error("Error issuing tokens:", error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Issue Loyalty Tokens</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Customer XRPL Address
          </label>
          <input
            type="text"
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="100"
            min="0"
            step="0.01"
          />
        </div>

        <button
          onClick={handleIssueTokens}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Issue Tokens"}
        </button>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes("Error") ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
