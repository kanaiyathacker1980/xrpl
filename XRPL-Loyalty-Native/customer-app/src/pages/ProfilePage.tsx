import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Wallet as WalletIcon, Shield } from 'lucide-react'

export function ProfilePage() {
  const { walletAddress, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="pb-20 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Customer</h2>
            <p className="text-sm text-gray-500">Member since 2024</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <WalletIcon className="w-5 h-5 text-gray-600 mr-3" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Wallet Address</p>
              <p className="text-sm font-mono text-gray-800">
                {walletAddress?.slice(0, 12)}...{walletAddress?.slice(-8)}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-gray-600 mr-3" />
            <div>
              <p className="text-xs text-gray-500 mb-1">Network</p>
              <p className="text-sm font-medium text-gray-800">XRPL Testnet</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full bg-white text-gray-700 py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition">
          Transaction History
        </button>

        <button className="w-full bg-white text-gray-700 py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition">
          Settings
        </button>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 py-4 rounded-lg font-medium flex items-center justify-center hover:bg-red-100 transition"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>XRPL Loyalty Customer App</p>
        <p className="mt-1">Version 1.0.0</p>
      </div>
    </div>
  )
}
