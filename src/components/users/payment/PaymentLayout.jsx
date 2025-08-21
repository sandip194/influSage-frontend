import React, { useState, useMemo } from "react";
import { Modal } from "antd";
import {
  RiWalletLine,
  RiTimeLine,
  RiMoneyDollarCircleLine,
  RiEyeLine,
} from "@remixicon/react";

const transactions = [
  {
    id: 1,
    date: "16 Jan, 2025",
    activity: "Earning",
    fromTo: "Instagram Campaign",
    amount: "$195.00",
    orderNo: "#123456",
    description: "Invoice for Instagram Reel",
    type: "Earning",
    client: "John Doe",
    breakdown: [
      {
        date: "16 Jan,2025",
        description: "Invoice for Instagram Reel: Milestone 1",
        amount: "$124.32",
      },
      {
        date: "16 Jan,2025",
        description: "Withholding Tax (IN) - Ref ID 391984783",
        amount: "-$0.10",
      },
      {
        date: "16 Jan,2025",
        description: "Service Fee for Fixed Price - Ref ID 391984783",
        amount: "-$2.00",
      },
    ],
    netEarning: "-$118.20",
  },
  {
    id: 2,
    date: "16 Jan, 2025",
    activity: "Withdraw",
    fromTo: "Bank Account",
    amount: "$124.32",
    orderNo: "#123457",
    description: "Lorem ipsum dolor sit amet",
  },
];

const PaymentLayout = () => {
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const pageSize = 5;

  // ---------- Filtering ----------
  const filteredTransactions = useMemo(() => {
    let data = transactions;

    if (searchText.trim()) {
      data = data.filter(
        (t) =>
          t.activity.toLowerCase().includes(searchText.toLowerCase()) ||
          t.fromTo.toLowerCase().includes(searchText.toLowerCase()) ||
          t.orderNo.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    return data;
  }, [searchText]);

  // ---------- Pagination ----------
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [page, filteredTransactions]);

  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  return (
    <div className="w-full text-sm overflow-x-hidden">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
      <p className="mb-6 text-gray-600 text-sm">
        You can track all your payment here
      </p>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0f122f]">
              <RiWalletLine size={20} className="text-white" />
            </div>
            <span className="text-sm text-gray-600">
              Work In Progress Payment
            </span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-3">$2,765</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0f122f]">
              <RiTimeLine size={20} className="text-white" />
            </div>
            <span className="text-sm text-gray-600">Pending Payment</span>
          </div>
          <p className="text-xl font-bold text-gray-900 mt-3">$2,765</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0f122f]">
              <RiMoneyDollarCircleLine size={20} className="text-white" />
            </div>
            <span className="text-sm text-gray-600">Available Payment</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xl font-bold text-gray-900">$2,765</p>
            <button className="px-4 py-2 rounded-full border border-gray-300 transition bg-[#0f122f] text-white">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search payments..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#0f122f] focus:outline-none"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 text-gray-700 text-sm tracking-wide">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Activity</th>
                <th className="p-4">From/To</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Order No.</th>
                <th className="p-4">Description</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {paginatedData.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="p-4">{row.date}</td>
                  <td className="p-4">{row.activity}</td>
                  <td className="p-4">{row.fromTo}</td>
                  <td className="p-4 font-medium">{row.amount}</td>
                  <td className="p-4">{row.orderNo}</td>
                  <td className="p-4">{row.description}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedTransaction(row)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <RiEyeLine className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
        <p className="text-sm text-gray-600">
          Showing {paginatedData.length} of {filteredTransactions.length}{" "}
          Results
        </p>
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1.5 rounded-lg border ${
                page === i + 1
                  ? "bg-[#0f122f] text-white border-[#0f122f]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={!!selectedTransaction}
        footer={null}
        onCancel={() => setSelectedTransaction(null)}
        centered
        width={600}
      >
        {selectedTransaction && (
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {selectedTransaction.fromTo}
            </h2>

            <div className="flex flex-wrap md:justify-around mt-3 gap-6 border border-gray-200 rounded-2xl p-4">
              <div className="flex-row items-center gap-2">
                <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                  <span>Date</span>
                </div>
                <p>16 Jan, 2025</p>
              </div>
              <div className="flex-row items-center justify-center gap-2">
                <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                  <span>Type</span>
                </div>
                <p>Earning</p>
              </div>
              <div className="flex-row items-center justify-center gap-2">
                <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                  <span>Client</span>
                </div>
                <p>John Doe</p>
              </div>
              <div className="flex-row items-center justify-center gap-2">
                <div className="flex gap-2 items-center justify-center mb-2 text-gray-400">
                  <span>Amount</span>
                </div>
                <p>$195.00</p>
              </div>
            </div>

            {/* Breakdown */}
            {selectedTransaction.breakdown && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Earning & Fees
                </h3>

                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600">
                      <th className="p-3 text-left font-medium">Date</th>
                      <th className="p-3 text-left font-medium">Description</th>
                      <th className="p-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTransaction.breakdown.map((item, i) => (
                      <tr key={i}>
                        <td className="p-3 text-gray-600">{item.date}</td>
                        <td className="p-3">{item.description}</td>
                        <td className="p-3 text-right">{item.amount}</td>
                      </tr>
                    ))}

                    {/* Net Earning row */}
                    {selectedTransaction.netEarning && (
                      <tr className="font-semibold">
                        <td colSpan={2} className="p-3 text-left">
                          Net Earning
                        </td>
                        <td className="p-3 text-right">
                          {selectedTransaction.netEarning}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                onClick={() => setSelectedTransaction(null)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-full bg-[#0f122f] text-white hover:bg-[#1c214f]">
                Download Invoice
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PaymentLayout;
