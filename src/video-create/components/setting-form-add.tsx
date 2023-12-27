import React from 'react';
import { Row, Col, Icon, Button, Input, Form, Upload } from 'antd';
import PropTypes from 'prop-types';
import { Const, AuthWrapper, util } from 'qmkit';
import { fromJS } from 'immutable';
import { GoodsModal } from 'biz';
import { message } from 'antd';
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
const FILE_MAX_SIZE = 50 * 1024 * 1024;

export default class settingForm extends React.Component<any, any> {
  form;

  _store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      fileList: []
    };
  }

  render() {
    const _state = this._store.state();
    const goods = _state.get('goods');
    const settingForm = _state.get('settings');
    const setFileList = this._setFileList;
    const videoName = settingForm.get('videoName');
    const artworkUrl = settingForm.get('artworkUrl').toJS();
    const videoId = settingForm.get('videoId');
    const props = {
      name: 'uploadFile',
      multiple: false,
      showUploadList: {
        showPreviewIcon: false,
        showRemoveIcon: true,
        showDownloadIcon: false
      },
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      action: Const.HOST + '/videomanagement/uploadVideo',
      accept: '.mp4',
      beforeUpload(file) {
        let fileName = file.name.toLowerCase();

        if (!fileName.trim()) {
          message.error('请输入文件名');
          return false;
        }

        if (
          /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/.test(
            fileName
          )
        ) {
          message.error('请输入正确格式的文件名');
          return false;
        }

        if (fileName.length > 40) {
          message.error('文件名过长');
          return false;
        }

        //支持的视频格式,视频最大限制
        if (fileName.endsWith('.mp4')) {
          if (file.size <= FILE_MAX_SIZE) {
            return true;
          } else {
            message.error('文件大小不能超过50M');
            return false;
          }
        } else {
          message.error('文件格式错误');
          return false;
        }
      },
      onChange(info) {
        const status = info.file.status;
        let fileList = info.fileList;
        if (status === 'done') {
          if (
            info.file.response &&
            info.file.response.code &&
            info.file.response.code !== Const.SUCCESS_CODE
          ) {
            message.error(`${info.file.name} 上传失败！`);
          } else {
            message.success(`${info.file.name} 上传成功！`);
            //  this._store.settingFormChange('videoDetail',fileList)
          }
        } else if (status === 'error') {
          message.error(`${info.file.name} 上传失败！`);
        }
        //仅展示上传中和上传成功的文件列表
        fileList = fileList.filter(
          (f) =>
            f.status == 'uploading' ||
            (f.status == 'done' && !f.response) ||
            (f.status == 'done' && f.response && !f.response.code)
        );
        setFileList(fileList);
      },
      onRemove: (file) => {
        this.setState((state) => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList
          };
        });
      }
    };

    return (
      <Form style={{ paddingBottom: 50, maxWidth: 900 }}>
        <Row>
          <Col span={18}>
            <FormItem
              required={true}
              {...formItemLayout}
              label="小视频名称"
              hasFeedback
            >
              <Input
                size="large"
                placeholder="请输入小视频名称"
                value={videoName}
                maxLength={50}
                onChange={(e) => {
                  if (e.target.value.length >= 50) {
                    message.error('小视频名称1-50字符');
                  }
                  this._store.settingFormChange('videoName', e.target.value);
                }}
              />
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
              <div className="clearfix logoImg" style={{ paddingTop: 5 }}>
                <div>
                  <Upload {...props} fileList={this.state.fileList}>
                    {this.state.fileList.length < 1 && (
                      <Button>
                        <Icon type="upload" /> 点击上传视频
                      </Button>
                    )}
                  </Upload>
                </div>
                <p
                  style={{
                    lineHeight: '2em',
                    marginTop: '15px',
                    color: '#999'
                  }}
                >
                  支持最大50M，支持文件类型：mp4
                </p>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem {...formItemLayout} label="小视频商品" hasFeedback>
              <Button
                type="primary"
                onClick={() => this._store.modalVisible(true)}
              >
                选择商品
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Row>
              <Col span={12} offset={6}>
                {goods.get('goodsInfoId') && (
                  <div>
                    <span>{goods.get('goodsInfoName')}</span>
                    <Button type="link" onClick={this.delGood}>
                      删除
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>

        <AuthWrapper functionName="f_video_upload">
          <div className="bar-button">
            <Button type="primary" onClick={this._handleSubmit}>
              保存
            </Button>
          </div>
        </AuthWrapper>
        <GoodsModal
          visible={_state.get('visible')}
          //商家入驻需求 wareId传''
          // wareId={Number(marketingBean.get('wareId'))}
          wareId=""
          selectedSkuIds={
            goods.get('goodsInfoId') ? [goods.get('goodsInfoId')] : []
          }
          selectedRows={
            goods.get('goodsInfoId') ? fromJS([goods.toJS()]) : fromJS([])
          }
          onOkBackFun={this.skuSelectedBackFun}
          onCancelBackFun={this.closeGoodsModal}
          limitNOSpecialPriceGoods={true}
          needHide
          onlyOne
          showThirdColumn={util.isThirdStore()}
        />
      </Form>
    );
  }

  skuSelectedBackFun = (selectedSkuIds, selectedRows) => {
    if (selectedSkuIds.length > 0) {
      const rowData = selectedRows.toJS()[0];
      this._store.goodsChange('goodsId', rowData.goodsId);
      this._store.goodsChange('goodsInfoId', rowData.goodsInfoId);
      this._store.goodsChange('goodsInfoName', rowData.goodsInfoName);
      this._store.modalVisible(false);
    } else {
      this._store.modalVisible(false);
    }
  };

  closeGoodsModal = () => {
    this._store.modalVisible(false);
  };

  delGood = () => {
    this._store.goodsChange('goodsId', '');
    this._store.goodsChange('goodsInfoId', '');
    this._store.goodsChange('goodsInfoName', '');
  };

  _videoDetail = (videoUrl: string) => {
    //打开新页面播放视频
    let tempWindow = window.open();
    tempWindow.location.href = `/video-detail?videoUrl=${videoUrl}`;
  };
  _removeVideo = () => {
    this.setState({ fileList: [] });
  };

  /**
   * 选择视频
   * @param info 上传的视频信息
   * @private
   */
  _setFileList = (fileList) => {
    this.setState({ fileList });
  };

  _handleSubmit = () => {
    (this._store as any).addVideo(
      this.state.fileList &&
        this.state.fileList[0] &&
        this.state.fileList[0].response[0]
    );
  };
}
