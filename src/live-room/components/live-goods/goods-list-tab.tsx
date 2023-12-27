import React from 'react';
import { Relax } from 'plume2';
import { noop, Const } from 'qmkit';
import { Tabs, Form, Button } from 'antd';
import Moment from 'moment';
const { TabPane } = Tabs;

import GoodsList from './goods-list';
import SearchForm from '../live-list/search-form';
const SearchDataForm = Relax(Form.create()(SearchForm));

@Relax
export default class GoodsListTab extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentLiveGoodsTab: string;
      onLiveGoodsTabChange: Function;
    };
  };

  static relaxProps = {
    currentLiveGoodsTab: 'currentLiveGoodsTab',
    onLiveGoodsTabChange: noop
  };

  render() {
    const { currentLiveGoodsTab, onLiveGoodsTabChange } = this.props.relaxProps;

    return (
      <Tabs
        onChange={(key) => {
          onLiveGoodsTabChange(key);
        }}
        activeKey={currentLiveGoodsTab}
      >
        <TabPane tab="待提审" key="0">
          <GoodsList />
        </TabPane>
        <TabPane tab="待审核" key="1">
          <GoodsList />
        </TabPane>
        <TabPane tab="已审核" key="2">
          <GoodsList />
        </TabPane>
        <TabPane tab="审核未通过" key="3">
          <GoodsList />
        </TabPane>
      </Tabs>
    );
  }
}
