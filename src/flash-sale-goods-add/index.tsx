import React, { Component } from 'react';
import { Relax, StoreProvider } from 'plume2';

import { Breadcrumb, Form } from 'antd';
import { Headline,BreadCrumb } from 'qmkit';

import Appstore from './store';
import FlashSaleGoodsForm from './components/flash-sale-goods-form';

const FlashSaleGoodsFormBox = Form.create()(FlashSaleGoodsForm as any);
const FlashSaleGoodsRelax = Relax(FlashSaleGoodsFormBox);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class PointsGoodsInfo extends Component<any, any> {
  store: Appstore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { activityDate, activityTime } = this.props.match.params;
    this.store.init({activityDate, activityTime});
  }

  render() {
    return [
      <BreadCrumb/>,
      // <Breadcrumb separator=">" key="Breadcrumb">
      //   <Breadcrumb.Item>营销管理</Breadcrumb.Item>
      //   <Breadcrumb.Item>营销中心</Breadcrumb.Item>
      //   <Breadcrumb.Item>整点秒杀</Breadcrumb.Item>
      // </Breadcrumb>,
      <div className="container" key="container">
        <Headline title="添加商品"/>
        <div style={styles.container}>
          <FlashSaleGoodsRelax/>
        </div>
      </div>
    ];
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row'
  }
} as any;
