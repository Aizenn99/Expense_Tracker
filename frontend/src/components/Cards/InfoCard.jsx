const InfoCard = ({ icon, color, value, label }) => {


  return (
    <div className="flex gap-6 bg-white rounded-2xl p-6 shadow-md shadow-gray-100 border border-gray-200/50">
      <div
        className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-sm text-gray-500 mb-1">{label}</h6>
        <span className="text-[21px]">Rs {value}</span>
      </div>
    </div>
  );
};

export default InfoCard;