import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import List from './list';
import { noop } from 'qmkit';

@Relax
export default class SearchList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      searchForm: IMap;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    searchForm: 'searchForm'
  };

  render() {
    const { onTabChange, searchForm } = this.props.relaxProps;
    const key = searchForm.get('checkState');

    return (
      <div>
        <Tabs
          onChange={key => {
            onTabChange(key);
          }}
          activeKey={key}
        >
          <Tabs.TabPane tab="全部" key="99">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="待审核" key="0">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="已审核" key="1">
            <List />
          </Tabs.TabPane>

          <Tabs.TabPane tab="审核未通过" key="2">
            <List />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}
