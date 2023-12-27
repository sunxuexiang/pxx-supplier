import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import Detail from './detail';
const { TabPane } = Tabs;
import { noop } from 'qmkit';

@Relax
export default class LiveTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentLiveListTab: string;
      changeLiveListTab: Function;
    };
  };

  static relaxProps = {
    currentLiveListTab: 'currentLiveListTab',
    changeLiveListTab: noop
  };

  render() {
    const { currentLiveListTab, changeLiveListTab } = this.props.relaxProps;

    return (
      <Tabs
        activeKey={currentLiveListTab}
        onChange={(key) => changeLiveListTab(key)}
      >
        <TabPane tab="商品详情" key="1">
          <Detail />
        </TabPane>
        <TabPane tab="领券记录" key="2">
          <Detail />
        </TabPane>
        <TabPane tab="福袋中奖记录" key="3">
          <Detail />
        </TabPane>
        <TabPane tab="数据统计" key="4">
          <Detail />
        </TabPane>
      </Tabs>
    );
  }
}
