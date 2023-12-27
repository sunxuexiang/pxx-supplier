import React from 'react';
import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import SearchForm from './components/search-form';
import Tab from './components/tab';
import ForbidModal from './components/forbid-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsView extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        <AuthWrapper functionName="f_distribution_goods">
          <div className="container">
            <Headline title="特价商品" />

            {/*搜索*/}
            <SearchForm />

            {/*页签列表*/}
            <Tab />

            {/*禁售理由弹出框*/}
            <ForbidModal />
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
