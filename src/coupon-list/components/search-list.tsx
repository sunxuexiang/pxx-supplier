import React from 'react';

import { Tabs } from 'antd';
import { noop } from 'qmkit';
import { Relax } from 'plume2';
import List from './list';

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      queryTab: string;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    queryTab: 'queryTab'
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
          <Tabs.TabPane tab="生效中" key="1">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="未生效" key="2">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="领取生效" key="3">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="已失效" key="4">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
