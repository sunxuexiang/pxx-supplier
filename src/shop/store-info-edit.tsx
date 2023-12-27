import React from 'react';
import { Form, Breadcrumb, Tabs } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';

import AppStore from './store';
import StepOne from './editcomponents/step-one-edit';
import StepTwo from './editcomponents/step-two-edit';
import StepThree from './editcomponents/step-three-edit';
import StepFour from './editcomponents/step-four-edit';
import BrandModal from './components/brand-modal';
import SortsModal from './components/sort-modal';
import CheckboxModal from './components/checkbox-modal';

const StepOneForm = Form.create()(StepOne);
const StepTwoForm = Form.create()(StepTwo);
const StepThreeForm = Form.create()(StepThree);
const StepFourForm = Form.create()(StepFour);
const SortsForm = Form.create()(SortsModal);
const BrandForm = Form.create()(BrandModal); //品牌弹框

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
    this.store.init(true);
  }

  render() {
    const currentTab = this.store.state().get('tabsStep');
    return (
      <div>
        <BreadCrumb>
          <Breadcrumb.Item>店铺信息编辑</Breadcrumb.Item>
        </BreadCrumb>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>店铺设置</Breadcrumb.Item>
          <Breadcrumb.Item>店铺信息</Breadcrumb.Item>
          <Breadcrumb.Item>店铺信息编辑</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="店铺信息编辑" />
          <Tabs
            onChange={(key) => this.store.setCurrentTab(key)}
            activeKey={currentTab}
          >
            <Tabs.TabPane tab="基本信息" key="0" />
            <Tabs.TabPane tab="工商信息" key="1" />
            <Tabs.TabPane tab="签约信息" key="2" />
            <Tabs.TabPane tab="财务信息" key="3" />
          </Tabs>
          <div className="steps-content" style={{ marginTop: 20 }}>
            {PAIN[currentTab]}
          </div>
          {/* 签约品牌弹框 */}
          <BrandForm />
          {/* 签约类目弹框*/}
          <SortsForm />
          {/* 签约批发市场/商城分类弹框*/}
          <CheckboxModal />
        </div>
      </div>
    );
  }
}
