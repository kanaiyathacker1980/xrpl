import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet } from 'xrpl'
import { useAuthStore } from '../store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [seed, setSeed] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    try {
      const wallet = Wallet.fromSeed(seed)
      login(wallet.address, seed)
      navigate('/wallet')
    } catch (err) {
      setError('Invalid seed phrase. Please check and try again.')
    }
  }

  const handleCreateWallet = () => {
    const newWallet = Wallet.generate()
    login(newWallet.address, newWallet.seed)
    navigate('/wallet')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            XRPL Loyalty
          </h1>
          <p className="text-gray-500">Your rewards on the blockchain</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Seed (Secret)
            </label>
            <input
              type="password"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="sXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login with Existing Wallet
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={handleCreateWallet}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Create New Wallet
          </button>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> Create a new wallet to start. For testnet,
              fund it at{' '}
              <a
                href="https://xrpl.org/xrp-testnet-faucet.html"
                target="_blank"
                className="underline"
              >
                XRPL Faucet
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
