import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { noop } from 'qmkit';

import GoodsList from '../components/goods-list';

const TabPane = Tabs.TabPane;

@Relax
export default class Tab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      tabIndex: string;
      onStateTabChange: Function;
    };
  };

  static relaxProps = {
    // 模糊条件-商品名称
    tabIndex: 'tabIndex',
    onStateTabChange: noop
  };

  render() {
    const { tabIndex, onStateTabChange } = this.props.relaxProps;
    return (
      <Tabs activeKey={tabIndex} onChange={key => onStateTabChange(key)}>
        <TabPane tab="全部" key="1">
          <GoodsList />
        </TabPane>
        <TabPane tab="待审核" key="2">
          <GoodsList />
        </TabPane>
        <TabPane tab="审核未通过" key="3">
          <GoodsList />
        </TabPane>
        <TabPane tab="禁售中" key="4">
          <GoodsList />
        </TabPane>
      </Tabs>
    );
  }
}
