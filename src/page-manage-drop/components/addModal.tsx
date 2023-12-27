import React from 'react';
import { Relax, msg } from 'plume2';
import { Const, DataGrid, noop, QMUpload, AuthWrapper } from 'qmkit';
import html2canvas from 'html2canvas';
import copy from 'copy-to-clipboard';
import { List, fromJS } from 'immutable';
import { Button, Upload, Icon, message, Radio, Row, Col, Input } from 'antd';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
const tuiguanghaibao = require('../img/tuiguanghaibao.png');
const FILE_MAX_SIZE = 500 * 1024;
type TList = List<any>;

/**
 * 订单收款单列表
 */
@Relax
export default class AddModal extends React.Component<any, any> {
  _store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    this.state = {
      backGroundPic: ''
    };
  }
  props: {
    relaxProps?: {
      loading: boolean;
      useType;
      backGroundPic;
      url;
      sources;
      pageInfoExtend: {};
      submit;
      changeFieldInfo;
      isShowInputFlag;
      submitInput;
      saveInput;
      deleteLink;
      miniProgramQrCode;
      submitSave;
      platform;
    };
  };

  static relaxProps = {
    loading: 'loading',
    useType: 'useType',
    url: 'url',
    sources: 'sources',
    backGroundPic: 'backGroundPic',
    isShowInputFlag: 'isShowInputFlag',
    submitInput: 'submitInput',
    miniProgramQrCode: 'miniProgramQrCode',
    platform: 'platform',
    deleteLink: noop,
    submit: noop,
    changeFieldInfo: noop,
    saveInput: noop,
    submitSave: noop,
    // 附件信息
    images: 'images'
  };
  componentDidMount() {
    //   console.log(html2canvas(document.querySelector("#capture")).then(canvas => {
    //     // console.log(canvas)
    //     document.body.appendChild(canvas)
    // }))
  }

  render() {
    const {
      useType,
      submit,
      backGroundPic,
      changeFieldInfo,
      saveInput,
      submitInput,
      url,
      sources,
      isShowInputFlag,
      deleteLink,
      miniProgramQrCode,
      submitSave,
      platform
    } = this.props.relaxProps;

    let images = this.props.relaxProps.images as any;

    if (images instanceof Array && images.length > 0) {
      // console.log(images[0]);
      images = fromJS([
        {
          uid: images[0].uid,
          name: images[0].name,
          size: images[0].size,
          status: images[0].status,
          url: images[0].response[0]
        }
      ]);
    } else if (images instanceof Array && images.length == 0) {
      images = fromJS([]);
    }

    images = images.toJS();
    // console.log('images', images);
    let _this = this;
    const props = {
      name: 'uploadFile',
      action: Const.HOST + '/uploadResource?resourceType=IMAGE',
      showUploadList: false,
      accept: '.jpg,.jpeg,.png,.gif',
      headers: {
        Accept: 'application/json',
        Authorization:
          'Bearer' + ((window as any).token ? ' ' + (window as any).token : '')
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList.slice(-1));
        }
        if (info.file.status === 'done') {
          console.log('info', info.fileList.slice(-1));
          changeFieldInfo(
            'backGroundPic',
            info.fileList.slice(-1)[0].response[0]
          );
        } else if (info.file.status === 'error') {
        }
      }
    };
    let qrCodeUrl = null;
    QRCode.toDataURL(url, { errorCorrectionLevel: 'H' }, function(_err, url) {
      qrCodeUrl = url;
    });

    // console.log(qrCodeUrl);
    return (
      <div>
        <Row>
          <Col span={8}>
            <div className="right-state">
              <div className="title">扫一扫，在手机上查看并分享</div>
              <div className="bg-default" id="capture">
                {backGroundPic ? <img src={backGroundPic} /> : ''}
                {useType == 0 ? (
                  <img
                    className="qrCode"
                    id="miniCode"
                    src={miniProgramQrCode}
                  />
                ) : (
                  <img id="qrCode" className="qrCode" src={qrCodeUrl} />
                )}
              </div>
              <div className="menu-state">
                <div>
                  <Upload {...props}>
                    <div style={styles.handState}>更换背景</div>
                  </Upload>
                </div>
                <div className="radio-state">
                  <Radio.Group
                    onChange={(e) => changeFieldInfo('useType', e.target.value)}
                    value={useType}
                  >
                    {platform === 'weixin' && (
                      <Radio value={0}>使用小程序码</Radio>
                    )}
                    <Radio value={1}>使用二维码</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className="btn-state">
                <Button onClick={() => this.renderImage()}>下载海报</Button>
                {platform === 'weixin' && (
                  <Button onClick={() => this.downMniCode()}>
                    下载小程序码
                  </Button>
                )}
                <Button onClick={() => this.downQrCode()}>下载二维码</Button>
              </div>
            </div>
          </Col>
          <Col span={16}>
            <div className="rights-state">
              <div className="title">
                {platform === 'weixin' ? 'H5' : 'PC'}推广链接
              </div>
              <div className="link-list">
                <div className="link-name">默认渠道</div>
                <div className="link-input">
                  <div className="link-url">
                    <Input value={url} disabled type="text" />
                  </div>
                  <div
                    className="link-menu"
                    onClick={() => this.oneKeyCopy(url)}
                    style={styles.handState}
                  >
                    复制链接
                  </div>
                </div>
              </div>
              {sources &&
                sources.map((v, i) => {
                  return (
                    <div className="link-list">
                      <div className="link-name">{v}</div>
                      <div className="link-input">
                        <div className="link-url">
                          <Input
                            value={
                              url +
                              `${
                                url.indexOf('?') > 0
                                  ? `&channel=${v}`
                                  : `?channel=${v}`
                              }`
                            }
                            disabled
                            type="text"
                          />
                        </div>
                        <div className="link-menu">
                          <div
                            style={styles.handState}
                            onClick={() =>
                              this.oneKeyCopy(
                                url +
                                  `${
                                    url.indexOf('?') > 0
                                      ? `&channel=${v}`
                                      : `?channel=${v}`
                                  }`
                              )
                            }
                          >
                            复制链接
                          </div>
                          <div
                            style={styles.handState}
                            onClick={() => deleteLink(i)}
                          >
                            删除渠道
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              {isShowInputFlag && (
                <div className="link-list">
                  <div className="link-name">{submitInput || '默认渠道'}</div>
                  <div className="link-input">
                    <div className="link-url">
                      <Input
                        placeholder="渠道标记，只允许包括 字母 数字 和上下划线、星号"
                        type="text"
                        onChange={(e) => {
                          changeFieldInfo('submitInput', e.target.value);
                        }}
                      />
                    </div>
                    <div className="link-menu">
                      <Button
                        type="primary"
                        onClick={() => {
                          saveInput();
                        }}
                      >
                        保存
                      </Button>
                      <Button
                        onClick={() => {
                          changeFieldInfo('isShowInputFlag', false);
                          changeFieldInfo('submitInput', '');
                        }}
                      >
                        取消
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {!isShowInputFlag && (
                <Button
                  style={styles.submitBtn}
                  onClick={() => {
                    changeFieldInfo('isShowInputFlag', true);
                  }}
                >
                  添加渠道链接
                </Button>
              )}
            </div>
          </Col>
        </Row>
        <div className="bar-button">
          <Button type="primary" onClick={() => submitSave()}>
            保存
          </Button>
        </div>
      </div>
    );
  }
  renderImage = () => {
    html2canvas(document.querySelector('#capture'), {
      useCORS: true
    }).then((canvas) => {
      // console.log(canvas);
      let oImg = new Image();
      this.setState({
        backGroundPic: canvas.toDataURL()
      });
      this.downPoster(canvas.toDataURL());
      // console.log(canvas.toDataURL());
      // document.body.appendChild(canvas)
    });
  };
  oneKeyCopy = (text) => {
    copy(text); //'我是要复制的内容'
    message.success('复制成功');
  };
  downMniCode() {
    let useType = this.props.relaxProps.useType;
    // console.log(useType);
    if (useType == 1) return message.error('请切换成使用小程序码');
    this.downloadImage(document.getElementById('miniCode').src, '小程序码');
  }
  downQrCode() {
    let useType = this.props.relaxProps.useType;
    if (useType == 0) return message.error('请切换成使用二维码');
    this.downloadImage(document.getElementById('qrCode').src, '二维码');
  }
  downPoster(src) {
    this.downloadImage(src, '海报');
  }
  downloadImage(imgsrc, imageName) {
    //下载图片地址和图片名
    let image = new Image();
    image.setAttribute('crossOrigin', 'Anonymous');
    image.onload = function() {
      let canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      let context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, image.width, image.height);
      let url = canvas.toDataURL('image/png'); //得到图片的base64编码数据
      let a = document.createElement('a'); // 生成一个a元素
      let event = new MouseEvent('click'); // 创建一个单击事件
      a.download = imageName; // 设置图片名称
      a.href = url; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    };
    image.src = imgsrc;
  }

  /**
   * 检查文件格式以及文件大小
   */
  _checkUploadFile = (file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= FILE_MAX_SIZE) {
        return true;
      } else {
        message.error('文件大小不能超过50KB');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    // console.log('f', file);
    // console.log('f', fileList);
    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }
    if (file.status == 'done' || fileList.length == 0) {
      this._store.onChangeFile(fileList);
    }

    // console.log('fileList', fileList.slice(-1));
  };
  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList.map((file) => {
      return {
        uid: file.uid,
        status: file.status,
        url: file.response ? file.response[0] : file.url
      };
    });
  };
}

const styles = {
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  timeState: {
    width: '60px'
  },
  imagesNull: {
    marginTop: '130px'
  },
  imagesUpload: {
    marginTop: '430px'
  },
  submitBtn: {
    marginTop: '15px',
    color: '#ff6600'
  },
  handState: {
    cursor: 'pointer'
  }
};
