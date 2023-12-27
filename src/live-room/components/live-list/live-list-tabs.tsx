import React from 'react';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';
import { Tabs, Form, Button } from 'antd';
import Moment from 'moment';
const { TabPane } = Tabs;

import InfoList from './info-list';
import SearchForm from './search-form';
const SearchDataForm = Relax(Form.create()(SearchForm));

@Relax
export default class LiveListTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentLiveListTab: string;
      onLiveListTabChange: Function;
    };
  };

  static relaxProps = {
    currentLiveListTab: 'currentLiveListTab',
    onLiveListTabChange: noop
  };

  render() {
    const { onLiveListTabChange, currentLiveListTab } = this.props.relaxProps;

    return (
      <Tabs
        onChange={(key) => {
          onLiveListTabChange(key);
        }}
        activeKey={currentLiveListTab}
      >
        <TabPane tab="全部" key="-1">
          <InfoList />
        </TabPane>
        <TabPane tab="直播中" key="0">
          <InfoList />
        </TabPane>
        <TabPane tab="未开始" key="3">
          <InfoList />
        </TabPane>
        <TabPane tab="已结束" key="4">
          <InfoList />
        </TabPane>
        <TabPane tab="暂停中" key="1">
          <InfoList />
        </TabPane>
        <TabPane tab="禁播" key="5">
          <InfoList />
        </TabPane>
        <TabPane tab="异常" key="2">
          <InfoList />
        </TabPane>
        <TabPane tab="已过期" key="6">
          <InfoList />
        </TabPane>
      </Tabs>
    );
  }
}
