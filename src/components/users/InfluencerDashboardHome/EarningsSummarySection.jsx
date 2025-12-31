import EarningsChart from './EarningsChart';


const EarningsSummarySection = ({ balance = 22765, thisMonth = 2765 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-3">
      {/* Chart Section - spans 2 columns on md+ */}
      <div className="col-span-1 md:col-span-2">
        <EarningsChart />
      </div>

      {/* Balance Section */}
      <div className="bg-white p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h2 className="text-[18px] font-medium text-[#1A1A1A] mb-1">Available Balance</h2>
          <p className="text-[32px] font-bold text-[#0C1220] mb-6">{balance.toLocaleString()}</p>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-[#F4F4F4] rounded-xl">
              <p className="text-[#1A1A1A] font-medium">Lifetime Earning</p>
              <span className="text-[#1A1A1A] font-bold">{balance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-[#F4F4F4] rounded-xl">
              <p className="text-[#1A1A1A] font-medium">This Month</p>
              <span className="text-[#1A1A1A] font-bold">{thisMonth.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button className="mt-4 bg-[#0D132D] text-white text-sm px-6 py-2 rounded-full hover:bg-[#121A3F] transition">
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default EarningsSummarySection;
