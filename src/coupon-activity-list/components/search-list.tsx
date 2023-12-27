import React from 'react';

import { Tabs } from 'antd';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import List from './list';

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      queryTab: string;

      onTabChange: Function;
    };
  };

  static relaxProps = {
    queryTab: 'queryTab',

    onTabChange: noop
  };

  render() {
    const { onTabChange, queryTab } = this.props.relaxProps;
    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={queryTab}
        >
          <Tabs.TabPane tab="全部" key="0">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="进行中" key="1">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="暂停中" key="2">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="未开始" key="3">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已结束" key="4">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
