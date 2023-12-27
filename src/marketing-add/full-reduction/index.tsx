import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import MarketingAddForm from '../common-components/marketing-add-form';
import * as Enum from '../common-components/marketing-enum';

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingFullReductionAdd extends React.Component<
  any,
  any
> {
  store: AppStore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { marketingId, type } = this.props.match.params;
    if (type) {
      this.store.setType(type);
    }
    if (marketingId) {
      this.store.init(marketingId);
    }
  }

  render() {
    const WrappedForm = Form.create()(MarketingAddForm);
    const { marketingId, type } = this.props.match.params;
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return (
      <AuthWrapper functionName="f_marketing_reduction_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            {/* <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item> */}
            <Breadcrumb.Item>
              {marketingId ? '编辑' : '创建'}满减活动
            </Breadcrumb.Item>
          </BreadCrumb>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>营销</Breadcrumb.Item>
            <Breadcrumb.Item>营销设置</Breadcrumb.Item>
            <Breadcrumb.Item>
              {source == 'marketCenter' ? '营销中心' : '促销活动'}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {marketingId ? '编辑' : '创建'}满减活动
            </Breadcrumb.Item>
          </Breadcrumb> */}

          <div className="container">
            <Headline title={marketingId ? '编辑满减活动' : '创建满减活动'} />
            <Alert
              message="同一商品同一时间可参加不同类型的促销活动，但同一类型的活动只能参加1个（该类型为满数量减、满金额减）"
              type="info"
              showIcon
            />

            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                fztype: type,
                marketingId: marketingId,
                marketingType: Enum.MARKETING_TYPE.FULL_REDUCTION
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
