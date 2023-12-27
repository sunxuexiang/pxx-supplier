import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import List from './list';
import { noop } from 'qmkit';

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      total: number;
      onTabChange: Function;
      tab: IMap;
    };
  };

  static relaxProps = {
    total: 'total',
    onTabChange: noop,
    tab: 'tab'
  };

  render() {
    const { onTabChange, tab, total } = this.props.relaxProps;
    console.log('search Table:' + total);
    const key = tab.get('key');
    const totalCount = total ? total : '0';
    const countMessage = '共' + totalCount + '条';
    console.log(this.props.relaxProps);
    return (
      <div>
        <Tabs
          onChange={(key) => {
            onTabChange(key);
          }}
          activeKey={key}
          tabBarExtraContent={countMessage}
        >
          <Tabs.TabPane tab="佣金已入账" key="1">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="佣金未入账" key="0">
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="入账失败" key="2">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
