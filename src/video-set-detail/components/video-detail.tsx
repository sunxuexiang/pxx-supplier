import React from 'react';
import { Row, Col, Form, Icon, Button } from 'antd';
import { Relax } from 'plume2';
import { history, Const } from 'qmkit';
import Moment from 'moment';
const defaultImg = require('../images/video.png');

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
    xs: { span: 6 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 14,
    xs: { span: 14 },
    sm: { span: 18 }
  }
};

@Relax
export default class settingForm extends React.Component<any, any> {
  props: {
    relaxProps?: {
      settings: any;
      videoId: any;
    };
  };

  static relaxProps = {
    settings: 'settings',
    videoId: 'videoId'
  };

  render() {
    const { settings, videoId } = this.props.relaxProps;

    return (
      <div>
        <Row>
          <Col span={18}>
            <FormItem
              required={true}
              {...formItemLayout}
              label="小视频名称："
              hasFeedback
            >
              <span>{settings.get('videoName')}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              required={true}
              {...formItemLayout}
              label="创建时间："
              hasFeedback
            >
              <span>
                {settings.get('createTime')
                  ? Moment(settings.get('createTime'))
                      .format(Const.TIME_FORMAT)
                      .toString()
                  : ''}
              </span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              required={true}
              {...formItemLayout}
              label="小视频状态："
              hasFeedback
            >
              <span>{settings.get('state') == 0 ? '上架' : '下架'}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem
              required={true}
              {...formItemLayout}
              label="添加小视频"
              hasFeedback
            >
              <div className="ant-upload-list ant-upload-list-picture-card">
                <div className="ant-upload-list-item ant-upload-list-item-done">
                  <div className="ant-upload-list-item-info">
                    <span>
                      <a
                        className="ant-upload-list-item-thumbnail"
                        href=""
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={defaultImg} />
                      </a>
                    </span>
                  </div>
                  <span className="ant-upload-list-item-actions">
                    <i
                      className="anticon anticon-eye-o"
                      onClick={() =>
                        this._videoDetail(settings.get('artworkUrl'))
                      }
                    >
                      <Icon type="eye" />
                    </i>
                  </span>
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem {...formItemLayout} label="小视频商品：" hasFeedback>
              <span>{settings.get('goodsInfoName')}</span>
            </FormItem>
          </Col>
        </Row>
        <div className="bar-button">
          <Button
            type="primary"
            onClick={() => {
              history.push({
                pathname: `/video-create/${videoId}`
              });
            }}
          >
            编辑
          </Button>
        </div>
      </div>
    );
  }

  _videoDetail = (videoUrl: string) => {
    //打开新页面播放视频
    let tempWindow = window.open();
    tempWindow.location.href = `/video-detail?videoUrl=${videoUrl}`;
  };
}
