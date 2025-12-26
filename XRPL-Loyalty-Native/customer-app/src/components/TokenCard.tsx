import { Coins } from 'lucide-react'

interface TokenCardProps {
  token: {
    currency: string
    issuer: string
    balance: string
    businessName: string
  }
}

export function TokenCard({ token }: TokenCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{token.businessName}</h3>
            <p className="text-sm text-gray-500">{token.currency}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">{token.balance}</p>
          <p className="text-xs text-gray-500">points</p>
        </div>
      </div>
      <div className="pt-3 border-t flex items-center justify-between">
        <p className="text-xs text-gray-400 font-mono">
          {token.issuer.slice(0, 8)}...{token.issuer.slice(-6)}
        </p>
        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
          View Details
        </button>
      </div>
    </div>
  )
}
