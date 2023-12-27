import React from 'react';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/funnel';

import { Relax } from 'plume2';

@Relax
export default class Filter extends React.Component<any, any> {
  props: {
    relaxProps?: {
      tradeGeneral: any;
    };
  };

  static relaxProps = {
    tradeGeneral: 'tradeGeneral'
  };

  render() {
    const { tradeGeneral } = this.props.relaxProps;
    //访客数
    const totalUv = tradeGeneral.get('totalUv');
    //下单人数
    const orderNum = tradeGeneral.get('orderNum');
    //下单金额
    const PayOrderNum = tradeGeneral.get('PayOrderNum');
    let filterData = new Array();
    filterData.push({
      value: totalUv,
      name: '访客数' + ' ' + totalUv,
      itemStyle: { normal: { color: '#2db7f5 ' } }
    });
    filterData.push({
      value: orderNum,
      name: '下单人数' + ' ' + orderNum,
      itemStyle: { normal: { color: '#7dc856 ' } }
    });
    filterData.push({
      value: PayOrderNum,
      name: '付款人数' + ' ' + PayOrderNum,
      itemStyle: { normal: { color: '#df6898' } }
    });
    let option = {
      toolbox: {
        feature: {
          saveAsImage: {}
        },
        right: '50px'
      },
      calculable: true,
      series: [
        {
          name: '漏斗图',
          type: 'funnel',
          left: '10%',
          top: 50,
          //x2: 80,
          bottom: 50,
          width: 150,
          // height: {totalHeight} - y - y2,
          /*min: 0,
           max:100,*/
          minSize: '0%',
          maxSize: '99%',
          sort: 'descending',
          gap: 2,
          label: {
            normal: {
              show: true,
              position: 'inside'
            }
          },
          labelLine: {
            normal: {
              length: 10,
              lineStyle: {
                width: 1,
                type: 'solid'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#fff',
              borderWidth: 8,
              label: {
                formatter: function(val) {
                  return val.name.split(' ').join('\n');
                }
              }
            }
          },
          data: filterData ? filterData : []
        }
      ]
    };

    return (
      <div>
        <ReactEchartsCore echarts={echarts} option={option} />
      </div>
    );
  }
}
