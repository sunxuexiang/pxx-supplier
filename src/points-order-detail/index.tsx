import React from 'react';
import { Breadcrumb, Tabs } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';

import OperateLog from './components/operate-log';
import OrderDetailTab from './components/order-detail';
import OrderDelivery from './components/order-delivery';
import OrderReceive from './components/order-receive';

import { Headline, BreadCrumb } from 'qmkit';

/**
 * 积分订单详情
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderDetail extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { tid } = this.props.match.params;
    if (this.props.location.state != undefined) {
      this.store.onTabsChange(this.props.location.state.tab);
    }
    this.store.init(tid);
  }

  render() {
    if (this.state.loading) {
      return <div>loading...</div>;
    }

    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>积分订单详情</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title="积分订单详情" />

          <Tabs
            onChange={(key) => this.store.onTabsChange(key)}
            activeKey={this.store.state().get('tab')}
          >
            <Tabs.TabPane tab="订单详情" key="1">
              <OrderDetailTab />
            </Tabs.TabPane>
            <Tabs.TabPane tab="发货记录" key="2">
              <OrderDelivery />
            </Tabs.TabPane>
            <Tabs.TabPane tab="收款记录" key="3">
              <OrderReceive />
            </Tabs.TabPane>
          </Tabs>

          <OperateLog />
        </div>
      </div>
    );
  }
}
