import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Button, Input, Form } from 'antd';
import { Const, Tips, QMUpload, cache, QMMethod, noop } from 'qmkit';
import { Store } from 'plume2';

import { WrappedFormUtils } from 'antd/lib/form/Form';
import { message } from 'antd';

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

export default class settingForms extends React.Component<any, any> {
  form;

  _store: Store;

  static contextTypes = {
    _plume$Store: PropTypes.object
  };
  static relaxProps = {
    fieldsValue: noop
    // couponName: 'couponName'
  };

  props: {
    relaxProps?: {
      fieldsValue: Function;
    };
  };
  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
    let storeLogo = this._store.state().getIn(['settings', 'storeLogo']); //套装logo
    let storeSign = this._store.state().getIn(['settings', 'storeSign']); //店铺店招

    this.state = {
      //用于storeLogo图片展示
      storeLogoImage:
        storeLogo && storeLogo
          ? [
              {
                uid: 'store-logo-1',
                name: storeLogo,
                size: 1,
                status: 'done',
                url: storeLogo
              }
            ]
          : [],
      //用于storeLogo图片校验
      storeLogo: storeLogo,
      //用于storeSign图片展示
      storeSignImage:
        storeSign && storeSign
          ? [
              {
                uid: 'store-sign-1',
                name: storeSign,
                size: 1,
                status: 'done',
                url: storeSign
              }
            ]
          : [],
      //用于storeSign图片校验
      storeSign: storeSign
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    console.log(this.props.relaxProps);
    // const { fieldsValue,  } = this.props.relaxProps;
    const storeId = this._store.state().getIn(['settings', 'storeId']); //店铺标识
    const companyInfoId = JSON.parse(
      sessionStorage.getItem(cache.LOGIN_DATA)
    ).companyInfoId; //从缓存中获取商家标识

    return (
      <Form
        style={{ paddingBottom: 50, maxWidth: 900 }}
        onSubmit={this._handleSubmit}
      >
        <Row>
          <Col span={18}>
            <FormItem required={false} {...formItemLayout} label="店铺logo">
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
                  beforeUpload={this._checkUploadFile.bind(this, 1)}
                >
                  {this.state.storeLogoImage.length >= 1 ? null : (
                    <div>
                      <Icon type="plus" style={styles.plus} />
                    </div>
                  )}
                </QMUpload>
                {getFieldDecorator('storeLogo', {
                  initialValue: this.state.storeLogo
                })(<Input type="hidden" />)}
              </div>
              <Tips title="套装头部banner图片，仅限jpg，jpeg，gif，建议尺寸750px*336px，大小不超过1M" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <FormItem {...formItemLayout} label="限购套餐" required={true}>
              {/* <Input
                  placeholder="限购套餐"
                  maxLength={'10' as any}
                  onChange={(e) => {
                    fieldsValue({
                      field: 'couponName',
                      value: e.currentTarget.value
                    });
                  }}
                /> */}
              {getFieldDecorator('couponName', {
                initialValue: '123',
                rules: [
                  {
                    validator: (rule, value, callback) => {
                      QMMethod.validatorTrimMinAndMax(
                        rule,
                        value,
                        callback,
                        '限购套餐',
                        1,
                        10
                      );
                    }
                  }
                ]
              })(
                <Input
                  placeholder="限购套餐"
                  maxLength={'10' as any}
                  onChange={(e) => {
                    fieldsValue({
                      field: 'couponName',
                      value: e.currentTarget.value
                    });
                  }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        {/* <Row>
          <Col span={18}>
            <FormItem {...formItemLayout} required={false} label="店铺店招">
              <Row>
                <Col span={24}>
                  <div className="clearfix bannerImg">
                    <QMUpload
                      style={styles.box}
                      action={
                        Const.HOST +
                        '/store/uploadStoreResource?resourceType=IMAGE'
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
                      initialValue: this.state.storeSign
                    })(<Input type="hidden" />)}
                  </div>
                </Col>
              </Row>
              <Tips title="PC商城店铺店招，最多可添加1张，图片格式仅限jpg、jpeg、png、gif，建议尺寸1920px*120px，大小不超过2M" />
            </FormItem>
          </Col>
        </Row> */}

        <div className="bar-button">
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    );
  }

  _handleSubmit = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      if (!errs) {
        (this._store as any).editSetting(values);
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

    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    //当上传完成的时候设置
    fileList = this._buildFileList(fileList);
    if (fileList && fileList.length > 0) {
      this.setState({ storeSign: fileList[0].url });
      this.props.form.setFieldsValue({ storeSign: this.state.storeSign });
    }
  };

  /**
   * 检查文件格式以及大小
   */
  _checkUploadFile = (size: number, file) => {
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= size * 1024 * 1024) {
        return true;
      } else {
        message.error('文件大小不能超过' + size + 'M');
        return false;
      }
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
