import React from 'react';

import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { BreadCrumb } from 'qmkit';
import AppStore from './store';

import List from './components/list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingCenter extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>营销设置</Breadcrumb.Item>
          <Breadcrumb.Item>营销中心</Breadcrumb.Item>
        </Breadcrumb> */}
        {/*各种营销*/}
        <List liveStatus={this.store.state().get('liveStatus')} />
      </div>
    );
  }
}
