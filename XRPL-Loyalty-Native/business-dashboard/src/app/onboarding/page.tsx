"use client";

import { useState } from "use";
import { useRouter } from "next/navigation";
import { Wallet } from "xrpl";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("LYL");
  const [wallet, setWallet] = useState<any>(null);

  const generateWallet = () => {
    const newWallet = Wallet.generate();
    setWallet(newWallet);
    setStep(2);
  };

  const completeSetup = () => {
    if (wallet) {
      localStorage.setItem("xrpl_business_wallet", JSON.stringify({
        address: wallet.address,
        seed: wallet.seed,
        businessName,
        tokenSymbol,
      }));
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-6">Setup Your Loyalty Program</h1>
        
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="My Coffee Shop"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Token Symbol (3 chars)</label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase().slice(0, 3))}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="LYL"
                maxLength={3}
              />
            </div>

            <button
              onClick={generateWallet}
              disabled={!businessName || tokenSymbol.length !== 3}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Generate XRPL Wallet
            </button>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This will generate a new XRPL wallet for your business. 
                Make sure to save your seed phrase securely!
              </p>
            </div>
          </div>
        )}

        {step === 2 && wallet && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold mb-2">✅ Wallet Generated!</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Address:</strong>
                  <p className="font-mono bg-white p-2 rounded mt-1 break-all">{wallet.address}</p>
                </div>
                <div>
                  <strong>Seed (Secret Key):</strong>
                  <p className="font-mono bg-white p-2 rounded mt-1 break-all text-red-600">{wallet.seed}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>⚠️ Important:</strong> Save your seed phrase in a secure location. 
                You'll need it to access your wallet. Never share it with anyone!
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Fund your wallet with XRP from the <a href="https://xrpl.org/xrp-testnet-faucet.html" target="_blank" className="text-blue-600 underline">XRPL Testnet Faucet</a></li>
                <li>Complete the setup to start issuing loyalty tokens</li>
              </ol>
            </div>

            <button
              onClick={completeSetup}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Complete Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
