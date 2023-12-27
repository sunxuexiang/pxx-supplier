import React from 'react';

import { Breadcrumb } from 'antd';

import { Headline,BreadCrumb } from 'qmkit';
import { StoreProvider } from 'plume2';

import ReportList from './components/list';
import AppStore from './store';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class DownloadReport extends React.Component<any, any> {
  store: AppStore;

  componentWillMount() {
    this.store.init();
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <BreadCrumb/>
        {/* <Breadcrumb separator=">">
          <Breadcrumb.Item>数谋</Breadcrumb.Item>
          <Breadcrumb.Item>统计报表</Breadcrumb.Item>
          <Breadcrumb.Item>报表下载</Breadcrumb.Item>
        </Breadcrumb> */}
        <div className="container">
          <Headline title="报表下载" />
          <ReportList />
        </div>
      </div>
    );
  }
}
