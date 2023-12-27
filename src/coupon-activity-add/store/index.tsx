import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import { Alert, Breadcrumb, Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import StoreForm from './components/add-form';

import Appstore from './store';

const WrappedForm = Form.create()(StoreForm);

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
      <BreadCrumb thirdLevel={true} >
        {/* <Breadcrumb.Item>
          {source == 'marketCenter' ? '营销中心' : '优惠券活动'}
        </Breadcrumb.Item> */}
        <Breadcrumb.Item>{id ? '编辑' : '创建'}进店赠券活动</Breadcrumb.Item>
      </BreadCrumb>,
      // <Breadcrumb separator=">" key="Breadcrumb">
      //   <Breadcrumb.Item>营销</Breadcrumb.Item>
      //   <Breadcrumb.Item>平台营销管理</Breadcrumb.Item>
      //   <Breadcrumb.Item>
      //     {source == 'marketCenter' ? '营销中心' : '优惠券活动'}
      //   </Breadcrumb.Item>
      //   <Breadcrumb.Item>{id ? '编辑' : '创建'}进店赠券活动</Breadcrumb.Item>
      // </Breadcrumb>,
      <div className="container" key="container">
        <Headline title={id ? '编辑进店赠券活动' : '创建进店赠券活动'} />
        <Alert
          message={
            <div>
              <p>操作说明：</p>
              <p>
                最近3个月未在本店下过单的客户，进入店铺主页时默认赠送一组优惠券；
              </p>
              <p>
                一组优惠券中每张优惠券的赠送张数最多支持10张，活动在领取组数达到上限后停止；
              </p>
              <p>
                同一时间只生效一个进店赠券活动，已创建进店赠券活动的日期不可被再次选择；
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
