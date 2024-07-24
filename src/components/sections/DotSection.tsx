import React, { useEffect, useState } from "react";
import Wrapper from "components/containers/layouts/Wrapper";
import Section from "components/containers/pagesections/Section";
import * as d3 from "d3";
import SettingsPanel2 from "./SettingsPanel2";
import Heatmap from "./HeatMapSection";

const columnMapping = {
  player_dist_total: "移动距离",
  player_dmg: "总伤害量",
  player_kills: "击杀数量",
  player_survive_time: "存活时间",
  calculated_value: "排名比"
};

const DotSection = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterValue, setFilterValue] = useState(100);
  const [legendData, setLegendData] = useState({});
  const [heatmapData, setHeatmapData] = useState([]);
  const [isModulesLoaded, setIsModulesLoaded] = useState(false);

  // Fetch data based on filterValue
  const fetchData = async (value) => {
    try {
      const response = await fetch(`/api/correlation?filter=${value}`);
      const result = await response.json();
      console.log(result);
      setData(result);
      setFilteredData(result);
      updateLegend(result); // Update legend on data fetch
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateLegend = (data) => {
    const legend = { Solo: { color: "#2ca02c", count: 0 }, Duo: { color: "#ff7f0e", count: 0 }, Squad: { color: "#1f77b4", count: 0 } };
    data.forEach(d => {
      if (d.party_size === "1") legend.Solo.count += 1;
      if (d.party_size === "2") legend.Duo.count += 1;
      if (d.party_size === "4") legend.Squad.count += 1;
    });
    setLegendData(legend);
  };

  const calculateCorrelation = (data, col1, col2) => {
    const n = data.length;
    const mean1 = d3.mean(data, d => d[col1]);
    const mean2 = d3.mean(data, d => d[col2]);
    const stddev1 = d3.deviation(data, d => d[col1]);
    const stddev2 = d3.deviation(data, d => d[col2]);

    const covariance = d3.mean(data, d => (d[col1] - mean1) * (d[col2] - mean2));
    return parseFloat((covariance / (stddev1 * stddev2)).toFixed(2));
  };

  const updateHeatmapData = (data) => {
    const columns = ["player_dist_total", "player_dmg", "player_kills", "player_survive_time", "calculated_value"];
    const heatmapData = [];

    for (let i = 0; i < columns.length; i++) {
      for (let j = 0; j < columns.length; j++) {
        const correlation = calculateCorrelation(data, columns[i], columns[j]);
        heatmapData.push([i, j, correlation]);
      }
    }

    setHeatmapData(heatmapData);
  };

  useEffect(() => {
    fetchData(filterValue); // Fetch data whenever filterValue changes
  }, [filterValue]);

  useEffect(() => {
    if (filteredData.length === 0) return; // 数据为空则不渲染图表

    updateHeatmapData(filteredData);

    const renderChart = () => {
      // 清除旧图表内容
      d3.select("#correlation-chart").select("svg").remove();

      const width = 960;
      const height = width;
      const padding = 40;
      const columns = ["player_dist_total", "player_dmg", "player_kills", "player_survive_time", "calculated_value"];
      const size = (width - (columns.length + 1) * padding) / columns.length + padding;

      const x = columns.map(c => d3.scaleLinear()
        .domain(d3.extent(filteredData, d => d[c]))
        .rangeRound([padding / 2, size - padding / 2]));

      const y = x.map(x => x.copy().range([size - padding / 2, padding / 2]));

      const color = d3.scaleOrdinal()
        .domain(filteredData.map(d => d.party_size))
        .range(d3.schemeCategory10);

      const axisx = d3.axisBottom()
        .ticks(6)
        .tickSize(size * columns.length);
      const xAxis = g => g.selectAll("g").data(x).join("g")
        .attr("transform", (d, i) => `translate(${i * size},0)`)
        .each(function(d) { d3.select(this).call(axisx.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll("text").attr("fill", "#606060").attr("transform", "rotate(-40)").style("transform-origin", function() {
          return `0 ${this.getBBox().y + this.getBBox().height / 2}px`;
      }))
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));

      const axisy = d3.axisLeft()
        .ticks(6)
        .tickSize(-size * columns.length);
      const yAxis = g => g.selectAll("g").data(y).join("g")
        .attr("transform", (d, i) => `translate(0,${i * size})`)
        .each(function(d) { d3.select(this).call(axisy.scale(d)); })
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll("text").attr("fill", "#606060"))
        .call(g => g.selectAll(".tick line").attr("stroke", "#ddd"));

      const svg = d3.select("#correlation-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-padding, 0, width, height])
        .style("background-color", "#f0f0f0")
        .style("display", "block")
        .style("margin", "0 auto");

      svg.append("style")
        .text(`circle.black { fill: black; fill-opacity: 0.5; r: 2;}`);

      svg.append("g")
        .call(xAxis);

      svg.append("g")
        .call(yAxis);

      const cell = svg.append("g")
        .selectAll("g")
        .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
        .join("g")
        .attr("transform", ([i, j]) => `translate(${i * size},${j * size})`);

      cell.append("rect")
        .attr("fill", "none")
        .attr("stroke", "#aaa")
        .attr("x", padding / 2 + 0.5)
        .attr("y", padding / 2 + 0.5)
        .attr("width", size - padding)
        .attr("height", size - padding);

      cell.each(function([i, j]) {
        d3.select(this).selectAll("circle")
          .data(filteredData.filter(d => !isNaN(d[columns[i]]) && !isNaN(d[columns[j]])))
          .join("circle")
          .attr("cx", d => x[i](d[columns[i]]))
          .attr("cy", d => y[j](d[columns[j]]))
          .attr("r", data.length <= 200 ? 5 - data.length / 100 : 60 / Math.sqrt(data.length))
          .attr("fill-opacity", 0.7)
          .attr("fill", d => color(d.party_size));
      });

      svg.append("g")
        .style("font", "bold 10px sans-serif")
        .style("pointer-events", "none")
        .selectAll("text")
        .data(columns)
        .join("text")
        .attr("transform", (d, i) => `translate(${i * size},${i * size})`)
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(d => columnMapping[d]);

      function brush(cell, svg, { padding, size, x, y, columns }) {
        const brush = d3.brush()
          .extent([[padding / 2, padding / 2], [size - padding / 2, size - padding / 2]])
          .on("start", brushstarted)
          .on("brush", brushed)
          .on("end", brushended);

        cell.call(brush);

        let brushCell;

        function brushstarted() {
          if (brushCell !== this) {
            d3.select(brushCell).call(brush.move, null);
            brushCell = this;
          }
        }

        function brushed({ selection }, [i, j]) {
          let selected = [];
          if (selection) {
            const [[x0, y0], [x1, y1]] = selection;
            cell.selectAll("circle")
              .classed("black", d =>
                x0 > x[i](d[columns[i]])
                || x1 < x[i](d[columns[i]])
                || y0 > y[j](d[columns[j]])
                || y1 < y[j](d[columns[j]])
              );
            selected = filteredData.filter(
              d => x0 < x[i](d[columns[i]])
                && x1 > x[i](d[columns[i]])
                && y0 < y[j](d[columns[j]])
                && y1 > y[j](d[columns[j]])
            );
          } else {
            cell.selectAll("circle").classed("black", false); // Remove black class if no selection
          }
          updateLegend(selected);
          updateHeatmapData(selected);
          svg.property("value", selected).dispatch("input");
        }

        function brushended({ selection }) {
          if (selection) return;
          svg.property("value", []).dispatch("input");
          cell.selectAll("circle").classed("black", false); // Remove black class from all circles
          updateLegend(filteredData); // Reset to original data legend
          updateHeatmapData(filteredData);
        }
      }

      brush(cell, svg, { padding, size, x, y, columns });
    };

    renderChart(); // 在数据加载后渲染图表
  }, [filteredData]); // 依赖于filteredData而不是data

  // Function to handle filter value changes from SettingsPanel2
  const handleFilterChange = (newValue) => {
    setFilterValue(newValue);
  };

  return (
    <Section sectionId="dot" className="bg-surface py-10 text-on-surface">
      <Wrapper className="text-center text-white" maxWidth="1600px">
        <h1 className="title-1">相关系数散点图</h1>
        <div className="flex gap-6">
          <div id="correlation-chart"></div>
          <div className="flex flex-col gap-3 w-full">
            <SettingsPanel2 onSave={handleFilterChange} legendData={legendData} />
            <Heatmap data={heatmapData} />
          </div>
        </div>
      </Wrapper>
    </Section>
  );
};

export default DotSection;
