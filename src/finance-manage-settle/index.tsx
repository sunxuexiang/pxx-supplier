//资金管理-财务结算
import React from 'react';
import { Breadcrumb, Button } from 'antd';

import { StoreProvider } from 'plume2';

import { Headline, AuthWrapper, BreadCrumb } from 'qmkit';

import AppStore from './store';
import SearchForm from './components/search-form';
import TabList from './components/tab-list';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class FinancialSettlement extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_finance_manage_settle">
        <div>
          <BreadCrumb />
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>财务</Breadcrumb.Item>
            <Breadcrumb.Item>资金管理</Breadcrumb.Item>
            <Breadcrumb.Item>财务结算</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline
              title="财务结算"
              smallTitle={`您的结算日是每月${this.store
                .state()
                .get(
                  'accountDay'
                )}日，当月不包含所设日期时，将会顺延到下一个结算日`}
            />

            <SearchForm />
            <AuthWrapper functionName="f_settle_export">
              <div style={{ paddingBottom: '16px' }}>
                <Button onClick={() => this.store.bulkExport()}>
                  批量导出
                </Button>
              </div>
            </AuthWrapper>
            {/* <ButtonGroup /> */}

            {/*财务结算表格*/}
            <TabList />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
