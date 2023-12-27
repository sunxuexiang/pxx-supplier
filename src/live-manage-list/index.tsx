import React from 'react';
import { Breadcrumb } from 'antd';
import { StoreProvider } from 'plume2';
import { Headline, AuthWrapper } from 'qmkit';
import AppStore from './store';

// import OpenStatus from './components/open-status';
import LiveTabs from './components/live-tabs';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class Index extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { liveRoomId } = this.props.match.params;
    this.store.init(liveRoomId);
  }

  render() {
    //取直播功能开关状态
    // const openStatus = this.store.state().get('openStatus');

    return (
      <div>
        <AuthWrapper functionName="f_live_manage_list">
          {/* 面包屑导航 */}
          <Breadcrumb separator=">">
            <Breadcrumb.Item>应用</Breadcrumb.Item>
            <Breadcrumb.Item>APP直播</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href={'/live-manage'}>直播间管理</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>直播管理</Breadcrumb.Item>
          </Breadcrumb>
          <div className="container">
            {/* 头部标题 */}
            {/* <Headline title="APP直播" /> */}

            {/* 头部开通状态 */}
            {/* <OpenStatus /> */}

            {/* tab页 */}
            {/* {openStatus && <LiveTabs />} */}
            <LiveTabs />
          </div>
        </AuthWrapper>
      </div>
    );
  }
}
