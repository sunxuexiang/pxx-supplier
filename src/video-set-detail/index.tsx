import React from 'react';
import { StoreProvider } from 'plume2';
import { Headline, BreadCrumb } from 'qmkit';
import AppStore from './store';
import { Form } from 'antd';
import VideoDetail from './components/video-detail';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VideoSetting extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    const { videoId } = this.props.match.params;
    this.store.init(videoId);
  }

  render() {
    return (
      <div>
        {/*导航面包屑*/}
        <BreadCrumb />
        <div className="container customer">
          <Headline title="小视频详情" />

          <VideoDetail />
        </div>
      </div>
    );
  }
}
