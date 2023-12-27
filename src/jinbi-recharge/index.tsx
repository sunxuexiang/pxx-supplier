import React from 'react';

import { StoreProvider } from 'plume2';
import { Breadcrumb, Alert } from 'antd';
import { AuthWrapper, Headline, BreadCrumb } from 'qmkit';
import StepOne from './components/step-one';
import StepTow from './components/step-two';
import { webimLogout } from './webIm';

import AppStore from './store';

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class JinbiRecharge extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  componentWillUnmount(): void {
    webimLogout(
      () => {
        console.log('登出成功');
      },
      () => {
        console.log('登出失败');
      }
    );
  }

  render() {
    const step = this.store.get('step');
    return (
      <AuthWrapper functionName={'f_jinbi_recharge'}>
        <div>
          <BreadCrumb thirdLevel={true}>
            <Breadcrumb.Item>鲸币充值</Breadcrumb.Item>
          </BreadCrumb>
          <div className="container">
            <Headline title="鲸币充值" />
            <Alert
              message={
                <div>
                  <p>充值说明：</p>
                  <p>
                    1、请先确定需要充值鲸币的数值，1鲸币=1元，只支持充值整数；
                  </p>
                  <p>2、充值方式只支持微信和支付宝；</p>
                </div>
              }
              type="info"
            />
            {step === 1 && <StepOne />}
            {step === 2 && <StepTow />}
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
