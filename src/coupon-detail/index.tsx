import React, { Component } from 'react';
import { StoreProvider } from 'plume2';

import { Breadcrumb, Tabs } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import Appstore from './store';
import CouponBasicInfo from './components/coupon-basic-info';
import CouponRecord from './components/coupon_record';

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const { cid } = this.props.match.params;
    await this.store.init(cid);
    await this.store.inits({ pageNum: 0, pageSize: 10 });

  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>优惠券详情</Breadcrumb.Item>
        </BreadCrumb>

        <div className="container">
          <Headline title="优惠券" />
          <Tabs>
            <Tabs.TabPane tab="优惠券信息" key="1">
              <CouponBasicInfo />
            </Tabs.TabPane>
            <Tabs.TabPane tab="领取记录" key="2">
              <CouponRecord />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}
