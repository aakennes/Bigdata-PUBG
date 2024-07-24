import React, { useState, useEffect } from 'react';

const SettingsPanel2 = ({ onSave, legendData }) => {
  const [localValue, setLocalValue] = useState(100);
  const [legend, setLegend] = useState({});

  useEffect(() => {
    if (legendData) {
      setLegend(legendData);
    }
  }, [legendData]);

  const handleChange = (event) => {
    setLocalValue(event.target.value);
  };

  const handleSave = () => {
    onSave(Number(localValue));
  };

  return (
    <div className="bg-white p-4 shadow-xl w-full ml-10 mx-auto rounded-lg justify-center h-[300px] ">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Filter</h2>
      <div className="flex items-center space-x-4 justify-center">
        {/* Number Label and Input */}
        <div className="flex items-center space-x-2">
          <label
            className="font-medium text-gray-700"
            htmlFor="filter-value"
          >
            Number:
          </label>
          <input
            id="filter-value"
            type="number"
            value={localValue}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
            max="10000"
          />
        </div>
        {/* Confirm Button */}
        <button
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          onClick={handleSave}
        >
          Confirm
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Legend</h3>
        <div className="flex flex-col space-y-2 justify-center items-center">
          {Object.entries(legend).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: value.color }}
              ></span>
              <span className="text-gray-700">{key}: {value.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel2;
