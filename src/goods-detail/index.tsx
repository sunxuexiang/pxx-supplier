import React from 'react';
import { Breadcrumb, message } from 'antd';
import { StoreProvider } from 'plume2';

import { Const, Headline, BreadCrumb } from 'qmkit';
import Tab from './components/tab';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GoodsDetail extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { gid } = this.props.match.params;
    if (gid != 'null') {
      this.store.init(gid);
    } else {
      message.error('该商品已删除');
    }
  }

  render() {
    const { gid } = this.props.match.params;

    return (
      <div>
        <BreadCrumb>
          <Breadcrumb.Item>商品详情</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品管理</Breadcrumb.Item>
          <Breadcrumb.Item>待审核商品</Breadcrumb.Item>
          <Breadcrumb.Item>商品详情</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="商品详情">
            <s>{this._getState(gid)}</s>
          </Headline>
          <Tab />
        </div>
      </div>
    );
  }

  /**
   * 展示商品状态
   * @param t_gid
   * @returns {any}
   * @private
   */
  _getState(t_gid) {
    // 已保存的才有这种状态
    if (t_gid) {
      const auditStatus = this.store.state().getIn(['goods', 'auditStatus']);
      return Const.goodsState[auditStatus];
    }

    return null;
  }
}
