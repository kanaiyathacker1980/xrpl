'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Wallet } from 'xrpl'
import { Upload, Zap } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [businessName, setBusinessName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [hookFile, setHookFile] = useState<File | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)

  const handleNext = () => {
    if (step === 1 && businessName && tokenSymbol) {
      const newWallet = Wallet.generate()
      setWallet(newWallet)
      setStep(2)
    } else if (step === 2 && wallet) {
      setStep(3)
    }
  }

  const handleDeploy = async () => {
    if (!wallet || !hookFile) return

    setIsDeploying(true)

    // In production, this would:
    // 1. Upload hook file to compiler service
    // 2. Get compiled WASM back
    // 3. Deploy to XRPL with SetHook transaction

    setTimeout(() => {
      localStorage.setItem(
        'business_data',
        JSON.stringify({
          businessName,
          tokenSymbol,
          address: wallet.address,
          seed: wallet.seed,
          hookDeployed: true,
        })
      )
      router.push('/dashboard')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            XRPL Hooks Setup
          </h1>
          <p className="text-gray-500">
            Step {step} of 3: {step === 1 ? 'Business Info' : step === 2 ? 'Wallet Created' : 'Deploy Hook'}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="My Coffee Shop"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Token Symbol (3 characters)
              </label>
              <input
                type="text"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase().slice(0, 3))}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="LYL"
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!businessName || tokenSymbol.length !== 3}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              Generate Wallet & Continue
            </button>
          </div>
        )}

        {step === 2 && wallet && (
          <div className="space-y-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                XRPL Wallet Created
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-green-700 mb-1">Address:</p>
                  <p className="font-mono text-sm text-green-900 bg-white p-2 rounded">
                    {wallet.address}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-green-700 mb-1">Secret (Save this!):</p>
                  <p className="font-mono text-sm text-green-900 bg-white p-2 rounded">
                    {wallet.seed}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              Continue to Hook Deployment
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Upload your compiled Hook WASM file
              </p>
              <input
                type="file"
                accept=".wasm"
                onChange={(e) => setHookFile(e.target.files?.[0] || null)}
                className="hidden"
                id="hook-upload"
              />
              <label
                htmlFor="hook-upload"
                className="inline-block bg-gray-100 text-gray-700 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
              >
                Choose WASM File
              </label>
              {hookFile && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {hookFile.name}
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Don't have a WASM file?</strong><br />
                Use the default loyalty_issuer.c hook or compile your own using the hooks-compiler service.
              </p>
            </div>

            <button
              onClick={handleDeploy}
              disabled={!hookFile || isDeploying}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {isDeploying ? 'Deploying Hook...' : 'Deploy Hook to XRPL'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
