import { Gift, Clock } from 'lucide-react'

export function RewardsPage() {
  // Mock rewards data
  const availableRewards = [
    {
      id: 1,
      title: 'Free Coffee',
      cost: 100,
      businessName: 'Coffee Shop',
      description: 'Any size, any flavor',
      expiresIn: '30 days',
    },
    {
      id: 2,
      title: '20% Off Pizza',
      cost: 200,
      businessName: 'Pizza Place',
      description: 'Valid on orders over $20',
      expiresIn: '45 days',
    },
    {
      id: 3,
      title: 'Free Dessert',
      cost: 50,
      businessName: 'Coffee Shop',
      description: 'Your choice of dessert',
      expiresIn: '60 days',
    },
  ]

  return (
    <div className="pb-20 px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Rewards</h1>

      <div className="space-y-4">
        {availableRewards.map((reward) => (
          <div
            key={reward.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">
                  {reward.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{reward.businessName}</p>
                <p className="text-sm text-gray-600">{reward.description}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {reward.cost} pts
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>Expires in {reward.expiresIn}</span>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                Redeem
              </button>
            </div>
          </div>
        ))}
      </div>

      {availableRewards.length === 0 && (
        <div className="text-center py-12">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No rewards available</p>
          <p className="text-sm text-gray-400 mt-2">
            Earn more points to unlock rewards
          </p>
        </div>
      )}
    </div>
  )
}
