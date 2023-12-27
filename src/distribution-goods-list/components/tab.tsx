import React from 'react';
import { Relax } from 'plume2';

import { Tabs } from 'antd';
import { noop } from 'qmkit';

import List from './goods-list';

@Relax
export default class Tab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      form: any;
      totalCount: number;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    form: 'form',
    totalCount: 'totalCount'
  };

  render() {
    const { form, onTabChange, totalCount } = this.props.relaxProps;
    const key = form.get('distributionGoodsAudit');

    return (
      <div>
        <Tabs
          activeKey={key}
          onChange={(key) => onTabChange(key)}
          tabBarExtraContent={
            <div>
              共<span style={{ color: '#F56C1D' }}>
                {totalCount ? totalCount : 0}
              </span>条
            </div>
          }
        >
          <Tabs.TabPane tab="已审核" key={2}>
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="待审核" key={1}>
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="审核未通过" key={3}>
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="禁止分销" key={4}>
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
