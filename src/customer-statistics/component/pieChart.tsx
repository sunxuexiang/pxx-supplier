import React from 'react';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';

interface WMPieChartProps {
  content: Array<any>;
  height?: number;
}

export default class WMPieChart extends React.Component<WMPieChartProps, any> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { height, content } = this.props;

    //容器高度
    const chartHeight = height || 400;

    //获取折线图需要的数据
    const option = this._renderChartData(content);

    return (
      <ReactEchartsCore
        option={option}
        echarts={echarts}
        style={{ height: `${chartHeight}px`, width: '100%' }}
        className="react_for_echarts"
      />
    );
  }

  _renderChartData = content => {
    let nameArray = [];
    content = content.map(value => {
      nameArray.push(value.levelName);
      return { name: value.levelName, value: value.num };
    });

    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: nameArray
      },
      series: [
        {
          name: '客户等级',
          type: 'pie',
          radius: '50%',
          label: {
            normal: {
              formatter: '{b}\n{d}%'
            }
          },
          data: content,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    return option;
  };
}
