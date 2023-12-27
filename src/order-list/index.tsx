import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Form } from 'antd';
import './index.less';
import { AuthWrapper, BreadCrumb } from 'qmkit';
import SearchHead from './components/search-head';
import SearchList from './components/search-tab-list';
import LogisticsModal from './components/logistics-modal';
import ChangeModal from './components/change-modal';
import PresaleModal from './components/presale-modal';

// @ts-ignore
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
      let searchCacheForm =
        JSON.parse(sessionStorage.getItem('searchCacheForm')) || {};
      let orderForm = searchCacheForm?.orderForm || {};
      let orderAddonBeforeForm = searchCacheForm?.orderAddonBeforeForm || {};
      let tabKey = searchCacheForm?.tabKey || '';
      if (orderForm?.pageSize) {
        this.store.onSearchOrderForm(orderForm, orderAddonBeforeForm, tabKey);
      } else {
        this.store.init();
      }
      delete searchCacheForm['orderForm'];
      delete searchCacheForm['orderAddonBeforeForm'];
      delete searchCacheForm['tabKey'];
      sessionStorage.setItem(
        'searchCacheForm',
        JSON.stringify(searchCacheForm)
      );
    }

    this.store.getExpressCompany();
    // this.store.getLogisticsCompany();
  }

  render() {
    return (
      <AuthWrapper functionName="fOrderList001">
        <div className="order-con">
          <BreadCrumb />
          <div className="container">
            <SearchHead />
            <SearchList />
          </div>
          <LogisticsModal />
          <ChangeModal />
          {/* <PresaleModal /> */}
        </div>
      </AuthWrapper>
    );
  }
}
