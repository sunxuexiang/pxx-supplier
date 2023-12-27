import React from 'react';
import { StoreProvider } from 'plume2';
import { Tabs } from 'antd';
import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-list';
import ButtonGroup from './components/button-group';
import RuleForm from './components/rule-form';

const { TabPane } = Tabs;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CouponActivityList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
    this.store.ruleInit();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_pieces-list'}>
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>平台营销管理</Breadcrumb.Item>
            <Breadcrumb.Item>优惠券列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container coupon">
            <Headline title="乡镇件设置" />
            <Tabs defaultActiveKey="1">
              <TabPane tab="规则设置" key="1">
                <RuleForm />
              </TabPane>
              <TabPane tab="乡镇件设置" key="2">
                <SearchHead />
                {/*操作按钮组*/}
                <ButtonGroup />
                <SearchList />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
