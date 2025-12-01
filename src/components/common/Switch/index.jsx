const Switch = ({ checked, onChange, label, className = "" }) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div
          className={`block w-10 h-6 rounded-full ${
            checked ? "bg-blue-600" : "bg-gray-300"
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
            checked ? "transform translate-x-4" : ""
          }`}
        ></div>
      </div>
      {label && (
        <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
      )}
    </label>
  );
};

export default Switch;
