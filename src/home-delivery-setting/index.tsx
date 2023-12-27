import React from 'react';
import { Form } from 'antd';
import { Headline, BreadCrumb } from 'qmkit';
import SettingForm from './components/setting-form';
import { StoreProvider } from 'plume2';
import AppStore from './store';
const SettingFormDetail = Form.create()(SettingForm);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BasicSetting extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <div>
        <BreadCrumb />
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>设置</Breadcrumb.Item>
          <Breadcrumb.Item>站点设置</Breadcrumb.Item>
          <Breadcrumb.Item>基本设置</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="物流设置" />
          <SettingFormDetail />
        </div>
      </div>
    );
  }
}
