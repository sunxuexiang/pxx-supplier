import React from 'react';
import { Row, Col, Button } from 'antd';

import AppStore from './store';

import { StoreProvider } from 'plume2';
import { AuthWrapper, history, cache, Headline, BreadCrumb } from 'qmkit';

import CateList from './component/cate-list';
import VidelTab from './component/video-tab';

@StoreProvider(AppStore, { debug: __DEV__ })
export default class VideoTutorial extends React.Component<any, any> {
  store: AppStore;

  state = {
    auditPass: this.props.match.path !== '/video-tutorial-notpass'
  };

  componentDidMount() {
    this.store.init();
  }

  render() {
    const { auditPass } = this.state;
    return (
      <AuthWrapper functionName="f_videoStore_show">
        <div>
          {auditPass && <BreadCrumb />}
          <div className="container">
            <Headline title="视频教程" />
            <div>
              <Row>
                <Col span={4}>
                  {/*分类列表*/}
                  <CateList />
                </Col>
                <Col span={1} />
                <Col span={19}>
                  <VidelTab showBackBtn={!auditPass} backPage={this.backPage} />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }
  backPage = () => {
    const { auditPass } = this.state;
    if (!auditPass) {
      history.push('/shop-process');
    }
  };
}
