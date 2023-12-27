import React from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Breadcrumb } from 'antd';
import { BreadCrumb } from 'qmkit';
import SearchHead from './components/search-head';
import SearchList from './components/search-list';
import './index.less';
/**
 * 退单列表
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderReturnApplyList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="order-con">
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>订单</Breadcrumb.Item>
          <Breadcrumb.Item>订单管理</Breadcrumb.Item>
          <Breadcrumb.Item>代客退单</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <SearchHead />
          <SearchList />
        </div>
      </div>
    );
  }
}
