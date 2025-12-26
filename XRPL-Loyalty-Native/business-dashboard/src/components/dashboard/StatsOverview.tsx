"use client";

import { Users, Coins, TrendingUp, Award } from "lucide-react";

export function StatsOverview() {
  // Mock data - replace with actual XRPL data
  const stats = [
    {
      label: "Total Customers",
      value: "1,234",
      icon: Users,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      label: "Tokens Issued",
      value: "45,678",
      icon: Coins,
      change: "+23%",
      changeType: "positive" as const,
    },
    {
      label: "Active Users",
      value: "892",
      icon: TrendingUp,
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      label: "Rewards Redeemed",
      value: "3,456",
      icon: Award,
      change: "+15%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className={`text-sm mt-1 ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
