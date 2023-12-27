import React from 'react';
import { Relax } from 'plume2';
import { Tabs, Form, Button } from 'antd';
const { TabPane } = Tabs;
import { noop } from 'qmkit';

import LiveListSearch from './llive-list/live-list-search-form';
import LiveListTabs from './llive-list/live-list-tabs';
import LiveGoodsSearch from './live-goods/live-goods-search-form';
// import Tool from './live-goods/tool';
import LiveGoodsTab from './live-goods/live-goods-tabs';
import LiveCompanySearch from './live-company/live-company-search-form';
import LiveCompanyTabs from './live-company/live-company-tabs';

import LiveBagSearch from './live-bag/live-bag-search-form';
import LiveBagTabs from './live-bag/live-bag-tabs';
import ButtonGroup from './live-bag/button-group';

const LiveListSearchForm = Relax(Form.create()(LiveListSearch));
const LiveGoodsSearchForm = Relax(Form.create()(LiveGoodsSearch));
const LiveCompanySearchForm = Relax(Form.create()(LiveCompanySearch));
const LiveBagSearchForm = Relax(Form.create()(LiveBagSearch));

@Relax
export default class LiveTabs extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentCardTab: string;
      setCurrentTab: Function;
    };
  };

  static relaxProps = {
    currentCardTab: 'currentCardTab',
    setCurrentTab: noop
  };

  render() {
    const { currentCardTab, setCurrentTab } = this.props.relaxProps;

    return (
      <Tabs onChange={(key) => setCurrentTab(key)} activeKey={currentCardTab}>
        <TabPane tab="直播列表" key="0">
          {/* 搜索项区域 */}
          <LiveListSearchForm />

          {/* 直播列表tab */}
          <LiveListTabs />
        </TabPane>
        <TabPane tab="直播商品" key="1">
          {/* 搜索项区域 */}
          <LiveGoodsSearchForm />

          {/*批量提审 */}
          {/* <Tool /> */}

          {/* 直播商品库tab */}
          <LiveGoodsTab />
        </TabPane>
        <TabPane tab="直播优惠券" key="2">
          {/* 搜索项区域 */}
          <LiveCompanySearchForm />

          {/* 直播优惠券tab */}
          <LiveCompanyTabs />
        </TabPane>
        <TabPane tab="直播福袋" key="3">
          {/* 搜索项区域 */}
          <LiveBagSearchForm />

          {/* 新增福袋按钮区域 */}
          <ButtonGroup />

          {/* 直播优惠券tab */}
          <LiveBagTabs />
        </TabPane>
      </Tabs>
    );
  }
}
