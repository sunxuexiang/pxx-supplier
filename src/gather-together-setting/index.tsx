import React from 'react';
import { Form, Breadcrumb } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import SettingForm from './components/setting-form';
import { Store } from 'plume2';
import { StoreProvider } from 'plume2';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class GatherTogetherSetting extends React.Component<any, any> {
  store: AppStore;

  _store: Store;
  constructor(props) {
    super(props);
    console.log(this, '这个值');
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const SettingFormDetail = Form.create({})(SettingForm);

    return (
      <AuthWrapper functionName="f_gather_together_setting">
        <div>
          <BreadCrumb />
          <div className="container">
            <Headline title="凑箱设置" />
            <SettingFormDetail />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
