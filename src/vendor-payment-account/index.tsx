//收款账户-商家收款账户
import React from 'react';
import { StoreProvider } from 'plume2';
import { Breadcrumb, Form, Alert } from 'antd';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';
import AppStore from './store';
import Info from './components/info';
import ButtonGroup from './components/button-group';
import List from './components/list';
import AccountModal from './components/account-modal';
import MoneyModal from './components/money-modal';
import DeleteModal from './components/delete-modal';
import MainModal from './components/main-modal';

const AccountModalForm = Form.create({})(AccountModal);

let factory = React.createFactory('div');
let child1 = factory(null, '操作说明:');
let child2 = factory(
  null,
  '该账户为平台与您进行结算的账户，如果账号有变更请走变更操作'
);
let tips = React.createElement('div', null, child1, child2);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VendorPaymentAccount extends React.Component<any, any> {
  componentDidMount() {
    this.store.init();
  }

  store: AppStore;

  render() {
    return (
      <AuthWrapper functionName="fetchAllOfflineAccounts">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>财务</Breadcrumb.Item>
            <Breadcrumb.Item>收款账户</Breadcrumb.Item>
            <Breadcrumb.Item>商家收款账户</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="商家收款账户" />
            <Alert message={tips} type="info" showIcon />
            <Info />

            {/* 商家入驻需求 只有一个收款账号 故此处隐藏 */}
            <ButtonGroup />

            {/*表格*/}
            <List />

            {/*变更当前收款账户*/}
            <AccountModalForm />

            {/*收到打款*/}
            <MoneyModal />

            {/*删除账号*/}
            <DeleteModal />

            <MainModal />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
