import React from 'react';
import { IMap, Relax } from 'plume2';

import { Tabs } from 'antd';
import { noop } from 'qmkit';

import List from '../component/list';

@Relax
export default class Tab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      changeTab: Function;
      form: IMap;
    };
  };

  static relaxProps = {
    changeTab: noop,
    form: 'form'
  };

  render() {
    const { form } = this.props.relaxProps;
    const key = form.get('tabType');
    return (
      <div>
        <Tabs activeKey={key} onChange={(key) => this._handleClick(key)}>
          <Tabs.TabPane tab="进行中" key={1}>
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="即将开始" key={0}>
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="已结束" key={2}>
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="待审核" key={3}>
            <List />
          </Tabs.TabPane>
          <Tabs.TabPane tab="审核失败" key={4}>
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }

  /**
   * 切换tab
   */
  _handleClick = (key) => {
    this.props.relaxProps.changeTab(key);
  };
}
