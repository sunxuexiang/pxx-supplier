import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline,BreadCrumb } from 'qmkit';
import AppStore from './store';

import SearchForm from './components/search-form';
import RefundList from './components/list';
import ButtonGroup from './components/button-group';

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
          <Breadcrumb.Item>退款明细</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="退款明细" />
          <SearchForm />
          <ButtonGroup />
          <RefundList />
        </div>
      </div>
    );
  }
}
