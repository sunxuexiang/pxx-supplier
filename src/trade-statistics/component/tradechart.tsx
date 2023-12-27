import React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { WMChart } from 'biz';

//自定义指标卡片显示的内容
const popContent = [
  {
    title: '下单指标',
    data: [
      { title: '下单笔数', key: 'orderCount' },
      { title: '下单人数', key: 'orderNum' },
      { title: '下单金额', key: 'orderAmt' },
      { title: '付款订单数', key: 'PayOrderCount' },
      { title: '付款人数', key: 'PayOrderNum' },
      { title: '付款金额', key: 'payOrderAmt' }
    ]
  },
  {
    title: '转化指标',
    data: [
      { title: '下单转化率', key: 'orderConversionRate' },
      { title: '付款转化率', key: 'payOrderConversionRate' },
      { title: '全店转化率', key: 'wholeStoreConversionRate' },
      { title: '客单价', key: 'customerUnitPrice' },
      { title: '笔单价', key: 'everyUnitPrice' }
    ]
  },
  {
    title: '退单指标',
    data: [
      { title: '退单笔数', key: 'returnOrderCount' },
      { title: '退单人数', key: 'returnOrderNum' },
      { title: '退单金额', key: 'returnOrderAmt' }
    ]
  }
];

const recommend = [
  /*{title: "下单笔数", key: "orderCount"},*/
  { title: '下单金额', key: 'orderAmt' }
];

@Relax
export default class TradeCharts extends React.Component<any, any> {
  props: {
    relaxProps?: {
      tradeCharts: any;
      defaultDesc: any;
      changeDesc: Function;
      startDate: ''; //开始时间
      endDate: ''; //结束时间，
      getTradeChart: Function;
      multiYAxis: boolean; //是否为多Y轴
      weekly: boolean; //安周是否显示
      selectType: '';
    };
  };

  static relaxProps = {
    visible: 'visible',
    tradeCharts: 'tradeCharts',
    defaultDesc: 'defaultDesc',
    changeDesc: noop,
    startDate: 'startDate', //开始时间
    endDate: 'endDate', //结束时间，
    getTradeChart: noop,
    multiYAxis: 'multiYAxis',
    weekly: 'weekly',
    selectType: 'selectType'
  };

  render() {
    const {
      tradeCharts,
      defaultDesc,
      changeDesc,
      startDate,
      endDate,
      getTradeChart,
      weekly,
      selectType
    } = this.props.relaxProps;
    return (
      <WMChart
        hasIndicators={true}
        title="交易趋势"
        startTime={new Date(startDate)}
        endTime={new Date(endDate)}
        dataDesc={defaultDesc}
        onChecked={param => changeDesc(param)}
        radioClickBack={value => getTradeChart(selectType, 1 === value)}
        chartCheckedArray={defaultDesc}
        chartRecommend={recommend}
        content={tradeCharts ? tradeCharts : []}
        popContent={popContent}
        currentWeekly={weekly}
      />
    );
  }
}
