import React from 'react';
import { Breadcrumb, Form } from 'antd';
import { StoreProvider, Relax } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import TopTips from './components/top-tips';
import LiveInfo from './components/live-info';

const LiveInfoForm = Form.create()(LiveInfo);

@StoreProvider(AppStore, { debug: __DEV__ })
export default class InfoIndex extends React.Component<any, any> {
  store: AppStore;
  _form;

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <BreadCrumb />

        <div className="container">
          {/* 头部标题 */}
          <Headline title="创建直播" />

          {/* 页面提示 */}
          <TopTips />

          {/* 直播信息 */}
          <LiveInfoForm />
        </div>
      </div>
    );
  }
}
