import React from 'react';
import { Relax } from 'plume2';
import { Tabs } from 'antd';
import { noop } from 'qmkit';

import EvaluateList from './list';

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
    tabIndex: 'tabIndex',
    onStateTabChange: noop
  };

  render() {
    const { tabIndex, onStateTabChange } = this.props.relaxProps;
    return (
      <Tabs activeKey={tabIndex} onChange={tabInd => onStateTabChange(tabInd)}>
        <TabPane tab="全部评价" key="1">
          <EvaluateList />
        </TabPane>
        <TabPane tab="未回复" key="2">
          <EvaluateList />
        </TabPane>
      </Tabs>
    );
  }
}
