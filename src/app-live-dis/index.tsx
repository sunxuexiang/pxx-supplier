import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import { Breadcrumb } from 'antd';
import LiveTabs from './components/tabs';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class LiveDetailIndex extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { id } = this.props.match.params;
    this.store.init(id);
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
          <Breadcrumb.Item>
            <a
              href={`/live-manage-list/${
                this.store.state().toJS().detail.liveRoomId
              }`}
            >
              直播管理
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>直播详情</Breadcrumb.Item>
        </Breadcrumb>
        {/* <BreadCrumb thirdLevel={true}>
          <Breadcrumb.Item>直播详情</Breadcrumb.Item>
        </BreadCrumb> */}
        <div className="container">
          {/* 头部标题 */}
          <Headline title="直播详情" />
          <LiveTabs />
          {/* <Detail /> */}
        </div>
      </div>
    );
  }
}
