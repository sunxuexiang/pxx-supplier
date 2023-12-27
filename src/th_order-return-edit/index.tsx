import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import ReturnOrderForm from './components/form';

const WrapperForm = Form.create({})(ReturnOrderForm);

/**
 * 修改退单
 */
@StoreProvider(AppStore, { debug: __DEV__ })
export default class OrderReturnEdit extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { rid } = this.props.match.params;
    this.store.init(rid);
  }

  render() {
    return (
      <div>
        <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>修改退单申请</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>订单</Breadcrumb.Item>
          <Breadcrumb.Item>订单管理</Breadcrumb.Item>
          <Breadcrumb.Item>退单列表</Breadcrumb.Item>
          <Breadcrumb.Item>修改退单申请</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="修改退单申请" />
          <WrapperForm />
        </div>
      </div>
    );
  }
}
