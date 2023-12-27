import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import TopTips from './components/top-tips';
import AddGoods from './components/add-goods';

const AddGoodsForm = Form.create()(AddGoods);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LiveGoodsAddIndex extends React.Component<any, any> {
  store: AppStore;
  _form;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb />

        <div className="container">
          {/* 头部标题 */}
          <Headline title="添加直播商品" />

          {/* 页面提示 */}
          <TopTips />

          <AddGoodsForm ref={(form) => (this._form = form)} />
        </div>
      </div>
    );
  }
}
