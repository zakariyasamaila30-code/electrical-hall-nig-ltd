"use client";

import { useState, useEffect } from "react";
import { Item, CartItem, Transaction } from "@/types";

const sampleProducts: Item[] = [
  { id: "1", name: "1.5mm Cable (Roll)", price: 15000, category: "Cables", quantity: 50, sku: "CAB-001" },
  { id: "2", name: "2.5mm Cable (Roll)", price: 22000, category: "Cables", quantity: 35, sku: "CAB-002" },
  { id: "3", name: "4mm Cable (Roll)", price: 35000, category: "Cables", quantity: 25, sku: "CAB-003" },
  { id: "4", name: "LED Bulb 10W", price: 500, category: "Bulbs", quantity: 200, sku: "BLB-001" },
  { id: "5", name: "Socket 13A", price: 800, category: "Accessories", quantity: 150, sku: "ACC-001" },
];

export default function ProcurementPage() {
  const [products, setProducts] = useState<Item[]>(sampleProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [supplierName, setSupplierName] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [isTaxable, setIsTaxable] = useState<boolean>(false);
  const [taxRate, setTaxRate] = useState<number>(7.5);
  const [paymentMethod, setPaymentMethod] = useState<string>("Bank Transfer");
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

  const addToCart = (product: Item) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, change: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === productId ? { ...item, cartQuantity: item.cartQuantity + change } : item
        )
        .filter(item => item.cartQuantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const taxAmount = isTaxable ? subtotal * (taxRate / 100) : 0;
  const totalAmount = subtotal + taxAmount;

  const postInvoice = () => {
    if (cart.length === 0) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date(),
      customerName: supplierName,
      items: cart,
      totalAmount,
      paymentMethod,
      type: "purchase",
      isTaxable,
      taxAmount
    };

    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    setCart([]);
    setSupplierName("");
    setInvoiceNumber("");
    alert("Invoice posted successfully!");
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Invema</span>
          <span>/</span>
          <span className="text-blue-600">Procurement</span>
        </div>
        <h1 className="text-2xl font-bold">📝 Post Purchase Invoice</h1>
        <p className="text-gray-600">Record purchases from suppliers and manage taxable invoices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Supplier Name</label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full p-3 border rounded-xl"
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full p-3 border rounded-xl"
                    placeholder="Enter invoice number"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="taxable"
                    checked={isTaxable}
                    onChange={(e) => setIsTaxable(e.target.checked)}
                    className="w-5 h-5"
                  />
                  <label htmlFor="taxable" className="font-medium">Taxable Invoice</label>
                </div>
                {isTaxable && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">Tax Rate:</label>
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="p-2 border rounded-lg"
                    >
                      <option value={5}>5%</option>
                      <option value={7.5}>7.5%</option>
                      <option value={10}>10%</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4">Add Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="border rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => addToCart(product)}
                >
                  <h4 className="font-bold text-sm">{product.name}</h4>
                  <div className="text-sm text-gray-500">{product.category}</div>
                  <div className="text-lg font-bold text-blue-700 mt-2">
                    ₦{product.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">📦 Invoice Items</h2>
            </div>

            <div className="p-4">
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No items added yet
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-xl">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          ₦{item.price.toLocaleString()} x {item.cartQuantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          -
                        </button>
                        <span className="font-bold w-6 text-center">{item.cartQuantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t pt-4">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                    </div>
                    {isTaxable && (
                      <div className="flex justify-between text-blue-700">
                        <span>Tax ({taxRate}%):</span>
                        <span className="font-medium">₦{taxAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>₦{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-3 border rounded-xl"
                    >
                      <option>Bank Transfer</option>
                      <option>Cash</option>
                      <option>Cheque</option>
                    </select>
                  </div>

                  <button
                    onClick={postInvoice}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold text-lg"
                  >
                    Post Invoice
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Purchase Invoices</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700 text-white">
              <tr>
                <th className="p-3 text-left rounded-tl-xl">Date</th>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Invoice #</th>
                <th className="p-3 text-left">Taxable</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions
                .filter(t => t.type === "purchase")
                .slice(-5)
                .reverse()
                .map(transaction => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{new Date(transaction.date).toLocaleString()}</td>
                    <td className="p-3">{transaction.customerName || "-"}</td>
                    <td className="p-3">#{transaction.id}</td>
                    <td className="p-3">
                      {transaction.isTaxable ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">Yes</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">No</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-bold text-green-700">
                      ₦{transaction.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
