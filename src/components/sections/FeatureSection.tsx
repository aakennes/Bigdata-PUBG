import { useEffect, useRef, useState } from 'react';
import Wrapper from "components/containers/layouts/Wrapper";
import Section from "components/containers/pagesections/Section";
import SettingsPanel from './SettingsPanel';
import SunburstChart from './SunburstChart';
import h337 from 'heatmap.js';
import * as d3 from "d3";

const mapImages = {
  'erangel': '/images/erangel.jpg',
  'miramar': '/images/miramar.jpg',
  'sanhok': '/images/sanhok.jpg',
  'vikendi': '/images/vikendi.jpg'
};

const FeatureSection = () => {
  const heatmapContainerRef = useRef(null);
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const gradientImgRef = useRef(null);
  const [heatmapInstance, setHeatmapInstance] = useState(null);
  const [selectedMap, setSelectedMap] = useState('miramar');
  const [selectedRank, setSelectedRank] = useState('50%');
  const [selectedModule, setSelectedModule] = useState('All');

  const handleSaveOptions = (selectedOptions) => {
    console.log('Received selected options:', selectedOptions);
    setSelectedMap(selectedOptions.map);
    setSelectedRank(selectedOptions.rank);
    setSelectedModule(selectedOptions.module);
    console.log('Received setSelectedModule options:', selectedOptions.module);
    
    // Clear heatmap data when options are saved
    if (heatmapInstance) {
      clearHeatmapData();
    }
  };

  const clearHeatmapData = () => {
    if (heatmapInstance) {
      heatmapInstance.setData({
        max: 0,
        data: []
      });
    }
  };

  useEffect(() => {
    const legendCanvas = document.createElement('canvas');
    legendCanvas.width = 100;
    legendCanvas.height = 10;
    
    const updateLegend = (data) => {
      if (minRef.current && maxRef.current && gradientImgRef.current) {
        minRef.current.innerHTML = data.min;
        maxRef.current.innerHTML = data.max;
        const legendCtx = legendCanvas.getContext('2d');
        const gradientCfg = data.gradient;
        const gradient = legendCtx.createLinearGradient(0, 0, 100, 1);
        for (let key in gradientCfg) {
          gradient.addColorStop(key, gradientCfg[key]);
        }
        legendCtx.fillStyle = gradient;
        legendCtx.fillRect(0, 0, 100, 10);
        gradientImgRef.current.src = legendCanvas.toDataURL();
      }
    };

    const loadHeatmapData = async (map, rankrate, partysize) => {
      try {
        const query = new URLSearchParams({ map, rankrate, partysize }).toString();
        console.log("party_size:" + partysize);
        console.log("query:" + query);
        const response = await fetch(`/api/route?${query}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const newHeatmapInstance = h337.create({
          container: heatmapContainerRef.current,
          onExtremaChange: updateLegend,
          maxOpacity: .3,
          minOpacity: .0
        });
        setHeatmapInstance(newHeatmapInstance);  // Store the heatmap instance

        newHeatmapInstance.setData({
          max: 0,
          data: []
        });

        const points = [];
        let max_cnt = -Infinity;

        const arr = new Array(8000).fill(0).map(() => new Array(8000).fill(0));
        
        data.forEach(row => {
          const x = row['mapx_int'];
          const y = row['mapy_int'];
          arr[x][y] = +row['count'];
          if (arr[x][y] > max_cnt) max_cnt = arr[x][y];
        });

        for (let x = 0; x < 8000; x++) {
          for (let y = 0; y < 8000; y++) {
            if (arr[x][y] > 0) {
              points.push({
                x: x / 10,
                y: y / 10,
                value: arr[x][y],
                radius: 17
              });
            }
          }
        }

        newHeatmapInstance.setData({
          max: max_cnt,
          data: points
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadHeatmapData(selectedMap, selectedRank, selectedModule);
  }, [selectedMap, selectedRank, selectedModule]);


  return (
    <Section sectionId="features">
      <Wrapper className="text-center text-white" maxWidth="85rem">
        <h1 className="title-1">Statistics</h1>
        <h2 className="title-1">死亡热力图</h2>
        <div className="flex gap-6">
          <div ref={heatmapContainerRef} className="heatmap-container">
            <div className="heatmap">
              <img src={mapImages[selectedMap]} style={{ width: '100%', height: '100%' }} alt={`${selectedMap} Map`} />
            </div>
            <div className="legend-area" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <span ref={minRef} id="min" className='text-black'>0</span>
              <span style={{ marginRight: '62px' }} className='text-black'></span>
              <span ref={maxRef} id="max" className='text-black'>1224</span>
              <img ref={gradientImgRef} src="/images/tiaodao.png" id="gradient" style={{ width: '100%' }} alt="Gradient" />
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full">
            <SettingsPanel onSave={handleSaveOptions} />
            <SunburstChart />
          </div>
        </div>
      </Wrapper>
    </Section>
  );
};

export default FeatureSection;
