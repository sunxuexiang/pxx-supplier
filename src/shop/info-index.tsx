import React from 'react';
import { Steps, Form } from 'antd';
import { StoreProvider } from 'plume2';

import { history } from 'qmkit';
import AppStore from './store';
import Header from './components/head';
import StepOne from './detailcomponents/step-one';
import StepTwo from './detailcomponents/step-two';
import StepThree from './detailcomponents/step-three';
import StepFour from './detailcomponents/step-four';

const StepOneForm = Form.create()(StepOne);
const StepTwoForm = Form.create()(StepTwo);
const StepThreeForm = Form.create()(StepThree);
const StepFourForm = Form.create()(StepFour);
const Step = Steps.Step;

const PAIN = {
  0: <StepOneForm />,
  1: <StepTwoForm />,
  2: <StepThreeForm />,
  3: <StepFourForm />
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class ShopInfo extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
  }

  render() {
    const currentStep = this.store.state().get('currentStep');
    const header = this.store.state().get('header');
    return (
      <div>
        <Header
          preTxt={header.get('preTxt')}
          postTxt={header.get('postTxt')}
          text={header.get('text')}
          errTxt={header.get('errTxt')}
          bottomErrTxt={header.get('bottomErrTxt')}
          btnShow={header.get('btnShow')}
          btnTxt={header.get('btnTxt')}
          btnClick={() => this._onSave()}
        />
        <div className="shopContent">
          <h1>
            {header.get('btnShow') ? '开店申请审核未通过' : '开店申请审核中'}
          </h1>
          <Steps current={currentStep}>
            <Step
              title="基本信息"
              onClick={() => this.store.setCurrentStep(0)}
            ></Step>
            <Step
              title="工商信息"
              onClick={() => this.store.setCurrentStep(1)}
            ></Step>
            <Step
              title="签约信息"
              onClick={() => this.store.setCurrentStep(2)}
            ></Step>
            <Step
              title="财务信息"
              onClick={() => this.store.setCurrentStep(3)}
            ></Step>
          </Steps>
          <div className="steps-content" style={{ marginTop: 20 }}>
            {PAIN[currentStep]}
          </div>
        </div>
      </div>
    );
  }

  /**
   * 跳转编辑页面
   * @private
   */
  _onSave = () => {
    history.push('/shop-info-edit');
  };
}
