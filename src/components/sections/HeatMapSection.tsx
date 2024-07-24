import React from 'react';
import Highcharts from 'highcharts';
import dynamic from 'next/dynamic';
import HighchartsReact from 'highcharts-react-official';
import heatmapModule from 'highcharts/modules/heatmap';
import exportingModule from 'highcharts/modules/exporting';
import exportDataModule from 'highcharts/modules/export-data';
import accessibilityModule from 'highcharts/modules/accessibility';

// heatmapModule(Highcharts);
// exportingModule(Highcharts);
// exportDataModule(Highcharts);
// accessibilityModule(Highcharts);

const HighchartsReact = dynamic(() => import('highcharts-react-official'), {
    ssr: false  // 禁用服务器端渲染
});

if (typeof window !== 'undefined') {
    heatmapModule(Highcharts);
    exportingModule(Highcharts);
    exportDataModule(Highcharts);
    accessibilityModule(Highcharts);
}
// heatmapModule(Highcharts);
// exportingModule(Highcharts);
// exportDataModule(Highcharts);
// accessibilityModule(Highcharts);

const Heatmap = ({ data }) => {
    if (typeof window === 'undefined') {
        return null; // 服务器渲染时不渲染任何内容
      }
    
  const options = {
    chart: {
      type: 'heatmap',
      marginTop: 60,
      marginBottom: 100,
      plotBorderWidth: 1,
      height: 600
    },
    title: {
      text: 'Correlation Coefficient Heatmap',
      style: {
        fontSize: '1em'
      }
    },
    xAxis: {
      categories: ['移动距离', '总伤害量', '击杀数量', '存活时间', '排名比']
    },
    yAxis: {
      categories: ['移动距离', '总伤害量', '击杀数量', '存活时间', '排名比'],
      title: null,
      reversed: true
    },
    accessibility: {
      point: {
        descriptionFormat: '{index + 1}. {series.xAxis.categories.[point.x]} correlation with {series.yAxis.categories.[point.y]}, {point.value}.'
      }
    },
    colorAxis: {
      min: -1,
      max: 1,
      stops: [
        [0, '#3060cf'],
        [0.5, '#fffbbc'],
        [0.9, '#c4463a'],
        [1, '#c4463a']
      ]
    },
    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 42,
      symbolHeight: 440
    },
    tooltip: {
      formatter: function () {
        return `<b>${this.series.xAxis.categories[this.point.x]}</b> correlation with<br>
          <b>${this.series.yAxis.categories[this.point.y]}</b>: <br>
          <b>${this.point.value.toFixed(2)}</b>`;
      }
    },
    series: [{
      name: 'Correlation coefficient',
      borderWidth: 1,
      data: data,
      dataLabels: {
        enabled: true,
        color: '#000000'
      }
    }],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          yAxis: {
            labels: {
              formatter: function () {
                return this.value.substr(0, 1);
              }
            }
          }
        }
      }]
    }
  };

    return (
        <div className="bg-white p-2 shadow-lg ml-10 w-full flex items-center justify-center h-full rounded-md">
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
            className="h-full"
        />
        </div>
    );
};

export default Heatmap;
