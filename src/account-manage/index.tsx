import React from 'react';
import { Tabs, Form } from 'antd';
import { Headline } from 'qmkit';
import AccountInfo from './components/account-info';
import SecurityCenter from './components/security-center';
import AccountModal from './components/account-modal';
import AppStore from './store';
import { StoreProvider } from 'plume2';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class AccountManage extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.store.init();
  }

  render() {
    const AccountInfoForm = Form.create({})(AccountInfo);
    return (
      <div className="container">
        <Headline title="账号管理" />
        <Tabs>
          <Tabs.TabPane tab="账号信息" key="1">
            <AccountInfoForm />
          </Tabs.TabPane>
          <Tabs.TabPane tab="安全中心" key="2">
            <SecurityCenter />
          </Tabs.TabPane>
        </Tabs>

        <AccountModal />
      </div>
    );
  }
}
