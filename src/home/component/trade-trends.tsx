import React from 'react';
import { WMChart } from 'biz';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';

@Relax
export default class TradeTrendsCharts extends React.Component<any, any> {
  props: {
    relaxProps?: {
      tradeTrendData: IList;
    };
  };

  static relaxProps = {
    tradeTrendData: 'tradeTrendData'
  };

  render() {
    const { tradeTrendData } = this.props.relaxProps;

    return (
      <WMChart
        multiYAxis={true}
        title=""
        startTime={new Date('2017/10/00')}
        endTime={new Date('2017/10/10')}
        dataDesc={[
          { title: '下单笔数', key: 'orderCount' },
          { title: '下单金额', key: 'orderAmt' },
          { title: '付款订单数', key: 'payOrderCount' },
          { title: '付款金额', key: 'payOrderAmt' }
        ]}
        radioClickBack={() => {}}
        content={tradeTrendData.size > 0 ? tradeTrendData.toJS() : null}
        rangeVisible={false}
      />
    );
  }
}
