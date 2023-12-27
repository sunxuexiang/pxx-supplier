import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Alert, Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb, AuthWrapper } from 'qmkit';
import RegisteredAddForm from './components/add-form';

import Appstore from './store';

const WrappedForm = Form.create()(RegisteredAddForm);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
  store: Appstore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { advertisingId } = this.props.match.params;
    if (advertisingId) {
      this.store.init(advertisingId);
    }
  }

  render() {
    const id = this.store.state().getIn(['activity', 'advertisingId']);
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return [
      // <AuthWrapper functionName={'f_coupon_addclass'}>
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>{id ? '编辑' : '创建'}分栏推荐位</Breadcrumb.Item>
      </BreadCrumb>,
      <div className="container" key="container">
        <Headline title={id ? '编辑分栏推荐位' : '创建分栏推荐位'} />
        <WrappedForm ref={(form) => (this._form = form)} />
      </div>
      // </AuthWrapper>
    ];
  }
}
