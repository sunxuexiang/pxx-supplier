import React from 'react';
import { Row, Col, Breadcrumb } from 'antd';

import { Headline, AuthWrapper,BreadCrumb } from 'qmkit';
import AppStore from './store';

import VideoList from './component/video-list';
import MoveVideoModal from './component/moveVideo-modal';
import UploadVideoModal from './component/uploadVideo-modal';
import CateModal from './component/cate-modal';
import CateList from './component/cate-list';
import Tool from './component/tool';
import { StoreProvider } from 'plume2';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VideoStore extends React.Component<any, any> {
  store: AppStore;

  componentDidMount() {
    this.store.init();
  }

  render() {
    return (
      <AuthWrapper functionName="f_videoStore_0">
        <div>
          <BreadCrumb/>
          {/* <Breadcrumb separator=">">
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>素材管理</Breadcrumb.Item>
            <Breadcrumb.Item>视频库</Breadcrumb.Item>
          </Breadcrumb> */}
          <div className="container">
            <Headline title="视频库" />
            <div>
              <Row>
                <Col span={4}>
                  {/*分类列表*/}
                  <CateList />
                </Col>
                <Col span={1} />
                <Col span={19}>
                  {/*工具条*/}
                  <Tool />

                  {/*视频列表*/}
                  <VideoList />

                  {/*弹框*/}
                  <CateModal />
                  <MoveVideoModal />
                  <UploadVideoModal />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
}
