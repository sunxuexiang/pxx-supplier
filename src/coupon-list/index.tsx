import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline,BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchHead from './components/search-head';
import SearchList from './components/search-list';
import ButtonGroup from './components/button-group';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CouponActivityList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName={'f_coupon_list'}>
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>营销设置</Breadcrumb.Item>
            <Breadcrumb.Item>优惠券列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container coupon">
            <Headline title="优惠券列表" />
            <SearchHead />
            {/*操作按钮组*/}
            <ButtonGroup />
            <SearchList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
