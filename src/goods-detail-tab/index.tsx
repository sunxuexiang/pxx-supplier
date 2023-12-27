import React from 'react';
import { Breadcrumb, Alert } from 'antd';
import { StoreProvider } from 'plume2';

import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import TemplateList from './component/tab-list';
import TabModal from './component/tab-modal';
import Tool from './component/tool';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class StoreGoodsTab extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb></BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>详情模板</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="详情模板" />
          <Alert
            message="详情模板配置控制商品详情页面中，图文详情tab中展示内容，配置完成后，在商品添加时需进行维护后进行展示，特殊商品可在添加商品时自行进行维护"
            type="info"
          />

          {/*工具条*/}
          <Tool />

          {/*列表*/}
          <TemplateList />

          {/*弹框*/}
          <TabModal />
        </div>
      </div>
    );
  }
}
