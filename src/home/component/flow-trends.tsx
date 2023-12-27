import React from 'react';
import { WMChart } from 'biz';
import { Relax } from 'plume2';
import { IList } from 'typings/globalType';

@Relax
export default class FlowTrendsCharts extends React.Component<any, any> {
  props: {
    relaxProps?: {
      flowTrendData: IList;
    };
  };

  static relaxProps = {
    flowTrendData: 'flowTrendData'
  };

  render() {
    const { flowTrendData } = this.props.relaxProps;

    return (
      <WMChart
        title=""
        startTime={new Date()}
        endTime={new Date()}
        dataDesc={[
          { title: '访客数UV', key: 'totalUv' },
          { title: '浏览量PV', key: 'totalPv' },
          { title: '商品访客数', key: 'skuTotalUv' },
          { title: '商品浏览量', key: 'skuTotalPv' }
        ]}
        radioClickBack={() => {}}
        content={flowTrendData.toJS()}
        rangeVisible={false}
      />
    );
  }
}
