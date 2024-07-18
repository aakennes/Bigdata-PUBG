import React, { useState } from 'react';

const SettingsPanel = ({onSave}) => {
  const [selectedMap, setSelectedMap] = useState('map1');
  const [selectedRank, setSelectedRank] = useState('100%');
  const [selectedDeathTypes, setSelectedDeathTypes] = useState([
    'type1', 'type2', 'type3', 'type4', 'type5', 'type6'
  ]);
  const [selectedModules, setSelectedModules] = useState([
    'solo', 'duo', 'four'
  ]);

  const handleDeathTypeChange = (type) => {
    setSelectedDeathTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleModuleChange = (module) => {
    setSelectedModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  const handleSave = () => {
    const selectedOptions = {
      map: selectedMap,
      rank: selectedRank,
      deathTypes: selectedDeathTypes,
      modules: selectedModules,
    };
    // console.log(selectedOptions);
    onSave(selectedOptions);
    // 这里可以执行保存操作，例如发送数据到服务器
  };

  return (
    <div className="bg-orangelight p-2 shadow-lg w-full flex items-center justify-center h-[20em] rounded-md">
      <div className="mr-2 pt-0">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <div className="grid grid-cols-4 gap-1 mt-4">
          {/* Map Selection */}
          <div>
            <h3 className="font-bold mb-2">Map</h3>
            <div>
              <label className="block">
                <input
                  type="radio"
                  name="map"
                  value="map1"
                  checked={selectedMap === 'map1'}
                  onChange={() => setSelectedMap('map1')}
                />
                Map1
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="map"
                  value="map2"
                  checked={selectedMap === 'map2'}
                  onChange={() => setSelectedMap('map2')}
                />
                Map2
              </label>
            </div>
          </div>
          {/* Rank Selection */}
          <div>
            <h3 className="font-bold mb-2">Rank</h3>
            <div>
              {['10%', '25%', '50%', '100%'].map((rank) => (
                <label key={rank} className="block">
                  <input
                    type="radio"
                    name="rank"
                    value={rank}
                    checked={selectedRank === rank}
                    onChange={() => setSelectedRank(rank)}
                  />
                  {rank}
                </label>
              ))}
            </div>
          </div>
          {/* Death Type Selection */}
          <div>
            <h3 className="font-bold mb-2">Death Type</h3>
            <div>
              {['type1', 'type2', 'type3', 'type4', 'type5', 'type6'].map((type) => (
                <label key={type} className="block">
                  <input
                    type="checkbox"
                    name="deathType"
                    value={type}
                    checked={selectedDeathTypes.includes(type)}
                    onChange={() => handleDeathTypeChange(type)}
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
          {/* Module Selection */}
          <div>
            <h3 className="font-bold mb-2">Module</h3>
            <div>
              {['solo', 'duo', 'four'].map((module) => (
                <label key={module} className="block">
                  <input
                    type="checkbox"
                    name="module"
                    value={module}
                    checked={selectedModules.includes(module)}
                    onChange={() => handleModuleChange(module)}
                  />
                  {module}
                </label>
              ))}
            </div>
          </div>
        </div>
        {/* <button className="absolute bottom-2 right-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-default">
          Save
        </button> */}
        <button className="btn-primary  mt-4" onClick={handleSave}>
            Save
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
