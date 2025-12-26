import { useAuthStore } from '../store/authStore'
import { TokenCard } from '../components/TokenCard'
import { Wallet, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { xrplService } from '../lib/xrpl'

export function WalletPage() {
  const { walletAddress } = useAuthStore()
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [xrpBalance, setXrpBalance] = useState('0')

  useEffect(() => {
    if (walletAddress) {
      loadWalletData()
    }
  }, [walletAddress])

  const loadWalletData = async () => {
    if (!walletAddress) return
    
    setLoading(true)
    try {
      // Get XRP balance
      const accountInfo = await xrplService.getAccountInfo(walletAddress)
      setXrpBalance((parseInt(accountInfo.account_data.Balance) / 1000000).toFixed(2))

      // Get trust lines (tokens)
      const trustLines = await xrplService.getTrustLines(walletAddress)
      setTokens(trustLines.map((line: any) => ({
        currency: line.currency,
        issuer: line.account,
        balance: line.balance,
        businessName: line.currency,
      })))
    } catch (error) {
      console.error('Error loading wallet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalValue = tokens.reduce((sum, token) => sum + parseFloat(token.balance), 0)

  return (
    <div className="pb-20 px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Wallet</h1>
        <p className="text-sm text-gray-500 font-mono">
          {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm opacity-90">Total Balance</span>
          <button onClick={loadWalletData} disabled={loading} className="text-white/80 hover:text-white">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="text-4xl font-bold mb-2">{totalValue.toFixed(2)}</div>
        <div className="text-sm opacity-90">Loyalty Points</div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-xs opacity-75">XRP Balance</div>
          <div className="text-2xl font-semibold">{xrpBalance} XRP</div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Tokens</h2>
        <div className="space-y-3">
          {tokens.map((token) => (
            <TokenCard key={`${token.currency}-${token.issuer}`} token={token} />
          ))}
        </div>
      </div>

      {tokens.length === 0 && (
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tokens yet</p>
          <p className="text-sm text-gray-400 mt-2">
            Scan a QR code at a merchant to receive loyalty tokens
          </p>
        </div>
      )}
    </div>
  )
}
