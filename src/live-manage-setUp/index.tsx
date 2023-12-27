import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import { Breadcrumb } from 'antd';
import LiveTabs from './components/tabs';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LiveSetUpDetailIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { liveRoomId } = this.props.match.params;
    this.store.init(liveRoomId);
  }

  render() {
    return (
      <div>
        {/* 面包屑导航 */}
        <Breadcrumb separator=">">
          <Breadcrumb.Item>应用</Breadcrumb.Item>
          <Breadcrumb.Item>APP直播</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href={'live-manage'}>直播间管理</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>直播管理设置</Breadcrumb.Item>
        </Breadcrumb>

        <div className="container">
          {/* 头部标题 */}
          <Headline title="直播管理设置" />
          <LiveTabs />
        </div>
      </div>
    );
  }
}
