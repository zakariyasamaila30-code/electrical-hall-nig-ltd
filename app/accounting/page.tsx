"use client";

import { useState, useEffect } from "react";
import { Supplier, SupplierTransaction } from "@/types";

const defaultSuppliers: Supplier[] = [];
const defaultSupplierTransactions: SupplierTransaction[] = [];

export default function AccountingDashboard() {
  const [activeTab, setActiveTab] = useState<"suppliers" | "ledger" | "statements">("suppliers");

  // Suppliers state
  const [suppliers, setSuppliers] = useState<Supplier[]>(defaultSuppliers);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState<Omit<Supplier, "id" | "createdAt">>({
    name: "",
    email: "",
    phone: "",
    address: "",
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: ""
  });

  // Supplier transactions state
  const [supplierTransactions, setSupplierTransactions] = useState<SupplierTransaction[]>(defaultSupplierTransactions);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState<Omit<SupplierTransaction, "id" | "createdAt">>({
    supplierId: "",
    type: "credit",
    amount: 0,
    description: "",
    referenceNumber: "",
    date: new Date()
  });

  // Load data from localStorage
  useEffect(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    const savedTransactions = localStorage.getItem("supplierTransactions");
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers).map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt)
      })));
    }
    if (savedTransactions) {
      setSupplierTransactions(JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt)
      })));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem("supplierTransactions", JSON.stringify(supplierTransactions));
  }, [supplierTransactions]);

  // CRUD for suppliers
  const addSupplier = () => {
    if (!newSupplier.name || !newSupplier.phone) {
      alert("Supplier name and phone are required!");
      return;
    }
    const supplier: Supplier = {
      ...newSupplier,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setSuppliers([...suppliers, supplier]);
    setNewSupplier({
      name: "",
      email: "",
      phone: "",
      address: "",
      bankName: "",
      bankAccountNumber: "",
      bankAccountName: ""
    });
    setShowAddSupplier(false);
    alert("Supplier added successfully!");
  };

  const updateSupplier = () => {
    if (!editingSupplier) return;
    setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, ...newSupplier } : s));
    setEditingSupplier(null);
    setNewSupplier({
      name: "",
      email: "",
      phone: "",
      address: "",
      bankName: "",
      bankAccountNumber: "",
      bankAccountName: ""
    });
    setShowAddSupplier(false);
    alert("Supplier updated successfully!");
  };

  const deleteSupplier = (supplierId: string) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers(suppliers.filter(s => s.id !== supplierId));
      setSupplierTransactions(supplierTransactions.filter(t => t.supplierId !== supplierId));
    }
  };

  // CRUD for supplier transactions
  const addTransaction = () => {
    if (!newTransaction.supplierId || !newTransaction.amount || !newTransaction.description) {
      alert("Please fill in all required fields!");
      return;
    }
    const transaction: SupplierTransaction = {
      ...newTransaction,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setSupplierTransactions([...supplierTransactions, transaction]);
    setNewTransaction({
      supplierId: selectedSupplier || "",
      type: "credit",
      amount: 0,
      description: "",
      referenceNumber: "",
      date: new Date()
    });
    setShowAddTransaction(false);
    alert("Transaction added successfully!");
  };

  // Calculate supplier balance
  const getSupplierBalance = (supplierId: string) => {
    return supplierTransactions
      .filter(t => t.supplierId === supplierId)
      .reduce((acc, t) => t.type === "credit" ? acc + t.amount : acc - t.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Accounting Dashboard</h1>
        <p className="text-gray-600">Manage suppliers, ledgers, and bank statements</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("suppliers")}
          className={`px-4 py-2 -mb-px border-b-2 font-medium ${
            activeTab === "suppliers"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📦 Suppliers
        </button>
        <button
          onClick={() => setActiveTab("ledger")}
          className={`px-4 py-2 -mb-px border-b-2 font-medium ${
            activeTab === "ledger"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          📊 Payable Ledger
        </button>
        <button
          onClick={() => setActiveTab("statements")}
          className={`px-4 py-2 -mb-px border-b-2 font-medium ${
            activeTab === "statements"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          🏦 Bank Statements
        </button>
      </div>

      {/* Suppliers Tab */}
      {activeTab === "suppliers" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Suppliers</h2>
            <button
              onClick={() => setShowAddSupplier(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
            >
              ➕ Add Supplier
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-3">{supplier.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📞 {supplier.phone}</p>
                  <p>✉️ {supplier.email}</p>
                  <p>📍 {supplier.address}</p>
                  <p>🏦 {supplier.bankName} - {supplier.bankAccountNumber}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium">
                    Balance: <span className={`text-lg font-bold ${getSupplierBalance(supplier.id) >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ₦{getSupplierBalance(supplier.id).toLocaleString()}
                    </span>
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingSupplier(supplier);
                      setNewSupplier(supplier);
                      setShowAddSupplier(true);
                    }}
                    className="flex-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => deleteSupplier(supplier.id)}
                    className="flex-1 px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payable Ledger Tab */}
      {activeTab === "ledger" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold">Supplier Payable Ledger</h2>
            </div>
            <div className="flex gap-3">
              <select
                value={selectedSupplier || ""}
                onChange={(e) => setSelectedSupplier(e.target.value || null)}
                className="px-4 py-2 border rounded-xl"
              >
                <option value="">All Suppliers</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (!selectedSupplier) {
                    alert("Please select a supplier first!");
                    return;
                  }
                  setNewTransaction({
                    supplierId: selectedSupplier,
                    type: "credit",
                    amount: 0,
                    description: "",
                    referenceNumber: "",
                    date: new Date()
                  });
                  setShowAddTransaction(true);
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2"
              >
                ➕ Add Transaction
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Supplier</th>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Ref No.</th>
                  <th className="p-4 text-right">Debit (₦)</th>
                  <th className="p-4 text-right">Credit (₦)</th>
                  <th className="p-4 text-right">Balance (₦)</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  let runningBalance = 0;
                  const filteredTransactions = supplierTransactions
                    .filter(t => !selectedSupplier || t.supplierId === selectedSupplier)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                  return filteredTransactions.map(transaction => {
                    const supplier = suppliers.find(s => s.id === transaction.supplierId);
                    if (transaction.type === "credit") {
                      runningBalance += transaction.amount;
                    } else {
                      runningBalance -= transaction.amount;
                    }
                    return (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{new Date(transaction.date).toLocaleDateString()}</td>
                        <td className="p-4 font-medium">{supplier?.name || "Unknown"}</td>
                        <td className="p-4">{transaction.description}</td>
                        <td className="p-4 text-gray-500">{transaction.referenceNumber || "-"}</td>
                        <td className="p-4 text-right text-red-600 font-medium">
                          {transaction.type === "debit" ? transaction.amount.toLocaleString() : "-"}
                        </td>
                        <td className="p-4 text-right text-green-600 font-medium">
                          {transaction.type === "credit" ? transaction.amount.toLocaleString() : "-"}
                        </td>
                        <td className={`p-4 text-right font-bold ${runningBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {runningBalance.toLocaleString()}
                        </td>
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bank Statements Tab */}
      {activeTab === "statements" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Supplier Bank Statements</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">Select Supplier</label>
              <select
                value={selectedSupplier || ""}
                onChange={(e) => setSelectedSupplier(e.target.value || null)}
                className="w-full max-w-md px-4 py-2 border rounded-xl"
              >
                <option value="">-- Select a supplier --</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {selectedSupplier && (() => {
              const supplier = suppliers.find(s => s.id === selectedSupplier);
              const supplierTransactionsForStatement = supplierTransactions
                .filter(t => t.supplierId === selectedSupplier)
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

              if (!supplier) return null;

              return (
                <div className="border rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{supplier.name}</h3>
                      <p className="opacity-90">Bank Statement</p>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 border-b">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Account Name</p>
                        <p className="font-medium">{supplier.bankAccountName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Account No.</p>
                        <p className="font-medium">{supplier.bankAccountNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Bank</p>
                        <p className="font-medium">{supplier.bankName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Current Balance</p>
                        <p className={`font-bold text-lg ${getSupplierBalance(selectedSupplier) >= 0 ? "text-green-600" : "text-red-600"}`}>
                          ₦{getSupplierBalance(selectedSupplier).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-100">
                        <tr>
                          <th className="p-4 text-left text-sm font-semibold">Date</th>
                          <th className="p-4 text-left text-sm font-semibold">Description</th>
                          <th className="p-4 text-left text-sm font-semibold">Ref</th>
                          <th className="p-4 text-right text-sm font-semibold">Debit (₦)</th>
                          <th className="p-4 text-right text-sm font-semibold">Credit (₦)</th>
                          <th className="p-4 text-right text-sm font-semibold">Balance (₦)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          let balance = 0;
                          return supplierTransactionsForStatement.map(transaction => {
                            if (transaction.type === "credit") {
                              balance += transaction.amount;
                            } else {
                              balance -= transaction.amount;
                            }
                            return (
                              <tr key={transaction.id} className="border-t hover:bg-gray-50">
                                <td className="p-4">{new Date(transaction.date).toLocaleDateString()}</td>
                                <td className="p-4">{transaction.description}</td>
                                <td className="p-4 text-gray-500">{transaction.referenceNumber || "-"}</td>
                                <td className="p-4 text-right text-red-600">
                                  {transaction.type === "debit" ? transaction.amount.toLocaleString() : "-"}
                                </td>
                                <td className="p-4 text-right text-green-600">
                                  {transaction.type === "credit" ? transaction.amount.toLocaleString() : "-"}
                                </td>
                                <td className={`p-4 text-right font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                                  ₦{balance.toLocaleString()}
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplier && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-6">
              {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Supplier Name *</label>
                <input
                  type="text"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                <textarea
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                  rows={2}
                  placeholder="Enter address"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={newSupplier.bankName}
                    onChange={(e) => setNewSupplier({ ...newSupplier, bankName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl"
                    placeholder="Bank"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Account No.</label>
                  <input
                    type="text"
                    value={newSupplier.bankAccountNumber}
                    onChange={(e) => setNewSupplier({ ...newSupplier, bankAccountNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl"
                    placeholder="Account No"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Account Name</label>
                  <input
                    type="text"
                    value={newSupplier.bankAccountName}
                    onChange={(e) => setNewSupplier({ ...newSupplier, bankAccountName: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl"
                    placeholder="Account Name"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingSupplier ? updateSupplier : addSupplier}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
                >
                  {editingSupplier ? "Update" : "Add Supplier"}
                </button>
                <button
                  onClick={() => {
                    setShowAddSupplier(false);
                    setEditingSupplier(null);
                    setNewSupplier({
                      name: "",
                      email: "",
                      phone: "",
                      address: "",
                      bankName: "",
                      bankAccountNumber: "",
                      bankAccountName: ""
                    });
                  }}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full">
            <h3 className="text-xl font-bold mb-6">Add Transaction</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Supplier</label>
                <select
                  value={newTransaction.supplierId}
                  onChange={(e) => setNewTransaction({ ...newTransaction, supplierId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  <option value="">Select supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Type</label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as "debit" | "credit" })}
                  className="w-full px-4 py-2 border rounded-xl"
                >
                  <option value="credit">Credit (We owe supplier)</option>
                  <option value="debit">Debit (We paid supplier)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Amount (₦)</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-xl"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
                <textarea
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl"
                  rows={2}
                  placeholder="Enter description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Reference Number</label>
                  <input
                    type="text"
                    value={newTransaction.referenceNumber}
                    onChange={(e) => setNewTransaction({ ...newTransaction, referenceNumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl"
                    placeholder="Ref No"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Date</label>
                  <input
                    type="date"
                    value={newTransaction.date.toISOString().split('T')[0]}
                    onChange={(e) => setNewTransaction({ ...newTransaction, date: new Date(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={addTransaction}
                  className="flex-1 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium"
                >
                  Add Transaction
                </button>
                <button
                  onClick={() => {
                    setShowAddTransaction(false);
                  }}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
