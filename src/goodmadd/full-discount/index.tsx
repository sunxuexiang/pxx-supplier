import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import MarketingAddForm from '../common-components/marketing-add-form';
import * as Enum from '../common-components/marketing-enum';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingFullDiscountAdd extends React.Component<
  any,
  any
> {
  store: AppStore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { marketingId } = this.props.match.params;
    console.log(
      marketingId,
      'marketingIdmarketingIdmarketingIdmarketingId',
      this.props.match.params
    );
    // console.log(this.props , '这是传过去的值')
    let s = this.props.location.pathname;
    // const state = this.props.location.state;
    let b = s.substr(s.lastIndexOf('?') + 1, 4);
    console.log(b); // 这是传值
    if (marketingId) {
      this.store.init(marketingId);
    }
  }

  render() {
    const WrappedForm = Form.create()(MarketingAddForm);
    const state = this.props.location.state;
    const { marketingId } = this.props.match.params;
    const { source } = (state || {}) as any;
    return (
      // <AuthWrapper functionName="f_marketing_discount_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            {/* <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item> */}
            <Breadcrumb.Item>
              {marketingId ? '编辑' : '创建'}套餐
            </Breadcrumb.Item>
          </BreadCrumb>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>营销设置</Breadcrumb.Item>
            <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {marketingId ? '编辑' : '创建'}满折活动
            </Breadcrumb.Item>
          </Breadcrumb> */}

          <div className="container">
            <Headline title={marketingId ? '编辑套餐' : '创建套餐'} />
            {/* <Alert
              message="同一商品同一时间可参加不同类型的促销活动，但只可参加一个满折活动；"
              type="info"
              showIcon
            /> */}

            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                marketingId: marketingId,
                marketingType: Enum.MARKETING_TYPE.FULL_DISCOUNT
              }}
            />
          </div>
        </div>
      // </AuthWrapper>
    );
  }
}
