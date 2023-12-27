import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import CateList from './component/cate-list';
import CateModal from './component/cate-modal';
import Tool from './component/tool';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsCate extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>店铺分类</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="商品类目" />
          <Alert
            message="商品类目为您店铺范围内的商品分类，最多可添加1个层级，没有任何分类时，所有商品将会归类到默认分类"
            type="info"
          />

          {/*工具条*/}
          <Tool />

          {/*列表*/}
          <CateList />

          {/*弹框*/}
          <CateModal />
        </div>
      </div>
    );
  }
}
