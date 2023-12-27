import * as React from 'react';
import { Relax } from 'plume2';
import { List } from 'immutable';
import { Row, Col, Button } from 'antd';
import { noop, WMVideo } from 'qmkit';
import { IMap } from 'plume2/es5/typings';

import 'video.js/dist/video-js.css';
import '../index.less';

@Relax
export default class VidelDetail extends React.Component<any, any> {
  props: {
    relaxProps?: {
      currentData: IMap; //当前打开的视频
      preData: IMap; //上条视频
      nextData: IMap; //下条视频
      closeVideoDetail: Function; // 关闭详情
      showPreDetail: Function;
      showNextDetail: Function;
    };
  };

  static relaxProps = {
    currentData: 'currentData',
    preData: 'preData',
    nextData: 'nextData',
    closeVideoDetail: noop,
    showPreDetail: noop,
    showNextDetail: noop
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  componentWillUpdate(
    nextProps: Readonly<any>,
    nextState: Readonly<any>,
    nextContext: any
  ): void {
    if (
      nextProps.relaxProps.currentData.get('artworkUrl') !==
      this.props.relaxProps.currentData.get('artworkUrl')
    ) {
      this.setState({ visible: true });
    }
  }

  render() {
    const { visible } = this.state;
    const {
      currentData,
      preData,
      nextData,
      closeVideoDetail,
      showPreDetail,
      showNextDetail
    } = this.props.relaxProps;
    const videoJsOptions = {
      autoplay: false,
      controls: true,
      with: 889,
      height: 500,
      sources: [
        {
          src: currentData.get('artworkUrl'),
          type: 'video/mp4'
        }
      ]
    };
    console.log(currentData.toJS(), 'currentData');
    return (
      <div className="vt-detail">
        <h3 className="vt-detail-title">{currentData.get('resourceName')}</h3>
        <div className="vt-detail-play">
          {visible && <WMVideo {...videoJsOptions} />}
        </div>
        <Row>
          <Col span={12}>
            {!preData && <Button type="link">上一篇：无</Button>}
            {preData && (
              <Button
                type="link"
                onClick={() => {
                  this.setState({ visible: false });
                  showPreDetail();
                }}
              >
                上一篇：{preData.get('resourceName')}
              </Button>
            )}
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            {!nextData && <Button type="link">下一篇：无</Button>}
            {nextData && (
              <Button
                type="link"
                onClick={() => {
                  this.setState({ visible: false });
                  showNextDetail();
                }}
              >
                下一篇：{nextData.get('resourceName')}
              </Button>
            )}
          </Col>
        </Row>
        <Button type="primary" onClick={() => closeVideoDetail()}>
          返回
        </Button>
      </div>
    );
  }
}
