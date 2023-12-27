import React from 'react';
import { Steps, Form } from 'antd';
import { StoreProvider } from 'plume2';

import AppStore from './store';
import Header from './components/head';
import StepOne from './components/step-one';
import StepTwo from './components/step-two';
import StepThree from './components/step-three';
import StepFour from './components/step-four';
import BrandModal from './components/brand-modal';
import SortsModal from './components/sort-modal';

const StepOneForm = Form.create()(StepOne);
const StepTwoForm = Form.create()(StepTwo);
const StepThreeForm = Form.create()(StepThree);
const StepFourForm = Form.create()(StepFour);
const SortsForm = Form.create()(SortsModal);
const BrandForm = Form.create()(BrandModal); //品牌弹框
const Step = Steps.Step;

const PAIN = {
  0: <StepOneForm />,
  1: <StepTwoForm />,
  2: <StepThreeForm />,
  3: <StepFourForm />
};

@StoreProvider(AppStore, { debug: __DEV__ })
export default class ShopInfoEdit extends React.Component<any, any> {
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
        />
        <div className="shopContent">
          <h1>开店申请审核未通过</h1>
          <Steps current={currentStep}>
            <Step title="基本信息" />
            <Step title="工商信息" />
            <Step title="签约信息" />
            <Step title="财务信息" />
          </Steps>
          <div className="steps-content" style={{ marginTop: 20 }}>
            {PAIN[currentStep]}
          </div>
        </div>

        {/* 签约品牌弹框 */}
        <BrandForm />

        {/* 签约类目弹框*/}
        <SortsForm />
      </div>
    );
  }
}
