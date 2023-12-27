import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import AddForm from './components/add-form';

import Appstore from './store';

const WrappedForm = Form.create()(AddForm);

@StoreProvider(Appstore, { debug: __DEV__ })
export default class CouponInfo extends Component<any, any> {
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
    const id = this.store.state().getIn(['activity', 'activityId']);
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return [
      <BreadCrumb thirdLevel={true}>
        {/* <Breadcrumb.Item>
          {source == 'marketCenter' ? '营销中心' : '优惠券活动'}
        </Breadcrumb.Item> */}
        <Breadcrumb.Item>{id ? '编辑' : '创建'}全场赠券活动</Breadcrumb.Item>
      </BreadCrumb>,
      // <Breadcrumb separator=">" key="Breadcrumb">
      //   <Breadcrumb.Item>营销</Breadcrumb.Item>
      //   <Breadcrumb.Item>营销设置</Breadcrumb.Item>
      //   <Breadcrumb.Item>
      //     {source == 'marketCenter' ? '营销中心' : '优惠券活动'}
      //   </Breadcrumb.Item>
      //   <Breadcrumb.Item>{id ? '编辑' : '创建'}全场赠券活动</Breadcrumb.Item>
      // </Breadcrumb>,
      <div className="container" key="container">
        <Headline title={id ? '编辑全场赠券活动' : '创建全场赠券活动'} />
        <Alert
          message={
            <div>
              <p>操作说明：</p>
              <p>
                活动时间内有效的优惠券会在前端展示，用户可在领券中心、活动专题页或是商品详情页领取；
              </p>
              <p>
                同一优惠券每位客户每次只可领取1张，每个订单只可使用1张，使用后可重新领取；
              </p>
            </div>
          }
          type="info"
        />
        <WrappedForm ref={(form) => (this._form = form)} />
      </div>
    ];
  }
}
