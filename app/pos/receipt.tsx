"use client";

import { Transaction } from "@/types";

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function Receipt({ transaction, onClose }: ReceiptProps) {
  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="print:shadow-none">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-green-700">ELECTRICAL HALL (NIG) LTD.</div>
            <div className="text-sm text-gray-600">RC: 1187947</div>
            <div className="text-sm mt-1">An Electrical & Telecommunication Giants, Global Merchant and General Goods</div>
            <div className="text-sm mt-2 text-green-700">
              Head Office: 50, Idoluwo Street Idumota Lagos Island, Lagos.
            </div>
            <div className="text-sm">09080930885, 08021030267</div>
            <div className="text-sm">E-mail: electricalhall@yahoo.com</div>
          </div>

          <div className="border-t border-b py-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Receipt #: {transaction.id}</span>
              <span>{transaction.date.toLocaleDateString()} {transaction.date.toLocaleTimeString()}</span>
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
                  <td className="py-1">{item.name}</td>
                  <td className="text-right py-1">{item.cartQuantity}</td>
                  <td className="text-right py-1">₦{item.price.toLocaleString()}</td>
                  <td className="text-right py-1">₦{(item.price * item.cartQuantity).toLocaleString()}</td>
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
            Motto: In God Alone We put our Trust
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

      <style jsx>{`
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
