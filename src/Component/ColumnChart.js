import React, { useEffect, useRef, useState } from 'react';
import ApexCharts from 'apexcharts';
import { Colors } from '../Colors/color';

const ColumnChart = ({ BottomText, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {

    const options = {
      series: [{
        name: 'Inflation',
        data: data ? data?.map((ele, i) => ele?.count) : [],
      }],
      chart: {
        height: 400,
        type: 'bar',
        toolbar: {
          show: false // Remove the toolbar with the download option
        }
      },
      colors: [Colors.ThemeBlue], // Set bar color to red
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
          columnWidth: BottomText==='Quarterly'?'10%':BottomText==='Monthly'?'50%':'30%',
          height: 100,
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val;
        },
        offsetY: -20,
        style: {
          fontSize: '15px',
          colors: [Colors.ThemeBlue],
        }
      },
      grid: {
        show: false // Disables the background gridlines
      },
      xaxis: {
        categories: data ? data?.map((ele, i) => ele?.data) : [],
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        tooltip: {
          enabled: false,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val;
          },
        }
      },
    };
    

    if (chartRef.current) {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();
    }
    return () => {

      if (chartRef.current) {
        chartRef.current.innerHTML = '';
      }
    };
  }, [data]);

  return <div style={{ overflowX: 'auto', scrollbarColor: `rgba(255, 255, 255, 0) ${Colors.ThemeBlue}` }}>
    <div ref={chartRef} style={{ minWidth: BottomText !== 'Monthly' ? '100%' : '150%' }} />
  </div>
};

export default ColumnChart;
