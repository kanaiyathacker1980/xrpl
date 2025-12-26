"use client";

import { useEffect, useState } from "react";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { TokenIssuance } from "@/components/dashboard/TokenIssuance";
import { CustomersTable } from "@/components/dashboard/CustomersTable";
import { QRCodeGenerator } from "@/components/dashboard/QRCodeGenerator";

export default function DashboardPage() {
  const [businessData, setBusinessData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("xrpl_business_wallet");
    if (data) {
      setBusinessData(JSON.parse(data));
    }
  }, []);

  if (!businessData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{businessData.businessName} - Loyalty Dashboard</h1>
          <p className="text-sm text-gray-500">Token: {businessData.tokenSymbol}</p>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <StatsOverview />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TokenIssuance />
          <QRCodeGenerator />
        </div>

        <CustomersTable />
      </main>
    </div>
  );
}
