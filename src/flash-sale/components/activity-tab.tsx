import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import SaleList from './sale-list';
import { noop } from 'qmkit';
import EndList from './end-list';
import SoonList from './soon-list';

@Relax
export default class ActivityTab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onActivityTabChange: Function;
      activityKey: 'activityKey';
    };
  };

  static relaxProps = {
    onActivityTabChange: noop,
    activityKey: 'activityKey'
  };

  render() {
    const { onActivityTabChange, activityKey } = this.props.relaxProps;

    return (
      <Tabs
        onChange={(key) => onActivityTabChange(key)}
        activeKey={activityKey}
        tabBarStyle={{ marginTop: 16 }}
      >
        <Tabs.TabPane tab="即将开场" key="0">
          <SoonList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="进行中" key="1">
          <SaleList />
        </Tabs.TabPane>
        <Tabs.TabPane tab="已结束" key="2" className="resetTable">
          <EndList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
