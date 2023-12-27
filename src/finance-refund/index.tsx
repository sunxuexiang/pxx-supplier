//财务-退单退款
import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline,BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchForm from './components/search-form';
import PayOrderList from './components/list';
import RefundModal from './components/refund-modal';
import RefuseModal from './components/refuse-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinanceRefund extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>财务</Breadcrumb.Item>
          <Breadcrumb.Item>资金管理</Breadcrumb.Item>
          <Breadcrumb.Item>订单退款</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="退单退款" />
          <SearchForm />
          <PayOrderList />
          <RefundModal />
          <RefuseModal />
        </div>
      </div>
    );
  }
}
