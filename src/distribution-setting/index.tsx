import React from 'react';
import { Form, Breadcrumb } from 'antd';
import { Headline, AuthWrapper,BreadCrumb } from 'qmkit';
import SettingForm from './components/setting-form';
import { StoreProvider } from 'plume2';
import AppStore from './store';

const SettingFormDetail = Form.create({})(SettingForm);

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
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>营销</Breadcrumb.Item>
          <Breadcrumb.Item>社交分销</Breadcrumb.Item>
          <Breadcrumb.Item>分销设置</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="分销设置" />
          <AuthWrapper functionName={'f_store_distribution_setting_view'}>
            <SettingFormDetail ref={(form) => (this['_form'] = form)} />
          </AuthWrapper>
        </div>
      </div>
    );
  }
}
