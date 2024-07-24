import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SunburstChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    d3.csv('/data/heat_map.csv').then(ori_data => 
    {
      // 解析 CSV 数据为 JSON 格式
      const jsonData = ori_data.map(item => ({
        map: item.map,
        solo: +item.Single,
        duo: +item.Duo,
        squad: +item.Squad,
        total: +item[100]
      }));

      // 生成所需的数据格式
      const csv = jsonData.flatMap(item => [
        [`${item.map}-Solo-100`, item.solo.toString()],
        [`${item.map}-Duo-100`, item.duo.toString()],
        [`${item.map}-Squad-100`, item.squad.toString()]
      ]);

      console.log("ori_data:",ori_data);
      let data1 = new Array(20).fill(0);
      let data2 = new Array(20).fill(0);
      let tot_erangel = 0;
      let tot_miramar = 0;
      if (ori_data[0]['map'] == 'erangel') {
          tot_erangel = parseInt(ori_data[0]['all']);
          tot_miramar = parseInt(ori_data[1]['all']);
          console.log(tot_erangel);
          for (let i = 1; i <= 20; i++) {
              let key = (i * 5).toString();
              data1[i - 1] = parseInt(ori_data[0][key]);
              data2[i - 1] = parseInt(ori_data[1][key]);
          }

      } else {
          tot_erangel = parseInt(ori_data[1]['all']);
          tot_miramar = parseInt(ori_data[0]['all']);
          for (let i = 1; i <= 20; i++) {
              let key = (i * 5).toString();
              data1[i - 1] = parseInt(ori_data[1][key]);
              data2[i - 1] = parseInt(ori_data[0][key]);
          }

      }
	//   console.log(data1);
    const colorScale3 = d3.scaleLinear()
      .domain([0, 19])
      .range(["yellow", "lightblue"]);

    const colorScale6 = d3.scaleLinear()
      .domain([0, 19])
      .range(["#cdf9ff", "#9794f9"]);

	// const color = d3.scaleOrdinal<string>()
    //   .domain(['Solo', 'Duo', 'Squad', 'Miramar', 'Erangel'])
    //   .range(["#e2b8f3", "#deb0d9", "#bd92a6"]);
	const color = d3.scaleOrdinal()
			.domain(['Solo', 'Duo', 'Squad'
				, 'Miramar', 'Erangel'])
			.range(["#bbded6", "#f3f798", "#9794f9", "lightblue", '#cdf9ff']);

    const width = 500;
	const height = 900;

	const margin = { top: 10, right: 0, bottom: 10, left: 0 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;
	const radius = width / 1.75;
	const cirR = 156.4;

	const mousearc = d3
		.arc()
		.startAngle(d => d.x0)
		.endAngle(d => d.x1)
		.innerRadius(d => Math.sqrt(d.y0) - 90)
		.outerRadius(radius)

    const buildHierarchy = (csv: string[][]) => {
		const root = { name: "root", children: [] };
		for (let i = 0; i < csv.length; i++) {
			const sequence = csv[i][0];
			const size = +csv[i][1];
			if (isNaN(size)) {
				continue;
			}
			const parts = sequence.split("-");
			let currentNode = root;
			for (let j = 0; j < parts.length; j++) {
				const children = currentNode["children"];
				const nodeName = parts[j];
				let childNode = null;
				if (j + 1 < parts.length) {
					// Not yet at the end of the sequence; move down the tree.
					let foundChild = false;
					for (let k = 0; k < children.length; k++) {
						if (children[k]["name"] == nodeName) {
							childNode = children[k];
							foundChild = true;
							break;
						}
					}
					// If we don't already have a child node for this branch, create it.
					if (!foundChild) {
						childNode = { name: nodeName, children: [] };
						children.push(childNode);

					}
					currentNode = childNode;
				} else {
					// Reached the end of the sequence; create a leaf node.
					childNode = { name: nodeName, value: size };
					children.push(childNode);
				}
			}
		}
		return root;
	}

    const data = buildHierarchy(csv);
	
    const partition = data =>
		d3.partition().size([2 * Math.PI, radius * radius])(
			d3
				.hierarchy(data)
				.sum(d => d.value)
				.sort((a, b) => b.value - a.value)
		);

    const root = partition(data);
    const svg = d3.select('.mainsvg');

	const arc = d3
		.arc()
		.startAngle(d => d.x0)
		.endAngle(d => d.x1)
		.padAngle(1 / radius)
		.padRadius(radius)
		.innerRadius(d => Math.sqrt(d.y0) - 90)
		.outerRadius(d => Math.sqrt(d.y1) - 91)

    const element = svg.node();
    element.value = { sequence: [], percentage: 0.0 };

    const label = svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', "#888")
      .style('visibility', 'hidden');

    label.append('tspan')
      .attr('class', 'percentage')
      .attr('x', 0)
      .attr("y", 0)
      .attr("dy", "0.3em")
      .attr("font-size", "2em")
      .text("");

    const scaleFactor = 1.3;
    const scaledWidth = width * scaleFactor;
    const scaledHeight = width * scaleFactor;

    svg.attr("viewBox", `${-scaledWidth / 2} ${-scaledHeight / 2} ${scaledWidth} ${scaledHeight}`)
      .style("max-width", `${width}px`)
      .style("max-height", `${width}px`)
      .style("font", "12px sans-serif");

    const path = svg.append('g')
      .selectAll('path')
      .data(root.descendants().filter(d => (d.depth === 1 || d.depth === 2) && d.x1 - d.x0 > 0.001))
      .join('path')
      .attr('fill', d => color(d.data.name))
      .attr('d', arc);

	const text = svg.append('g')
	  .selectAll('text')
	  .data(root.descendants().filter(d => {
		  return (d.depth == 1 || d.depth == 2) && d.x1 - d.x0 > 0.001;
	  }))
	  .enter()
	  .append('text')
	  .attr('transform', d => `translate(${arc.centroid(d)})`)
	  .attr('text-anchor', 'middle')
	  .style('font-family', "Comic Sans MS,黑体 ")
	  .style('font-size', '11px')
	  .text(d => d.data.name);

	  svg.append('g')
	  .attr('fill', 'none')
	  .attr('pointer-events', 'all')
	  .on('mouseleave', () => {
		  path.attr('fill-opacity', 1);
		  label.style('visibility', 'hidden');
		  element.value = { sequence: [], percentage: 0.0 };
		  element.dispatchEvent(new CustomEvent('input'));
		  // svg2.selectAll('g').remove();
	  })
	  .selectAll('path')
	  .data(
		  root.descendants().filter(d => {
			  return d.depth <= 2 && d.x1 - d.x0 > 0.001;
		  })
	  )
	  .join('path')
	  .attr('d', mousearc)
	  .on('mouseenter', (event, d) => {

		  const sequence = d.ancestors().reverse().slice(1);
		  path.attr('fill-opacity', node => sequence.indexOf(node) >= 0 ? 1.0 : 0.2);

		  const percentage = ((100 * d.value) / root.value).toPrecision(3);
		  label
			  .style("visibility", null)
			  .select(".percentage")
			  .text(percentage + "%");
		  element.value = { sequence, percentage };
		  element.dispatchEvent(new CustomEvent("input"));
	  });

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('z-index', '10')
      .style('visibility', 'hidden')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '10px')
      .style('border-radius', '4px')
      .style('box-shadow', '0px 0px 10px rgba(0, 0, 0, 0.1)')
      .style('font-family', 'sans-serif');

    const updateTooltip = (content: string, event: any) => {
      tooltip.html(content)
        .style('visibility', 'visible')
        .style('top', `${event.pageY - 10}px`)
        .style('left', `${event.pageX + 10}px`);
    };

    const hideTooltip = () => {
      tooltip.style('visibility', 'hidden');
    };

    let path2;
    for (let i = 0; i < 2; i++) {
      const innerRadius = cirR;

      const group = svg.append("g");
      const toFixed2 = (num: number) => parseFloat(num.toFixed(2));

      for (let j = 0; j < 20; j++) {
        let now;
        let outerRadius = cirR * 2;
        const startAngle = (Math.PI / 20) * (20 * (1 - i) + j) - Math.PI / 2;
        const endAngle = startAngle + (Math.PI / 20);

        if (i === 0) {
          now = (5 * data1[j]) / tot_erangel;
        } else {
          now = (5 * data2[j]) / tot_miramar;
        }

        outerRadius *= now;
        outerRadius += innerRadius;

        const arc2 = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(startAngle)
          .endAngle(endAngle)
          .padAngle(1 / radius)
          .padRadius(radius);

        group.append('path')
          .attr('d', arc2())
          .attr('stroke', 'white')
          .attr('stroke-width', '0.5')
          .attr('fill', i === 0 ? colorScale3(j) : colorScale6(j))
          .on('mouseover', (event) => {
            d3.select(event.currentTarget).style('fill', 'red');
            d3.select(event.currentTarget).style('stroke', 'yellow').style('stroke-width', '2');

            const istr = i === 0 ? 'Erangel' : 'Miramar';
            updateTooltip(`Rank: ${j * 5}% ~ ${j * 5 + 5}%<br/>Map: ${istr}<br/>Share: ${toFixed2(now * 100 / 5)}%`, event);
          })
          .on('mousemove', (event) => {
            tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`);
          })
          .on('mouseleave', (event) => {
            d3.select(event.currentTarget).style('fill', i === 0 ? colorScale3(j) : colorScale6(j));
            d3.select(event.currentTarget).style('stroke', 'white').style('stroke-width', '0.5');

            hideTooltip();
          });
      }
    }

    const group = svg.append('g');
    const cirR1 = [0.1, 0.2, 0.3, 0.4];
    cirR1.forEach((r, i) => {
      const arc3 = d3.arc()
        .innerRadius(cirR + cirR * r * 2)
        .outerRadius(cirR + cirR * r * 2)
        .startAngle(-Math.PI)
        .endAngle(Math.PI);

      group.append('path')
        .attr('d', arc3())
        .attr("stroke", "brown")
        .attr("stroke-width", 1.2)
        .attr("stroke-opacity", 0.3)
        .attr("fill", "none");

      group.append("text")
        .attr("x", 0)
        .attr("y", -(cirR + cirR * r * 2))
        .attr("dy", "0.15em")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .text(`${10 * (i + 1) * 0.2}%`)
        .style("font-size", 10)
        .attr("stroke-opacity", 0.9)
        .clone(true)
        .attr("fill", "#000")
        .attr("stroke-opacity", 0.9)
        .attr("stroke", "none");

      group.append("text")
        .attr("x", 0)
        .attr("y", (cirR + cirR * r * 2))
        .attr("dy", "0.15em")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .text(`${10 * (i + 1) * 0.2}%`)
        .style("font-size", 10)
        .attr("stroke-opacity", 0.9)
        .clone(true)
        .attr("fill", "#000")
        .attr("stroke-opacity", 0.9)
        .attr("stroke", "none");
    });

    svg.append('g')
      .append("line")
      .attr("x1", 157)
      .attr("y1", 0)
      .attr("x2", 157 + 150)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-width", 1.2);

    svg.append('g')
      .append("line")
      .attr("x1", -157)
      .attr("y1", 0)
      .attr("x2", -157 - 150)
      .attr("y2", 0)
      .attr("stroke", "black")
      .attr("stroke-width", 1.2);

    const legend1 = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${margin.left + 100},${margin.top + 230})`);

    for (let i = 0; i <= 19; i++) {
      legend1.append("rect")
        .attr("x", 10 * i)
        .attr("y", 20)
        .attr("height", 15)
        .attr("width", 19)
        .attr("fill", colorScale3(19 - i));
    }

    let arrow1StartX = 30;
    let arrow1EndX = 9 * 19 - 19;
    let arrow1Y = 20 + 30;
    legend1.append("text")
      .text("100%")
      .attr("y", arrow1Y)
      .attr("font-size", 11);

    legend1.append("text")
      .text("0%")
      .attr("x", arrow1EndX + 40)
      .attr("y", arrow1Y)
      .attr("font-size", 11);

    legend1.append("line")
      .attr("x1", arrow1StartX + 7)
      .attr("y1", arrow1Y - 3)
      .attr("x2", arrow1EndX + 35)
      .attr("y2", arrow1Y - 3)
      .attr("stroke", "black")
      .attr("stroke-width", 1.2);

    legend1.append("polygon")
      .attr("points", `${arrow1EndX + 8 + 12 - 130},${arrow1Y - 7.5} ${arrow1EndX + 16 - 130},${arrow1Y - 3} ${arrow1EndX + 8 + 12 - 130},${arrow1Y + 1.5} ${arrow1EndX + 10 - 130},${arrow1Y - 3}`)
      .attr("fill", "black");

    arrow1StartX = 19;
    arrow1EndX = 9 * 19 - 19;
    arrow1Y = 20 + 30;

    const legend2 = svg.append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${margin.left - 280},${margin.top - 320})`);

    for (let i = 0; i <= 19; i++) {
      legend2.append("rect")
        .attr("x", 10 * i)
        .attr("y", 20)
        .attr("height", 15)
        .attr("width", 19)
        .attr("fill", colorScale6(i));
    }

    legend2.append("text")
      .text("0%")
      .attr("y", arrow1Y)
      .attr("font-size", 11);

    legend2.append("text")
      .text("100%")
      .attr("x", arrow1EndX + 30)
      .attr("y", arrow1Y)
      .attr("font-size", 11);

    legend2.append("line")
      .attr("x1", arrow1StartX + 7)
      .attr("y1", arrow1Y - 3)
      .attr("x2", arrow1EndX + 18)
      .attr("y2", arrow1Y - 3)
      .attr("stroke", "black")
      .attr("stroke-width", 1.2);

    legend2.append("polygon")
      .attr("points", `${arrow1EndX + 8 + 12},${arrow1Y - 7.5} ${arrow1EndX + 12 + 12},${arrow1Y - 3} ${arrow1EndX + 8 + 12},${arrow1Y + 1.5} ${arrow1EndX + 18 + 12},${arrow1Y - 3}`)
      .attr("fill", "black");
  })
  }, []);

  return (
    <div className="bg-orangebg p-2 shadow-lg w-full flex items-center justify-center h-[468px] rounded-md">
      <svg className="mainsvg"></svg>
    </div>
  );
};

export default SunburstChart;
