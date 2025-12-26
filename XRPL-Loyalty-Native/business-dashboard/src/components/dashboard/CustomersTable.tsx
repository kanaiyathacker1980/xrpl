"use client";

import { useState } from "react";

export function CustomersTable() {
  // Mock data - replace with actual XRPL data
  const [customers] = useState([
    {
      address: "rN7n7otQDd6FczFgLdlqtyMVrn3HfnP5gR",
      balance: "450.50",
      lastActivity: "2 hours ago",
      totalTransactions: 23,
    },
    {
      address: "rLHzPsX6oXkzU9fKKKxTiUYe2P8NP3jmHD",
      balance: "892.75",
      lastActivity: "5 hours ago",
      totalTransactions: 45,
    },
    {
      address: "rPEPPER7kfTD9w2To4CQk6UCfuHM9c6GDY",
      balance: "120.00",
      lastActivity: "1 day ago",
      totalTransactions: 12,
    },
  ]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold">Recent Customers</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Balance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Last Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Transactions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.map((customer) => (
              <tr key={customer.address} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm">
                  {customer.address.slice(0, 8)}...{customer.address.slice(-6)}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  {customer.balance} LYL
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {customer.lastActivity}
                </td>
                <td className="px-6 py-4 text-sm">
                  {customer.totalTransactions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
