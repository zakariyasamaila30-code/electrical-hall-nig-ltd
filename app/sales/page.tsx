"use client";

import { useState, useEffect } from "react";
import { Item, CartItem, Transaction, User } from "@/types";
import Receipt from "../components/Receipt";

const sampleProducts: Item[] = [
  { id: "1", name: "1.5mm Cable", price: 15000, category: "Cables", quantity: 50, sku: "CAB-001", unit: "Roll" },
  { id: "2", name: "2.5mm Cable", price: 22000, category: "Cables", quantity: 35, sku: "CAB-002", unit: "Roll" },
  { id: "3", name: "4mm Cable", price: 35000, category: "Cables", quantity: 25, sku: "CAB-003", unit: "Roll" },
  { id: "4", name: "LED Bulb 10W", price: 500, category: "Bulbs", quantity: 200, sku: "BLB-001", unit: "Piece" },
  { id: "5", name: "Socket 13A", price: 800, category: "Accessories", quantity: 150, sku: "ACC-001", unit: "Piece" },
];

export default function SalesPage() {
  const [products, setProducts] = useState<Item[]>(sampleProducts);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    const savedTransactions = localStorage.getItem("transactions");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions).map((t: any) => ({
        ...t,
        date: new Date(t.date),
      })));
    }

    // Get current user from localStorage
    const savedCurrentUser = localStorage.getItem("currentUser");
    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      setUserRole(user.roleId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

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

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

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

    // Update product quantities
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(c => c.id === p.id);
      if (cartItem) {
        return { ...p, quantity: p.quantity - cartItem.cartQuantity };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setCurrentTransaction(transaction);
    setShowReceipt(true);

    setCart([]);
    setCustomerName("");
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Invema</span>
          <span>/</span>
          <span className="text-blue-600">Dashboard</span>
        </div>
        <h1 className="text-xl font-bold">📝 Create Sales Invoice</h1>
        <p className="text-gray-600">Departmental billing & inventory invoice management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex gap-4 mb-6">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-xl font-medium">
                Main Store
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Search product name..."
                className="w-full p-3 border rounded-xl"
              />
            </div>

            <div className="mb-4 flex gap-3">
              <button className="px-4 py-2 border rounded-xl">
                Search category
              </button>
              <button className="px-4 py-2 border rounded-xl">
                Cables
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="border rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all"
                  onClick={() => addToCart(product)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm">{product.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${product.quantity > 20 ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                      {product.quantity > 20 ? "In Stock" : "Low Stock"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                  <div className="text-xs text-gray-600 mb-2">
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{product.unit}</span>
                  </div>
                  <div className="text-lg font-bold text-green-700">
                    ₦{product.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                🛒 Order Listing
              </h2>
              <button className="p-1 rounded hover:bg-white/20" onClick={() => setCart([])}>✕</button>
            </div>

            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search product name..."
                  className="flex-1 p-2 border rounded-lg"
                />
                <button className="p-2 bg-red-500 text-white rounded-lg">🔴</button>
                <button className="p-2 bg-blue-500 text-white rounded-lg">📦</button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-bold text-red-600">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm">Search for products above to begin a transaction</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-xl">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          <span className="px-1 py-0.5 bg-gray-100 rounded text-xs mr-1">{item.unit}</span>
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
                          className="w-8 h-8 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
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
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Total:</span>
                    <span className="text-2xl font-bold text-green-700">
                      ₦{totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      placeholder="Customer Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-3 border rounded-xl"
                    />
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-3 border rounded-xl"
                    >
                      <option>Cash</option>
                      <option>POS</option>
                      <option>Transfer</option>
                    </select>
                  </div>

                  <button
                    onClick={checkout}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold text-lg"
                  >
                    Complete Payment
                  </button>
                </div>
              )}
            </div>
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
