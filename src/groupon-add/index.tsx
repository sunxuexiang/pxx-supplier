import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import AddForm from './components/add-form';

import Appstore from './store';

const WrappedForm = Form.create()(AddForm);

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
    const isEdit = this.store.state().get('isEdit');
    return [
      <BreadCrumb thirdLevel={true}>
        <Breadcrumb.Item>{isEdit ? '编辑拼团商品' : '添加拼团商品'} </Breadcrumb.Item>
      </BreadCrumb>
      ,

      <div className="container" key="container">
        <Headline title={isEdit ? '编辑拼团商品' : '添加拼团商品'} />
        <Alert
          message={
            <div>
              <p>-商品同一时间段仅可参与一个拼团</p>
              <p>
                -拼团活动独立于其他营销活动，仅通过拼团频道进行参与，可使用优惠券
              </p>
              <p>-同一商品下sku商品需同时参与该拼团活动</p>
            </div>
          }
          type="info"
        />
        <WrappedForm ref={(form) => (this._form = form)} />
      </div>
    ];
  }
}
