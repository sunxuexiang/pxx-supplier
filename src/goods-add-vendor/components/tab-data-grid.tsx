import React from 'react';
import { IMap, Relax } from 'plume2';
import { Tabs } from 'antd';
import InformList from './info-list';
import { noop } from 'qmkit';

@Relax
export default class TabDataGrid extends React.Component<any, any> {
  props: {
    relaxProps?: {
      onTabChange: Function;
      searchData: IMap;
      biddingType: any;
    };
  };

  static relaxProps = {
    onTabChange: noop,
    searchData: 'searchData',
    biddingType: 'biddingType'
  };

  render() {
    const { onTabChange, searchData } = this.props.relaxProps;
    const biddingType = searchData.get('biddingType');

    return (
      <Tabs
        onChange={(key) => onTabChange(key)}
        activeKey={biddingType}
        defaultActiveKey="0"
      >
        <Tabs.TabPane tab="关键词竞价" key="0">
          <InformList />
        </Tabs.TabPane>

        <Tabs.TabPane tab="分类竞价" key="1">
          <InformList />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}
