import { useState } from 'react'
import { QrCode, Camera } from 'lucide-react'

export function ScanPage() {
  const [scanning, setScanning] = useState(false)
  const [scannedAddress, setScannedAddress] = useState('')

  const startScan = () => {
    setScanning(true)
    // In a real app, this would use the device camera
    // For demo, simulate a scan after 2 seconds
    setTimeout(() => {
      setScannedAddress('rN7n7otQDd6FczFgLdlqtyMVrn3HfnP5gR')
      setScanning(false)
    }, 2000)
  }

  return (
    <div className="pb-20 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Scan QR Code</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-6 relative overflow-hidden">
          {scanning ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-blue-600 absolute top-1/2 animate-pulse"></div>
              <Camera className="w-16 h-16 text-gray-400" />
            </div>
          ) : (
            <QrCode className="w-24 h-24 text-gray-300" />
          )}
        </div>

        {scannedAddress ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-800 mb-2">
                ✓ Business Wallet Scanned
              </p>
              <p className="text-xs font-mono text-green-700 break-all">
                {scannedAddress}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Amount
              </label>
              <input
                type="number"
                placeholder="Enter points to request"
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Request Tokens
            </button>

            <button
              onClick={() => setScannedAddress('')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200"
            >
              Scan Again
            </button>
          </div>
        ) : (
          <button
            onClick={startScan}
            disabled={scanning}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Start Scanning'}
          </button>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">How it works</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Show your wallet QR code to the merchant</li>
          <li>Merchant scans and issues loyalty tokens</li>
          <li>Tokens appear instantly in your wallet</li>
        </ol>
      </div>
    </div>
  )
}
