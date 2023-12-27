import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import BaseInfo from './components/base-info';
import GrouponGoods from './components/groupon-goods';
import GrouponOrders from './components/groupon-orders';

import Appstore from './store';

@StoreProvider(Appstore, { debug: __DEV__ })
export default class GrouponAdd extends Component<any, any> {
  store: Appstore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { activityId } = this.props.match.params;
    this.store.init(activityId);
  }

  render() {
    return [
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>活动详情</Breadcrumb.Item>
      </BreadCrumb>,

      <div className="container" key="container">
        <Headline title="拼团活动详情" />
        <BaseInfo />
        <GrouponGoods />
        <GrouponOrders />
      </div>
    ];
  }
}
