import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import MarketingList from './list';
import { noop } from 'qmkit';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      form: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    form: 'form'
  };

  render() {
    const { onTabChange, form } = this.props.relaxProps;
    const key = form.get('queryTab');

    return (
      <Tabs onChange={(key) => onTabChange(key)} activeKey={key}>
        <Tabs.TabPane tab="全部" key="0">
          <MarketingList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="进行中" key="1">
          <MarketingList />
        </Tabs.TabPane>

        {/* <Tabs.TabPane tab="暂停中" key="2">
          <MarketingList />
        </Tabs.TabPane> */}

        <Tabs.TabPane tab="未开始" key="3">
          <MarketingList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="已结束" key="4">
          <MarketingList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="已终止" key="6">
          <MarketingList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
