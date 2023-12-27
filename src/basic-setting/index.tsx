import React from 'react';
import { Form } from 'antd';
import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import SettingForm from './components/setting-form';

const SettingFormDetail = Form.create({})(SettingForm);
export default class BasicSetting extends React.Component<any, any> {
  constructor(props) {
    super(props);
    console.log(this, '这个值');
  }

  render() {
    return (
      <AuthWrapper functionName="f_basicSetting_0">
        <div>
          <BreadCrumb />
          <div className="container">
            <Headline title="基本设置" />
            <SettingFormDetail />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
