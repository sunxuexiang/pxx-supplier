import React from 'react';
import { Store } from 'plume2';
import { Form, Input, AutoComplete, Icon, message } from 'antd';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
import { Const, Tips, ValidConst, QMMethod, QMUpload } from 'qmkit';

const defaultMaxSize = 5 * 1024 * 1024;
const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 9 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

export default class EditForm extends React.Component<any, any> {
  _store: Store;

  state = {
    businessLicenseImg: '',
    businessLicenseImgFile: [],
    //是否上传
    businessLicenseImgFileStatus: false,
    taxpayerIdentificationImg: '',
    taxpayerIdentificationImgFile: [],
    taxpayerIdentificationImgStatus: false
  };

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const customers = this._store.state().get('customers');
    let customerAccountList = customers
      .map((v) => v.get('customerAccount'))
      .toJS();

    const store = this._store as any;

    let companyName = {};
    let taxpayerNumber = {};
    let companyAddress = {};
    let companyPhone = {};
    let bankNo = {};
    let bankName = {};

    return (
      <Form>
        <FormItem {...formItemLayout} label="客户" hasFeedback>
          <div style={styles.customer}>
            {getFieldDecorator('customerAccount', {
              rules: [
                {
                  required: true,
                  validator: (rule, value, callback) => {
                    this.validatorMinAndMax(
                      rule,
                      value,
                      callback,
                      '客户',
                      1,
                      100
                    );
                  }
                }
              ]
            })(
              <AutoComplete
                onSelect={(v) => this.onSelectCustomer(v)}
                onChange={(val) => store.handleSearch(val)}
                placeholder="请选择会员"
                dataSource={customerAccountList}
                allowClear={true}
              />
            )}

            {getFieldDecorator('customerId', {})(<Input type="hidden" />)}
          </div>
        </FormItem>
        <FormItem {...formItemLayout} label="单位名称" hasFeedback>
          {getFieldDecorator('companyName', {
            ...companyName,
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '单位名称',
                    1,
                    50
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="纳税人识别号" hasFeedback>
          {getFieldDecorator('taxpayerNumber', {
            ...taxpayerNumber,
            rules: [
              { required: true, message: '请填写纳税人识别号' },
              {
                pattern: ValidConst.tax,
                message: '请输入正确的纳税人识别号且必须15-20字符'
              }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="注册地址" hasFeedback>
          {getFieldDecorator('companyAddress', {
            ...companyAddress,
            rules: [
              { required: true, message: '请填写注册地址' },
              { min: 5, message: '注册地址必须5-60字符' },
              { max: 60, message: '注册地址必须5-60字符' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="注册电话" hasFeedback>
          {getFieldDecorator('companyPhone', {
            ...companyPhone,
            rules: [
              { required: true, message: '请填写注册电话' },
              { pattern: ValidConst.telephone, message: '请输入正确的注册电话' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="银行基本户号" hasFeedback>
          {getFieldDecorator('bankNo', {
            ...bankNo,
            rules: [
              { required: true, message: '请填写银行基本户号' },
              {
                pattern: ValidConst.bankNumber,
                message: '请输入正确的银行基本户号且必须为1-30位数字'
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="开户银行" hasFeedback>
          {getFieldDecorator('bankName', {
            ...bankName,
            rules: [
              {
                required: true,
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '开户银行',
                    1,
                    50
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="营业执照复印件" hasFeedback>
          <QMUpload
            name={'uploadFile'}
            style={styles.box}
            onChange={(info) => this.onUploadLicenseImg(info)}
            action={
              Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'
            }
            fileList={this.state.businessLicenseImgFile}
            listType={'picture-card'}
            accept={'.jpg,.jpeg,.png,.gif'}
            beforeUpload={this._checkUploadFile}
            onRemove={() => this.onRemoveLicenseImg()}
          >
            {!this.state.businessLicenseImgFileStatus ? (
              <Icon type="plus" style={styles.plus} />
            ) : null}
          </QMUpload>
          <Tips title="仅支持JPG，GIF，PNG，JPEG图片文件，且需小于2M，最多上传1张" />
          {getFieldDecorator('businessLicenseImg', {
            initialValue: this.state.businessLicenseImg,
            rules: [{ required: true, message: '请上传营业执照复印件' }]
          })(<Input type="hidden" />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="一般纳税人认证资格复印件"
          hasFeedback
        >
          <QMUpload
            name={'uploadFile'}
            style={styles.box}
            onChange={(info) => this.onUploadTaxpayer(info)}
            action={
              Const.HOST + '/store/uploadStoreResource?resourceType=IMAGE'
            }
            fileList={this.state.taxpayerIdentificationImgFile}
            listType={'picture-card'}
            accept={'.jpg,.jpeg,.png,.gif'}
            beforeUpload={this._checkUploadFile}
            onRemove={() => this.onRemoveTaxpayer()}
          >
            {!this.state.taxpayerIdentificationImgStatus ? (
              <Icon type="plus" style={styles.plus} />
            ) : null}
          </QMUpload>
          <Tips title="仅支持JPG，GIF，PNG，JPEG图片文件，且需小于2M，最多上传1张" />
          {getFieldDecorator('taxpayerIdentificationImg', {
            initialValue: this.state.taxpayerIdentificationImg,
            rules: [
              { required: true, message: '请上传一般纳税人认证资格复印件' }
            ]
          })(<Input type="hidden" />)}
        </FormItem>
      </Form>
    );
  }

  onUploadLicenseImg({ file, fileList }) {
    if (file.status == 'error') {
      message.error('上传失败');
      return;
    }

    this.setState({ businessLicenseImgFile: fileList });

    //当上传完成的时候设置
    if (fileList[0]) {
      if (fileList[0].status == 'done') {
        this.setState({
          businessLicenseImg: JSON.stringify(fileList[0]),
          businessLicenseImgFileStatus: true
        });
        this.props.form.setFieldsValue({
          businessLicenseImg: JSON.stringify([
            { uid: 0, status: 'done', url: fileList[0].response[0] }
          ])
        });
      } else {
        this.setState({ businessLicenseImgFileStatus: true });
      }
    }
  }

  onUploadTaxpayer({ file, fileList }) {
    //当上传完成的时候设置
    if (file.status == 'error') {
      message.error('上传失败');
    }

    this.setState({ taxpayerIdentificationImgFile: fileList });

    if (fileList[0]) {
      if (fileList[0].status == 'done') {
        this.setState({
          taxpayerIdentificationImg: JSON.stringify(fileList[0]),
          taxpayerIdentificationImgStatus: true
        });
        this.props.form.setFieldsValue({
          taxpayerIdentificationImg: JSON.stringify([
            { uid: 0, status: 'done', url: fileList[0].response[0] }
          ])
        });
      } else {
        this.setState({ taxpayerIdentificationImgStatus: true });
      }
    }
  }

  onRemoveLicenseImg() {
    this.props.form.setFieldsValue({ businessLicenseImg: null });
    this.setState({
      businessLicenseImg: '',
      businessLicenseImgFileStatus: false
    });
  }

  onRemoveTaxpayer() {
    this.props.form.setFieldsValue({ taxpayerIdentificationImg: '' });
    this.setState({
      taxpayerIdentificationImg: null,
      taxpayerIdentificationImgStatus: false
    });
  }

  onSelectCustomer(customerAccount) {
    const selectedCustomer = this._store
      .state()
      .get('customers')
      .find((customer) => customer.get('customerAccount') == customerAccount);
    if (!selectedCustomer.get('customerId')) {
      return;
    }

    this.validCustomer(selectedCustomer);
    this.props.form
      .setFieldsValue({
        customerAccount: `${selectedCustomer.get(
          'customerAccount'
        )} ${selectedCustomer.get('customerName')} ${selectedCustomer.get(
          'customerLevelName'
        )}`,
        customerId: selectedCustomer.get('customerId')
      })(this._store as any)
      .onSelectCustomer(selectedCustomer);
  }

  validCustomer(selectedCustomer) {
    (this._store as any).validCustomer(selectedCustomer.get('customerId'));
  }

  validatorMinAndMax(_rule, value, callback, fieldText, minNum, maxNum) {
    if (!value) {
      callback(new Error(fieldText + '不能为空'));
      return;
    } else {
      if (value.trim().length <= 0) {
        callback(new Error(fieldText + '不能为空'));
        return;
      }
      if (value.trim().length > 0 && value.trim().length < minNum) {
        callback(
          fieldText + '长度必须为' + minNum + '-' + maxNum + '个字符之间'
        );
        return;
      }
      if (value.trim().length > minNum && value.trim().length > maxNum) {
        callback(
          fieldText + '长度必须为' + minNum + '-' + maxNum + '个字符之间'
        );
        return;
      }
    }
    callback();
  }

  /**
   * 检查文件格式
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
      if (file.size <= defaultMaxSize) {
        return true;
      } else {
        message.error('文件大小不能超过5M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
  };
}

const styles = {
  customer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any,
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any,
  plus: {
    color: '#999',
    fontSize: '28px'
  }
};
