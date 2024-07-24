import React, { useState } from 'react';

const SettingsPanel = ({ onSave }) => {
  const [selectedMap, setSelectedMap] = useState('miramar');
  const [selectedRank, setSelectedRank] = useState('50%');
  const [selectedModule, setSelectedModule] = useState('All');

  const handleSave = () => {
    const selectedOptions = {
      map: selectedMap,
      rank: selectedRank,
      module: selectedModule,
    };
    onSave(selectedOptions);
  };

  return (
    <div className="bg-orangelight p-2 shadow-lg w-full flex items-center justify-center h-[320px] rounded-md">
      <div className="mr-2 pt-0">
        <h2 className="text-2xl font-bold mb-7">Settings</h2>
        <div className="grid grid-cols-3 gap-8 mt-4 mb-7">
          {/* Map Selection */}
          <div>
            <h3 className="font-bold mb-2">Map</h3>
            <div>
              <label className="block">
                <input
                  type="radio"
                  name="map"
                  value="erangel"
                  checked={selectedMap === 'erangel'}
                  onChange={() => setSelectedMap('erangel')}
                />
                Erangel
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="map"
                  value="miramar"
                  checked={selectedMap === 'miramar'}
                  onChange={() => setSelectedMap('miramar')}
                />
                Miramar
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
          {/* Module Selection */}
          <div>
            <h3 className="font-bold mb-2">Module</h3>
            <div>
              {['All', 'Solo', 'Duo', 'Squad'].map((module) => (
                <label key={module} className="block">
                  <input
                    type="radio"
                    name="module"
                    value={module}
                    checked={selectedModule === module}
                    onChange={() => setSelectedModule(module)}
                  />
                  {module}
                </label>
              ))}
            </div>
          </div>
        </div>
        <button className="btn-primary mt-4" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;
