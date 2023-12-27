import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import MarketingAddForm from '../common-components/marketing-add-form';
import * as Enum from '../common-components/marketing-enum';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class MarketingFullGiftAdd extends React.Component<any, any> {
  store: AppStore;
  _form;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { marketingId,type } = this.props.match.params;
    if(type) {
      this.store.setType(type);
    }
    if (marketingId) {
      this.store.init(marketingId);
    }
  }

  render() {
    const WrappedForm = Form.create()(MarketingAddForm);
    const { marketingId,type } = this.props.match.params;
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return (
      <AuthWrapper functionName="f_marketing_gift_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              {marketingId ? '编辑' : '创建'}满赠活动
            </Breadcrumb.Item>
          </BreadCrumb>
          <div className="container">
            <Headline title={marketingId ? '编辑满赠活动' : '创建满赠活动'} />
            <Alert
              message="同一商品同一时间可参加不同类型的促销活动，但同一类型的活动只能参加1个（该类型为满数量赠、满金额赠）"
              type="info"
              showIcon
            />

            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                fztype: type,
                store: this.store,
                marketingType: Enum.MARKETING_TYPE.FULL_GIFT
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
