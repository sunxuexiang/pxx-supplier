import React from 'react';
import { Row, Icon, Button, Input, Form, Radio } from 'antd';
import { Const, Tips, QMUpload, cache, ImgPreview, checkAuth } from 'qmkit';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { message } from 'antd';
import html2canvas from 'html2canvas';
import {
  uploadBase64File,
  fetchImages,
  fetchSetting,
  editSetting
} from '../webapi';
import '../index.less';

const FormItem = Form.Item;

export default class settingForm extends React.Component<any, any> {
  form;

  constructor(props) {
    super(props);

    this.state = {
      //用于storeLogo图片展示
      storeLogoImage: [],
      //用于storeLogo图片校验
      storeLogo: '',
      //用于storeSign图片展示
      storeSignImage: [],
      //用于storeSign图片校验
      storeSign: '',
      // 店招边框列表
      borderImages: [],
      // 选中的边框图片
      borderImg: '',
      // 店招图片大图展示modal 开关
      visible: false,
      // 店招图片大图展示url
      imgList: [],
      hasChanged: false
    };
  }

  componentDidMount(): void {
    this.init();
    this.getBorderImages();
  }

  init = async () => {
    const { res } = await fetchSetting();
    if (res && res.code === Const.SUCCESS_CODE) {
      this.setState({
        storeLogoImage: res.context.storeLogo
          ? [
              {
                uid: 'store-logo-1',
                name: res.context.storeLogo,
                size: 1,
                status: 'done',
                url: res.context.storeLogo
              }
            ]
          : [],
        storeLogo: res.context.storeLogo,
        storeSignImage: res.context.storeSign
          ? [
              {
                uid: 'store-sign-1',
                name: res.context.storeSign,
                size: 1,
                status: 'done',
                url: res.context.storeSign
              }
            ]
          : [],
        storeSign: res.context.storeSign,
        storeId: res.context.storeId,
        borderImg: res.context.borderImage
      });
    } else {
      message.error(res.message || '');
    }
  };

  getBorderImages = async () => {
    const { res } = await fetchImages();
    if (res && res.code === Const.SUCCESS_CODE) {
      const arr = [];
      res.context.forEach((item) => {
        arr.push(item.image);
      });
      this.setState({ borderImages: arr });
    } else {
      message.error(res.message || '');
    }
  };

  render() {
    const { visible, imgList, borderImages, storeId } = this.state;
    const { getFieldDecorator } = this.props.form;
    const companyInfoId = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
      .companyInfoId; //从缓存中获取商家标识

    return (
      <Form
        style={{ paddingBottom: 5 }}
        onSubmit={this._handleSubmit}
        layout="inline"
        className="basic-setting-form"
      >
        <Row>
          {/* <Col span={18}> */}
          <FormItem required={true} label="店铺logo">
            <div className="clearfix logoImg">
              <QMUpload
                style={styles.box}
                action={
                  Const.HOST +
                  `/store/uploadStoreResource?storeId=${storeId}&companyInfoId=${companyInfoId}&resourceType=IMAGE`
                }
                listType="picture-card"
                name="uploadFile"
                onChange={this._editStoreLogo}
                fileList={this.state.storeLogoImage}
                accept={'.jpg,.jpeg,.png,.gif'}
                beforeUpload={this._checkUploadFile.bind(this, 5)}
              >
                {this.state.storeLogoImage.length >= 1 ? null : (
                  <div>
                    <Icon type="plus" style={styles.plus} />
                  </div>
                )}
              </QMUpload>
              {getFieldDecorator('storeLogo', {
                rules: [{ required: true, message: '请上传店铺logo' }],
                initialValue: this.state.storeLogo
              })(<Input type="hidden" />)}
            </div>
            <Tips title="商家店铺logo、移动端登录页logo、管理端logo，最多可添加1张，仅限jpg、jpeg、png、gif，尺寸比例1:1，大小不超过5M" />
          </FormItem>
          {/* </Col> */}
        </Row>
        <Row>
          {/* <Col span={18}> */}
          <FormItem required={true} label="店铺招牌">
            <Row type="flex" justify="start">
              <QMUpload
                style={styles.box}
                action={
                  Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'
                }
                listType="picture-card"
                name="uploadFile"
                onChange={this._editStoreSign}
                fileList={this.state.storeSignImage}
                accept={'.jpg,.jpeg,.png,.gif'}
                beforeUpload={this._checkUploadFile.bind(this, 2)}
              >
                {this.state.storeSignImage.length >= 1 ? null : (
                  <div>
                    <Icon type="plus" style={styles.plus} />
                  </div>
                )}
              </QMUpload>
              {getFieldDecorator('storeSign', {
                rules: [{ required: true, message: '请上传店铺招牌' }],
                initialValue: this.state.storeSign
              })(<Input type="hidden" />)}
              <Row
                type="flex"
                justify="start"
                className="basic-setting-signPreview"
                onClick={this.showBorderImg}
              >
                <span>预览 :</span>
                <div
                  className="basic-setting-signContent"
                  id="basic-setting-borderImg"
                >
                  {this.state.storeSign && (
                    <img // 外链URL需要跨域 且ulr需添加时间戳
                      crossOrigin="anonymous"
                      src={`${this.state.storeSign}${
                        this.state.storeSign.length < 100
                          ? `?_=${Date.now()}`
                          : ''
                      }`} //length < 100 表示非base64URL
                      alt=""
                    />
                  )}
                  {this.state.borderImg && (
                    <img
                      crossOrigin="anonymous"
                      src={`${this.state.borderImg}?_=${Date.now()}`}
                      alt=""
                    />
                  )}
                </div>
              </Row>
            </Row>
            <Tips title="商家店铺招牌，最多可添加1张，图片格式仅限jpg、jpeg、png、gif，尺寸440px*200px，大小不超过2M" />
          </FormItem>
          {/* </Col> */}
        </Row>
        <Row>
          <FormItem required={true} label="店铺边框">
            {getFieldDecorator('borderImage', {
              rules: [{ required: true, message: '请选择店铺边框' }],
              initialValue: this.state.borderImg || ''
            })(
              <Radio.Group
                onChange={this.borderImgChange}
                className="basic-setting-borderImg"
              >
                {borderImages.map((item) => (
                  <Radio value={item} key={item}>
                    <img src={item} alt="" />
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </FormItem>
        </Row>

        <div className="bar-button">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
        <ImgPreview
          visible={visible}
          imgList={imgList}
          showTitlte={false}
          close={() => {
            this.setState({ visible: false });
          }}
        />
      </Form>
    );
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFieldsAndScroll(async (errs, values) => {
      if (!errs) {
        const { imgList, hasChanged, storeId } = this.state;
        if (hasChanged) {
          let dataUrl;
          if (imgList.length > 0) {
            dataUrl = imgList[0];
          } else {
            dataUrl = await this.getDataURL();
          }
          const { res } = await uploadBase64File({ content: dataUrl });
          if (res && res[0]) {
            values.storeSign = res[0];
          } else {
            message.error('上传店招图片失败');
            return;
          }
        }
        if (checkAuth('f_basicSetting_1')) {
          const { res } = await editSetting({ ...values, storeId });
          if (res.code == Const.SUCCESS_CODE) {
            message.success('修改成功!');
            this.init();
          } else {
            message.error(res.message);
          }
        } else {
          message.error('暂无操作权限');
        }
      }
    });
  };

  /**
   * 编辑店铺logo
   * @param file
   * @param fileList
   * @private
   */
  _editStoreLogo = ({ file, fileList }) => {
    this.setState({ storeLogoImage: fileList });

    //当所有图片都被删除时
    if (fileList.length == 0) {
      this.setState({ storeLogo: '' });
      this.props.form.setFieldsValue({ storeLogo: this.state.storeLogo });
      return;
    }

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    //当上传完成的时候设置
    fileList = this._buildFileList(fileList);
    if (fileList && fileList.length > 0) {
      this.setState({ storeLogo: fileList[0].url });
      this.props.form.setFieldsValue({ storeLogo: this.state.storeLogo });
    }
  };

  /**
   * 编辑店铺店招
   * @param file
   * @param fileList
   * @private
   */
  _editStoreSign = ({ file, fileList }) => {
    this.setState({ storeSignImage: fileList });

    //当所有图片都被删除时
    if (fileList.length == 0) {
      this.setState({ storeSign: '' });
      this.props.form.setFieldsValue({ storeSign: this.state.storeSign });
      return;
    }
  };

  /**
   * 检查文件格式以及大小
   */
  _checkUploadFile = async (size: number, file) => {
    const _this = this;
    console.warn(size);
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size > size * 1024 * 1024) {
        message.error('文件大小不能超过' + size + 'M');
        return false;
      }
      const imgSize = {
        width: size === 2 ? 440 : 800,
        height: size === 2 ? 200 : 800
      };
      // 检测尺寸
      return await getFileWidthAndHeight(
        file,
        imgSize.width,
        imgSize.height,
        size,
        _this
      );
    } else {
      message.error('文件格式错误');
      return false;
    }
  };

  _buildFileList = (fileList: Array<any>): Array<any> => {
    return fileList
      .filter((file) => file.status === 'done')
      .map((file) => {
        return {
          uid: file.uid,
          status: file.status,
          url: file.response ? file.response[0] : file.url
        };
      });
  };

  // 选择边框图片
  borderImgChange = (e) => {
    this.setState({ borderImg: e.target.value, hasChanged: true, imgList: [] });
  };

  // html转canvas 获取url
  getDataURL = () => {
    return new Promise((resolve) => {
      const el = document.getElementById('basic-setting-borderImg');
      html2canvas(el, {
        allowTaint: true,
        useCORS: true,
        scale: 3,
        width: 220,
        height: 100
      })
        .then((canvas) => {
          const dataUrl = canvas.toDataURL();
          if (dataUrl) {
            resolve(dataUrl);
          } else {
            resolve('');
          }
        })
        .catch(() => {
          resolve('');
        });
    });
  };

  // 展示店招图片大图
  showBorderImg = async () => {
    const { imgList } = this.state;
    if (imgList.length > 0) {
      this.setState({ visible: true });
    } else {
      const dataUrl = await this.getDataURL();
      if (dataUrl) {
        this.setState({
          imgList: [dataUrl],
          visible: true
        });
      }
    }
  };
}
//导入检测图片尺寸代码
const getFileWidthAndHeight = (file, initwidth, initheight, size, _this) => {
  return new Promise((resolve, reject) => {
    let width = initwidth;
    let height = initheight;
    let _URL = window.URL || window.webkitURL;
    let img = new Image();
    img.src = _URL.createObjectURL(file);
    img.onload = () => {
      if (size === 2 && (img.width !== width || img.height !== height)) {
        message.error(`上传尺寸必须是${initwidth}px * ${initheight}px!`);
        reject(false);
      } else if (size === 5 && img.width !== img.height) {
        message.error('上传尺寸比例必须是1 : 1!');
        reject(false);
      } else if (size === 2) {
        let oFileReader = new FileReader();
        oFileReader.onloadend = function(e) {
          // base64结果
          const base64 = e.target.result;
          _this.setState({
            storeSignImage: [
              {
                ...file,
                thumbUrl: base64,
                url: base64,
                percent: 100,
                status: 'done'
              }
            ],
            storeSign: base64,
            hasChanged: true,
            imgList: []
          });
          _this.props.form.setFieldsValue({ storeSign: base64 });
        };
        oFileReader.readAsDataURL(file);
        reject(false);
      } else {
        resolve(true);
      }
    };
  });
};

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
  alertBox: {
    marginLeft: 10
  },
  toolBox: {
    marginLeft: 10,
    height: 32,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any
};
