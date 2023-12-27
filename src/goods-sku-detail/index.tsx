import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb } from 'antd';

import { Const, Headline,BreadCrumb } from 'qmkit';
import Tab from './components/tab';

import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsSKUDetail extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { pid } = this.props.match.params;
    this.store.init(pid);
  }

  render() {
    const { pid } = this.props.match.params;

    return (
      <div>
        <BreadCrumb>
        <Breadcrumb.Item>商品SKU详情</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>待审核商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品SKU详情</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="商品SKU详情">
            <s>{this._getState(pid)}</s>
          </Headline>
          <Tab />
        </div>
      </div>
    );
  }

  /**
   * 展示商品状态
   * @param pid
   * @returns {any}
   * @private
   */
  _getState(pid) {
    // 已保存的才有这种状态
    if (pid) {
      const auditStatus = this.store.state().getIn(['spu', 'auditStatus']);
      return Const.goodsState[auditStatus];
    }

    return null;
  }
}
