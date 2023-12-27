import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';

import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';

import SearchList from './components/search-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class StockActivityList extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { activityId } = this.props.match.params;
    if (activityId) {
      this.store.wareBut(activityId);
    }
  }

  render() {
    return (
      <AuthWrapper functionName={'f_stock_activities_listf'}>
        <div>
          <BreadCrumb />
          <div className="container activity">
            <Headline title="商品列表" />

            <SearchList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
