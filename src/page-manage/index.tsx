import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import AppStore from './store';
import { Headline, BreadCrumb } from 'qmkit';
import TabDataGrid from './components/tab-data-grid';
import PageModal from './components/page-modal';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Page extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const pathTmp = this.props.location.pathname;
    const paramArr = pathTmp.split('/');
    const name = paramArr[paramArr.length - 1];
    this.store.onTabChange(name);
  }
  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <div className="container">
          <Headline title="列表" />
          {/*列表*/}
          <TabDataGrid />
          {/*新增弹框*/}
          <PageModal />
        </div>
      </div>
    );
  }
}
