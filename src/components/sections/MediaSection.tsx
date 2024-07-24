import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import Wrapper from "components/containers/layouts/Wrapper";
import Section from "components/containers/pagesections/Section";
import Slider from 'react-slider';

const MediaSection = () => {
  const [data, setData] = useState([]);
  const [valueRange, setValueRange] = useState([0, 2310417]);

  const fetchData = async (minKillCount, maxKillCount) => {
    try {
      const response = await fetch(`/api/weaponKillCount?minKillCount=${minKillCount}&maxKillCount=${maxKillCount}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(valueRange[0], valueRange[1]);
  }, [valueRange]);

  useEffect(() => {
    if (data.length === 0) return;

    const filteredData = data.filter(d => d.kill_count >= valueRange[0] && d.kill_count <= valueRange[1]);

    const container = document.querySelector('#word-cloud');
    container.innerHTML = ''; // Clear any previous content

    if (filteredData.length === 0) {
      const message = document.createElement('p');
      message.textContent = 'No data available for the selected range.';
      container.appendChild(message);
      return;
    }

    const width = 800;
    const height = width;
    const margin = 1;
    const name = d => d.killed_by;
    const value = d => d.kill_count;
    const format = d3.format(",d");
    const color = d3.scaleOrdinal(d3.schemeTableau10);
    const pack = d3.pack().size([width - margin * 2, height - margin * 2]).padding(3);

    const root = pack(d3.hierarchy({ children: filteredData }).sum(d => value(d)));

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-margin, -margin, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
      .attr("text-anchor", "middle");

    const node = svg.append("g")
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    node.append("title")
      .text(d => `${name(d.data)}\n${format(value(d.data))}`);

    node.append("circle")
      .attr("fill-opacity", 0.7)
      .attr("fill", d => color(d.data.killed_by))
      .attr("r", d => d.r);

    const text = node.append("text")
      .attr("clip-path", d => `circle(${d.r})`);

    text.selectAll("tspan")
      .data(d => name(d.data).split(/(?=[A-Z][a-z])|\s+/g))
      .join("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.35}em`)
      .text(d => d);

    text.append("tspan")
      .attr("x", 0)
      .attr("y", d => `${name(d.data).split(/(?=[A-Z][a-z])|\s+/g).length / 2 + 0.35}em`)
      .attr("fill-opacity", 0.7)
      .text(d => format(value(d.data)));

    const svgNode = svg.node();
    container.appendChild(svgNode);
  }, [data, valueRange]);

  const handleRangeChange = (newRange) => {
    setValueRange(newRange);
  };

  return (
    <Section sectionId="media" className="py-10 text-on-surface">
      <Wrapper className="text-center">
        <h1 className="title-1">死亡方式气泡图</h1>
        <div id="word-cloud"></div>
        <div className="range-slider mt-4">
          <Slider
            className="slider"
            value={valueRange}
            min={0}
            max={2310417}
            onChange={handleRangeChange}
            step={1}
            withTracks
            renderTrack={(props, state) => {
              const trackStyle = {
                ...props.style,
                backgroundColor: state.index === 1 ? '#888' : '#ddd',
              };
              return <div {...props} className={`slider-track slider-track-${state.index}`} style={trackStyle} />;
            }}
            renderThumb={(props, state) => <div {...props} className="slider-thumb" />}
          />
          <div className="flex justify-between mt-2">
            <span>{valueRange[0]}</span>
            <span>{valueRange[1]}</span>
          </div>
        </div>
      </Wrapper>
    </Section>
  );
};

export default MediaSection;
