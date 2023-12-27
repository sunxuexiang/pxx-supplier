import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { noop } from 'qmkit';

import GoodsList from './goods-list';

const TabPane = Tabs.TabPane;

@Relax
export default class Tab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      addedFlag: string;
      onStateTabChange: Function;
    };
  };

  static relaxProps = {
    addedFlag: 'addedFlag',
    onStateTabChange: noop
  };

  render() {
    const { addedFlag, onStateTabChange } = this.props.relaxProps;
    return (
      <Tabs
        defaultActiveKey={addedFlag}
        onChange={key => onStateTabChange(key)}
      >
        <TabPane tab="全部" key="-1">
          <GoodsList />
        </TabPane>
        <TabPane tab="上架中" key="1">
          <GoodsList />
        </TabPane>
        <TabPane tab="部分上架" key="2">
          <GoodsList />
        </TabPane>
        <TabPane tab="下架中" key="0">
          <GoodsList />
        </TabPane>
      </Tabs>
    );
  }
}
