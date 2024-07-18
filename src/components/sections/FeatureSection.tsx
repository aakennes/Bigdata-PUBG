import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Wrapper from "components/containers/layouts/Wrapper";
import Section from "components/containers/pagesections/Section";
import SettingsPanel from './SettingsPanel';
import h337 from 'heatmap.js';

const FeatureSection = () => {
  const heatmapContainerRef = useRef(null);
  const minRef = useRef(null);
  const maxRef = useRef(null);
  const gradientImgRef = useRef(null);
  const [currentDataset, setCurrentDataset] = useState('death2.csv');

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

    const loadHeatmapData = async () => {
      try {
        const response = await fetch(`/data/${currentDataset}`);
        const data = await response.text();
        const parsedData = d3.csvParse(data);

        const heatmapInstance = h337.create({
          container: heatmapContainerRef.current,
          onExtremaChange: updateLegend,
          maxOpacity: .5,
          minOpacity: .0
        });

        const points = [];
        let min_cnt = Infinity;
        let max_cnt = -Infinity;

        

        const arr = new Array(80).fill(0).map(() => new Array(80).fill(0));
        parsedData.forEach(d => {
          const x = Math.floor(d.grid_x / 100);
          const y = Math.floor(d.grid_y / 100);
          arr[x][y] += +d.death_count;
          if (arr[x][y] > max_cnt) max_cnt = arr[x][y];
        });

        for (let x = 0; x < 80; x++) {
          for (let y = 0; y < 80; y++) {
            if (arr[x][y] > 0) {
              points.push({
                x: x * 10,
                y: y * 10,
                value: arr[x][y],
                radius: 17
              });
            }
          }
        }

        heatmapInstance.setData({
          max: max_cnt,
          data: points
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadHeatmapData();
  }, [currentDataset]);
  const handleSaveOptions = (selectedOptions) => {
    console.log('Received selected options:', selectedOptions);
  };
  return (
    
    <Section sectionId="features">
      <Wrapper className="text-center text-white">
      <h1 className="title-1">Statistics</h1>
        <div className="flex gap-6">
          
          <div ref={heatmapContainerRef} className="heatmap-container">
            <div className="heatmap">
              <img src="/images/erangel.jpg" style={{ width: '100%', height: '100%' }} alt="Erangel Map" />
            </div>
            <div className="legend-area" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              <span ref={minRef} id="min">0</span>
              <span style={{ marginRight: '62px' }}></span> {/* 间距 */}
              <span ref={maxRef} id="max">1224</span>
              <img ref={gradientImgRef} src="/images/tiaodao.png" id="gradient" style={{ width: '100%' }} alt="Gradient" />
            </div>

          </div>
          <SettingsPanel onSave={handleSaveOptions}/>
        </div>
      </Wrapper>
    </Section>
  );
};

export default FeatureSection;
