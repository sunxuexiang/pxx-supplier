import React from 'react';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
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
      <AuthWrapper functionName={'f_coupon_list1'}>
        <div>
          <BreadCrumb />
          <div className="container coupon">
            <Headline title="活动页" />
            {/*操作按钮组*/}
            <ButtonGroup />
            <SearchList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
