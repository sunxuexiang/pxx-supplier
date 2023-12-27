import React from 'react';
import { Relax } from 'plume2';
import { history, Const, noop } from 'qmkit';
import { Tabs, Form, Button } from 'antd';
import Moment from 'moment';
const { TabPane } = Tabs;

import SearchForm from './live-list/search-form';
import LiveListTabs from './live-list/live-list-tabs';
import GoodsListTab from './live-goods/goods-list-tab';
import GoodsSearchForm from './live-goods/goods-search-form';
const SearchDataForm = Relax(Form.create()(SearchForm));

@Relax
export default class LiveTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      openStatus: string;
      currentTab: string;
      changeCurrentTab: Function;
    };
  };

  static relaxProps = {
    openStatus: 'openStatus',
    currentTab: 'currentTab',
    changeCurrentTab: noop
  };

  render() {
    const { openStatus, currentTab, changeCurrentTab } = this.props.relaxProps;

    if (openStatus != '已开通') return <div />;

    return (
      <Tabs
        type="card"
        activeKey={currentTab}
        onChange={(key) => changeCurrentTab(key)}
      >
        <TabPane tab="直播列表" key="0">
          {/* 搜索项区域 */}
          <SearchDataForm />

          {/* 创建直播 */}
          <Button
            type="primary"
            style={{ width: '120px', marginBottom: '16px' }}
            onClick={() => history.push({ pathname: '/live-add' })}
          >
            创建直播
          </Button>

          {/* 直播列表tab */}
          <LiveListTabs />
        </TabPane>
        <TabPane tab="直播商品库" key="1">
          {/* 商品搜索项区域 */}
          <GoodsSearchForm />

          {/* 添加直播商品 */}
          <Button
            type="primary"
            style={{ width: '120px', marginBottom: '16px' }}
            onClick={() => history.push({ pathname: '/live-goods-add' })}
          >
            添加直播商品
          </Button>

          {/* 商品列表tab */}
          <GoodsListTab />
        </TabPane>
      </Tabs>
    );
  }
}
