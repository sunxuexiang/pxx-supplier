import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class StockActivityList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_stock_activities_listf'}>
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>营销设置</Breadcrumb.Item>
            <Breadcrumb.Item>优惠券活动</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container activity">
            <Headline title="囤货活动列表" />
            <SearchHead />
            <SearchList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
