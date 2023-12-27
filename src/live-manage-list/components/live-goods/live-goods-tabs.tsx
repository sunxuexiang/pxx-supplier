import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

import LiveGoodsList from './live-goods-list';
import { noop } from 'qmkit';

@Relax
export default class LiveListTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentLiveGoodsTab: string;
      // changeLiveGoodsTab: Function;
    };
  };

  static relaxProps = {
    currentLiveGoodsTab: 'currentLiveGoodsTab'
    // changeLiveGoodsTab: noop
  };

  render() {
    // const { currentLiveGoodsTab, changeLiveGoodsTab } = this.props.relaxProps;

    return (
      <LiveGoodsList />
      // <Tabs
      //   activeKey={currentLiveGoodsTab}
      //   onChange={(key) => changeLiveGoodsTab(key)}
      // >
      //   <TabPane tab="待提审" key="0">
      //     <LiveGoodsList />
      //   </TabPane>
      //   <TabPane tab="待审核" key="1">
      //     <LiveGoodsList />
      //   </TabPane>
      //   <TabPane tab="已审核" key="2">
      //     <LiveGoodsList />
      //   </TabPane>
      //   <TabPane tab="审核未通过" key="3">
      //     <LiveGoodsList />
      //   </TabPane>
      // </Tabs>
    );
  }
}
