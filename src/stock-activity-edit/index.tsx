import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert, Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import StockActivityForm from './components/form';
// import * as Enum from './common-components/marketing-enum';

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
    const { marketingId ,type} = this.props.match.params;
    if(type) {
      this.store.setType(type);
    }
    if (marketingId) {
      this.store.init(marketingId);
    }
  }

  render() {
    const WrappedForm = Form.create()(StockActivityForm);
    const { marketingId,type } = this.props.match.params;
    const state = this.props.location.state;
    const { source } = (state || {}) as any;
    return (
      <AuthWrapper functionName="f_marketing_reduction_add">
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>
              {marketingId ? '编辑' : '创建'}囤货活动
            </Breadcrumb.Item>
          </BreadCrumb>

          <div className="container">
            <Headline title={marketingId ? '编辑囤货活动' : '创建囤货活动'} />
            <Alert  message="同一个时间段内，只能有一场囤货活动在进行中状态" type="info" showIcon/>
            <WrappedForm
              ref={(form) => (this._form = form)}
              {...{
                store: this.store,
                fztype: type,
                marketingId: marketingId,
                // marketingType: Enum.MARKETING_TYPE.FULL_REDUCTION
              }}
            />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
