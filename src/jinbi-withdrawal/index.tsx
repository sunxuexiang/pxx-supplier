import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert } from 'antd';
import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';

import WithdrawalForm from './components/withdrawal-form';

import AppStore from './store';

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class JinbiWithdrawal extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    const step = this.store.get('step');
    return (
      <AuthWrapper functionName={'f_jinbi_withdrawal'}>
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>鲸币提现</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container">
            <Headline title="鲸币提现" />
            <Alert
              message={
                <div>
                  <p>提现说明：</p>
                  <p>1、提现支持小数，支持全额提现；</p>
                  <p>
                    2、商家提现到账账号默认为“商户分账的建行账号”，如需要更换银行卡请重新编辑；
                  </p>
                </div>
              }
              type="info"
            />
            <WithdrawalForm />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
