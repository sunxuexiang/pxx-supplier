import React from 'react';
import { Breadcrumb, Tabs } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';

import OperateLog from './components/operate-log';
import OrderDetailTab from './components/order-detail';
import OrderDelivery from './components/order-delivery';
import OrderReceive from './components/order-receive';
import OrderPickUp from './components/order-pickup';

import { Headline, BreadCrumb, noop } from 'qmkit';
import { IMap } from '../../typings/globalType';

/**
 * 订单详情
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
    const detail = this.store.state().get('detail');
    const pickUpFlag = detail.get('deliverWay');
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>订单详情</Breadcrumb.Item>
        </BreadCrumb>
        <div className="container">
          <Headline title="订单详情" />

          <Tabs
            onChange={(key) => this.store.onTabsChange(key)}
            activeKey={this.store.state().get('tab')}
          >
            <Tabs.TabPane tab="订单详情" key="1">
              <OrderDetailTab />
            </Tabs.TabPane>
            {/* {pickUpFlag && pickUpFlag != '3' && (
              <Tabs.TabPane tab="发货记录" key="2">
                <OrderDelivery />
              </Tabs.TabPane>
            )} */}
            <Tabs.TabPane tab="收款记录" key="3">
              <OrderReceive />
            </Tabs.TabPane>
            <Tabs.TabPane tab="提货记录" key="4">
              <OrderPickUp />
            </Tabs.TabPane>
            {/* {pickUpFlag && pickUpFlag == '3' && (
              <Tabs.TabPane tab="自提记录" key="4">
                <OrderPickUp />
              </Tabs.TabPane>
            )} */}
          </Tabs>

          <OperateLog />
        </div>
      </div>
    );
  }
}
