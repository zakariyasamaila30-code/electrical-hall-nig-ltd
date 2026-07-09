"use client";

import { useState, useEffect } from "react";
import { Transaction, CompanySettings } from "@/types";

const defaultSettings: CompanySettings = {
  name: "Electrical Hall (Nig) Ltd",
  address: "50, Idoluwo Street Idumota Lagos Island, Lagos.",
  phone: "09080930885, 08021030267",
  email: "electricalhall@yahoo.com",
  rcNumber: "1187947",
  motto: "In God Alone We put our Trust"
};

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function Receipt({ transaction, onClose }: ReceiptProps) {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem("companySettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    const savedLogo = localStorage.getItem("companyLogo");
    if (savedLogo) {
      setLogo(savedLogo);
    }
  }, []);

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="print">
          <div className="text-center mb-6">
            {logo && (
              <img
                src={logo}
                alt="Company Logo"
                className="w-32 h-32 mx-auto mb-3 object-contain"
              />
            )}
            <div className="text-2xl font-bold text-green-700">{settings.name}</div>
            <div className="text-sm text-gray-600">RC: {settings.rcNumber}</div>
            <div className="text-sm mt-2 text-green-700">{settings.address}</div>
            <div className="text-sm">{settings.phone}</div>
            <div className="text-sm">{settings.email}</div>
          </div>

          <div className="border-t border-b py-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Receipt #: {transaction.id}</span>
              <span>{new Date(transaction.date).toLocaleDateString()} {new Date(transaction.date).toLocaleTimeString()}</span>
            </div>
            {transaction.customerName && (
              <div className="text-sm mt-1">
                Customer: {transaction.customerName}
              </div>
            )}
            <div className="text-sm">Payment: {transaction.paymentMethod}</div>
          </div>

          <table className="w-full mb-4">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Item</th>
                <th className="text-right py-1">Qty</th>
                <th className="text-right py-1">Price</th>
                <th className="text-right py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {transaction.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-1">
                    {item.name}
                    <span className="text-xs text-gray-500 ml-1">({item.unit})</span>
                  </td>
                  <td className="text-right py-1">{"cartQuantity" in item ? item.cartQuantity : item.quantity}</td>
                  <td className="text-right py-1">₦{item.price.toLocaleString()}</td>
                  <td className="text-right py-1">
                    ₦{((item.price) * ("cartQuantity" in item ? item.cartQuantity : item.quantity)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t pt-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total Amount:</span>
              <span>₦{transaction.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-center mt-8 italic text-green-700">
            Motto: {settings.motto}
          </div>
        </div>

        <div className="flex gap-4 mt-6 print:hidden">
          <button
            onClick={printReceipt}
            className="flex-1 bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Print Receipt
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print, .print * {
            visibility: visible;
          }
          .print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
