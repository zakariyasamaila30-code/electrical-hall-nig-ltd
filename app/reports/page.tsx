"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types";

export default function ReportsPage({ userRole }: { userRole?: "cashier" | "inventory_accountant" }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>("sales");

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
            <h1 className="text-xl font-bold">Sales Reports</h1>
            <p className="text-gray-500">Revenue analytics, profit tracking, expenses and business intelligence</p>
          </div>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2">
            📈 Revenue Intelligence
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Year</label>
            <select className="w-full p-3 border rounded-2xl">
              <option>2026</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Month</label>
            <select className="w-full p-3 border rounded-2xl">
              <option>June</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Payment Method</label>
            <select className="w-full p-3 border rounded-2xl">
              <option>All Payment Methods</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Cost Center</label>
            <select className="w-full p-3 border rounded-2xl">
              <option>All Cost Centers</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold flex items-center gap-2">
            🔍 Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl">
            🎥
          </div>
          <div>
            <div className="text-sm text-gray-600">Revenue</div>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl">
            📈
          </div>
          <div>
            <div className="text-sm text-gray-600">Profit</div>
            <div className="text-2xl font-bold">₦0.00</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center text-white text-2xl">
            🗂️
          </div>
          <div>
            <div className="text-sm text-gray-600">Expenses</div>
            <div className="text-2xl font-bold">₦0.00</div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white text-2xl">
            📑
          </div>
          <div>
            <div className="text-sm text-gray-600">Unpaid</div>
            <div className="text-2xl font-bold">₦0.00</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("sales")}
          className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 ${
            activeTab === "sales"
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
              : "border text-gray-600"
          }`}
        >
          🗓️ Monthly Report
        </button>
        <button
          onClick={() => setActiveTab("yearly")}
          className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 ${
            activeTab === "yearly"
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
              : "border text-gray-600"
          }`}
        >
          📊 Yearly Report
        </button>
      </div>
    </div>
  );
}
