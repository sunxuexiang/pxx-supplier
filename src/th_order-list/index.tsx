import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Breadcrumb } from 'antd';
import './index.less';
import { AuthWrapper, BreadCrumb } from 'qmkit';
import SearchHead from './components/search-head';
import SearchList from './components/search-tab-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderList extends Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const state = this.props.location.state;

    if (state) {
      // state.key? this.store.onTabChange(this.props.location.state.key) : null
      if (state.key) {
        this.store.onTabChange(this.props.location.state.key);
      }
      if (state.payStatus) {
        const params = {
          tradeState: { payState: state.payStatus }
        };
        this.store.onSearch(params);
      }
    } else {
      this.store.init();
    }
  }

  render() {
    return (
      <AuthWrapper functionName="thfOrderList001">
        <div className="order-con">
          <BreadCrumb />
          <div className="container">
            <SearchHead />
            <SearchList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
