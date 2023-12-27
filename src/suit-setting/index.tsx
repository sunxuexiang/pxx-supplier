import React from 'react';
import { Form, Breadcrumb } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import settingForms from './components/setting-form';
import { Store } from 'plume2';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class BasicSetting extends React.Component<any, any> {
  store: AppStore;

  _store: Store;
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const SettingFormDetail = Form.create({})(settingForms);

    return (
      <AuthWrapper functionName="f_basicSetting_3">
        <div>
          {/* <BreadCrumb /> */}
          <div className="container">
            <Headline title="套装设置" />
            <SettingFormDetail />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
