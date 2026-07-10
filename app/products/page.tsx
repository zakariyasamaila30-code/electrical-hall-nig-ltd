"use client";

import { useState, useEffect } from "react";
import { Item, User } from "@/types";

const sampleProducts: Item[] = [
  { id: "1", name: "1.5mm Cable", price: 15000, category: "Cables", quantity: 50, sku: "CAB-001", unit: "Roll" },
  { id: "2", name: "2.5mm Cable", price: 22000, category: "Cables", quantity: 35, sku: "CAB-002", unit: "Roll" },
  { id: "3", name: "4mm Cable", price: 35000, category: "Cables", quantity: 25, sku: "CAB-003", unit: "Roll" },
  { id: "4", name: "LED Bulb 10W", price: 500, category: "Bulbs", quantity: 200, sku: "BLB-001", unit: "Piece" },
  { id: "5", name: "Socket 13A", price: 800, category: "Accessories", quantity: 150, sku: "ACC-001", unit: "Piece" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Item[]>(sampleProducts);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("manage");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Item | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Item, "id">>({
    name: "",
    price: 0,
    category: "",
    quantity: 0,
    sku: "",
    unit: "Piece"
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
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

  const openAddModal = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      price: 0,
      category: "",
      quantity: 0,
      sku: "",
      unit: "Piece"
    });
    setShowModal(true);
  };

  const openEditModal = (product: Item) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: product.quantity,
      sku: product.sku || "",
      unit: product.unit
    });
    setShowModal(true);
  };

  const saveProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.unit) return;

    if (editingProduct) {
      // Edit existing product
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id ? { ...p, ...newProduct } : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const product: Item = {
        ...newProduct,
        id: Date.now().toString()
      };
      setProducts([...products, product]);
    }
    setShowModal(false);
  };

  const deleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

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
            <h1 className="text-xl font-bold">Product Management</h1>
          </div>
          <div>Exelsor Shops</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex gap-4 mb-6 border-b pb-4">
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              activeTab === "manage"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>🕐</span> Manage
          </button>
          <button
            onClick={() => setActiveTab("restock")}
            className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              activeTab === "restock"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>🎒</span> Restock
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              activeTab === "sales"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>🔍</span> Sales
          </button>
          <button
            onClick={() => setActiveTab("expiry")}
            className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              activeTab === "expiry"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>☑️</span> Expiry
          </button>
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              activeTab === "suppliers"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>🫂</span> Suppliers
          </button>
          <button
            onClick={() => setActiveTab("bin")}
            className={`px-4 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${
              activeTab === "bin"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>🗑️</span> Bin
          </button>
        </div>

        {activeTab === "manage" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white border rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Product Management</h2>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <button className="px-3 py-1 bg-green-500 text-white rounded-lg flex items-center gap-2">
                    Excel
                  </button>
                  <button className="px-3 py-1 bg-red-500 text-white rounded-lg flex items-center gap-2">
                    PDF
                  </button>
                  <button className="px-3 py-1 border rounded-lg flex items-center gap-2">
                    Print
                  </button>
                  <button className="px-3 py-1 bg-slate-600 text-white rounded-lg flex items-center gap-2">
                    Download Excel Sample ⬇️
                  </button>
                  <button className="px-3 py-1 bg-green-500 text-white rounded-lg flex items-center gap-2">
                    Upload File ⬆️
                  </button>
                  <button 
                    onClick={openAddModal}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg flex items-center gap-2"
                  >
                    ➕ Add Product
                  </button>
                </div>

                <div className="flex gap-3 mb-4">
                  <select className="p-2 border rounded-xl">
                    <option>All Locations</option>
                  </select>
                  <input type="text" placeholder="Search:" className="p-2 border rounded-xl flex-1" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700 text-white">
                      <tr>
                        <th className="p-3 text-left rounded-tl-xl">S/N</th>
                        <th className="p-3 text-left">NAME</th>
                        <th className="p-3 text-left">UNIT</th>
                        <th className="p-3 text-left">S.PRICE</th>
                        <th className="p-3 text-left">CATEGORY</th>
                        <th className="p-3 text-left">QTY</th>
                        <th className="p-3 text-left rounded-tr-xl">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3 font-medium">{product.name}</td>
                          <td className="p-3">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {product.unit}
                            </span>
                          </td>
                          <td className="p-3">₦{product.price.toLocaleString()}</td>
                          <td className="p-3">{product.category}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded ${product.quantity > 20 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {product.quantity}
                            </span>
                          </td>
                          <td className="p-3 flex gap-2">
                            <button 
                              onClick={() => openEditModal(product)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ✏️
                            </button>
                            <button 
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="bg-gradient-to-b from-gray-50 to-white rounded-3xl p-8 border">
                <div className="text-8xl">📦</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Unit of Measurement</label>
                <select
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                >
                  <option value="Piece">Piece</option>
                  <option value="Roll">Roll</option>
                  <option value="Meter">Meter</option>
                  <option value="Box">Box</option>
                  <option value="Pack">Pack</option>
                  <option value="Dozen">Dozen</option>
                  <option value="Kg">Kg</option>
                  <option value="Liter">Liter</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Price (₦)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full p-3 border rounded-xl"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                    className="w-full p-3 border rounded-xl"
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full p-3 border rounded-xl"
                    placeholder="e.g. Cables, Bulbs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full p-3 border rounded-xl"
                    placeholder="e.g. CAB-001"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveProduct}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-xl font-bold hover:bg-gray-400"
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
