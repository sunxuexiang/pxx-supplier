import React, { Component } from 'react';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Breadcrumb } from 'antd';
import SearchHead from './components/search-head';
import List from './components/list';
import { AuthWrapper,BreadCrumb } from 'qmkit';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class OperationLog extends Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_operation_log_list">
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>站点设置</Breadcrumb.Item>
            <Breadcrumb.Item>操作日志</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <SearchHead />
            <List />
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
