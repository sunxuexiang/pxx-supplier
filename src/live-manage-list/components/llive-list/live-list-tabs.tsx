import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

import LiveList from './live-list';
import { noop } from 'qmkit';

@Relax
export default class LiveListTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentLiveListTab: string;
      // changeLiveListTab: Function;
    };
  };

  static relaxProps = {
    currentLiveListTab: 'currentLiveListTab'
    // changeLiveListTab: noop
  };

  render() {
    // const { currentLiveListTab, changeLiveListTab } = this.props.relaxProps;

    return (
      <LiveList />
      // <Tabs
      //   activeKey={currentLiveListTab}
      //   onChange={(key) => changeLiveListTab(key)}
      // >
      //   <TabPane tab="全部" key="-1">
      //     <LiveList />
      //   </TabPane>
      //   <TabPane tab="直播中" key="0">
      //     <LiveList />
      //   </TabPane>
      //   <TabPane tab="未开始" key="3">
      //     <LiveList />
      //   </TabPane>
      //   <TabPane tab="已结束" key="4">
      //     <LiveList />
      //   </TabPane>
      //   <TabPane tab="暂停中" key="1">
      //     <LiveList />
      //   </TabPane>
      //   <TabPane tab="禁播" key="5">
      //     <LiveList />
      //   </TabPane>
      //   <TabPane tab="异常" key="2">
      //     <LiveList />
      //   </TabPane>
      //   <TabPane tab="已过期" key="6">
      //     <LiveList />
      //   </TabPane>
      // </Tabs>
    );
  }
}
