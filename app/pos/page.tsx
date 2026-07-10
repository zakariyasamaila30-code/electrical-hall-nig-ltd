"use client";

import { useState, useEffect } from "react";
import { Item, CartItem, Transaction } from "@/types";
import Receipt from "./receipt";

const sampleItems: Item[] = [
  { id: "1", name: "1.5mm Cable (Roll)", price: 15000, category: "Cables", quantity: 100, unit: "Roll" },
  { id: "2", name: "2.5mm Cable (Roll)", price: 22000, category: "Cables", quantity: 100, unit: "Roll" },
  { id: "3", name: "4mm Cable (Roll)", price: 35000, category: "Cables", quantity: 100, unit: "Roll" },
  { id: "4", name: "6mm Cable (Roll)", price: 55000, category: "Cables", quantity: 100, unit: "Roll" },
  { id: "5", name: "10mm Cable (Roll)", price: 85000, category: "Cables", quantity: 100, unit: "Roll" },
  { id: "6", name: "16mm Cable (Roll)", price: 125000, category: "Cables", quantity: 100, unit: "Roll" },
  { id: "7", name: "Bulb (LED 10W)", price: 500, category: "Bulbs", quantity: 100, unit: "Piece" },
  { id: "8", name: "Socket (13A)", price: 800, category: "Accessories", quantity: 100, unit: "Piece" },
  { id: "9", name: "Switch (1 Gang)", price: 600, category: "Accessories", quantity: 100, unit: "Piece" },
  { id: "10", name: "Extension Box (4 Way)", price: 2500, category: "Accessories", quantity: 100, unit: "Piece" },
];

export default function POSDashboard() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
      })));
    }
  }, []);

  const addToCart = (item: Item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i
        );
      }
      return [...prev, { ...item, cartQuantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, cartQuantity: i.cartQuantity + change } : i
        )
        .filter((i) => i.cartQuantity > 0)
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

  const checkout = () => {
    if (cart.length === 0) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date(),
      customerName,
      items: cart,
      totalAmount,
      paymentMethod,
      type: "sale"
    };

    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

    setCurrentTransaction(transaction);
    setShowReceipt(true);

    setCart([]);
    setCustomerName("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sampleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => addToCart(item)}
                className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-left"
              >
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-600">{item.category}</div>
                <div className="text-green-700 font-bold mt-1">
                  ₦{item.price.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-4 sticky top-4">
          <h2 className="text-xl font-bold mb-4">Cart</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter customer name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option>Cash</option>
              <option>Transfer</option>
              <option>Card</option>
            </select>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Cart is empty</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      ₦{item.price.toLocaleString()} x {item.cartQuantity}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{item.cartQuantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₦{totalAmount.toLocaleString()}</span>
            </div>
            <button
              onClick={checkout}
              disabled={cart.length === 0}
              className="w-full mt-4 bg-blue-800 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {showReceipt && currentTransaction && (
        <Receipt
          transaction={currentTransaction}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}
