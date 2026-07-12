import React from "react";
import {
  FaGasPump,
//   FaTools,
  FaMoneyBillWave,
  FaChartLine,
  FaFileInvoiceDollar,
  FaArrowTrendUp,
} from "react-icons/fa6";

const FinancialAnalystPage = () => {
  const cards = [
    {
      title: "Fuel Cost",
      value: "₹2.45L",
      icon: <FaGasPump />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Maintenance Cost",
      value: "₹85K",
      icon: <FaGasPump />,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Operational Cost",
      value: "₹3.30L",
      icon: <FaMoneyBillWave />,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Fleet ROI",
      value: "18%",
      icon: <FaArrowTrendUp />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  const expenses = [
    {
      category: "Fuel",
      amount: "₹2,45,000",
      percentage: 74,
    },
    {
      category: "Maintenance",
      amount: "₹85,000",
      percentage: 26,
    },
  ];

  const reports = [
    {
      title: "Monthly Expense Report",
      date: "July 2026",
      status: "Generated",
    },
    {
      title: "Fuel Consumption Report",
      date: "July 2026",
      status: "Generated",
    },
    {
      title: "Fleet ROI Report",
      date: "June 2026",
      status: "Pending",
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-full">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Financial Analyst Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor fleet expenses and financial performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h2 className="text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center ${card.bg}`}
              >
                <span className={`${card.color} text-2xl`}>
                  {card.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expense Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">
            Expense Breakdown
          </h2>

          <div className="space-y-6">
            {expenses.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between mb-2">
                  <span>{item.category}</span>
                  <span>{item.amount}</span>
                </div>

                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-3 bg-blue-600 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend Dummy */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Monthly Cost Trend
            </h2>

            <FaChartLine className="text-2xl text-green-600" />
          </div>

          <div className="flex items-end justify-between h-56">
            {[70, 90, 60, 110, 95, 80].map((height, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-10 bg-green-500 rounded-t-md"
                  style={{ height }}
                />

                <span className="text-xs mt-2 text-gray-500">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reports */}
      <div className="bg-white rounded-2xl border shadow-sm mt-8 p-6">
        <h2 className="text-xl font-semibold mb-6">
          Recent Financial Reports
        </h2>

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.title}
              className="flex justify-between items-center border rounded-xl p-4"
            >
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <FaFileInvoiceDollar />
                  {report.title}
                </h3>

                <p className="text-sm text-gray-500">
                  {report.date}
                </p>
              </div>

              <span
                className={`px-4 py-1 rounded-full text-sm ${
                  report.status === "Generated"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {report.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FinancialAnalystPage;