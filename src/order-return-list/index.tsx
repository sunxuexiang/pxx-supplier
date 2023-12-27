import React from 'react';
import { StoreProvider } from 'plume2';
import { AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import { Breadcrumb } from 'antd';
import SearchHead from './components/search-head';
import SearchTabList from './components/search-tab-list';
import './index.less';

/**
 * 退单列表
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderReturnList extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.location.state) {
      this.store.onTabChange(this.props.location.state.key);
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <AuthWrapper functionName="rolf001">
        <div className="order-con">
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>订单</Breadcrumb.Item>
            <Breadcrumb.Item>订单管理</Breadcrumb.Item>
            <Breadcrumb.Item>退单列表</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <SearchHead />
            <SearchTabList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
