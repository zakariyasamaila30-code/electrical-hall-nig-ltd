"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types";

export default function Dashboard({ userRole }: { userRole?: "cashier" | "inventory_accountant" }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
      })));
    }
  }, []);

  const totalRevenue = transactions.filter(t => t.type === "sale").reduce((sum, t) => sum + t.totalAmount, 0);
  const totalTransactions = transactions.length;
  
  const today = new Date();
  const todayTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return (
      transactionDate.getDate() === today.getDate() &&
      transactionDate.getMonth() === today.getMonth() &&
      transactionDate.getFullYear() === today.getFullYear()
    );
  });
  const todayRevenue = todayTransactions.filter(t => t.type === "sale").reduce((sum, t) => sum + t.totalAmount, 0);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Invema</span>
              <span>/</span>
              <span className="text-blue-600">Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold">Enterprise POS command center</h1>
            <p className="text-gray-600">Real-time sales, inventory, receivables, tenant performance, and branch activity sourced directly from your production POS schema.</p>
          </div>
          {userRole && (
            <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
              {userRole.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">SHOP</label>
            <select className="w-full p-2 border rounded-xl">
              <option>All shops</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">BRANCH</label>
            <select className="w-full p-2 border rounded-xl">
              <option>All branches</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">COST CENTER</label>
            <select className="w-full p-2 border rounded-xl">
              <option>All cost centers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">CASHIER</label>
            <select className="w-full p-2 border rounded-xl">
              <option>All cashiers</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">DATE RANGE</label>
            <input type="text" className="w-full p-2 border rounded-xl" value="2026-05-21 to 2026-06-03" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">QUICK SEARCH</label>
            <input type="text" className="w-full p-2 border rounded-xl" placeholder="Search menus, shops, products, or tickets" />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-full flex items-center gap-2 hover:bg-gray-50">
            🔄 Refresh
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-700 text-white rounded-full flex items-center gap-2">
            📥 Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-lg">Sales and profit trend</h3>
              <p className="text-sm text-gray-500">Completed revenue, recorded profit, and transaction velocity across the selected period.</p>
            </div>
            <button className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
              🔄 Revenue Analytics
            </button>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-400">
            📈 Sales Chart Placeholder
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-lg">Payment mix</h3>
              <p className="text-sm text-gray-500">How tender channels are contributing to settled sales.</p>
            </div>
            <button className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
              💳 Payments
            </button>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500 to-green-500 border-8 border-white flex items-center justify-center text-gray-400">
              🥧 Pie Chart
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold">Top products</h3>
              <p className="text-sm text-gray-500">Best moving items by quantity sold.</p>
            </div>
            <button className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
              🏷️ Product Demand
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold">Inventory movement</h3>
              <p className="text-sm text-gray-500">Incoming and outgoing stock movement across the period.</p>
            </div>
            <button className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
              📦 Stock Flow
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold">Branch comparison</h3>
              <p className="text-sm text-gray-500">Compare branch revenue and transaction concentration.</p>
            </div>
            <button className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
              🏪 Branches
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
