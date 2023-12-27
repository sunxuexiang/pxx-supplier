import React from 'react';

import { Relax, IMap } from 'plume2';

import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Icon,
  DatePicker,
  message,
  Popover
} from 'antd';
import styled from 'styled-components';
import { QMUpload, noop, Const, ValidConst, QMMethod } from 'qmkit';
import moment from 'moment';

const front = require('../img/front.png');
const back = require('../img/back.png');
const post = require('../img/post.png');

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 14 }
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 14,
      offset: 6
    }
  }
};

const newtailFormItemLayout = {
  labelCol: {
    span: 2,
    xs: { span: 24 },
    sm: { span: 3 }
  },
  wrapperCol: {
    span: 24,
    xs: { span: 24 },
    sm: { span: 7 }
  }
};

const PicBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justifycontent: flex-start;
  width: 430px;

  + p {
    color: #999999;
    width: 430px;
  }
`;

const ExamplePic = styled.div`
  border: 1px solid #d9d9d9;
  width: 104px;
  height: 104px;
  border-radius: 4px;
  text-align: center;
  margin-right: 8px;
  display: inline-block;
  position: relative;
  p {
    color: #ffffff;
    width: 100%;
    height: 24px;
    line-height: 24px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
  }
`;
const content = (
  <div>
    <img src={post} alt="" height="400" />
  </div>
);

const person = (
  <div>
    <img src={front} alt="" height="400" />
  </div>
);

const personback = (
  <div>
    <img src={back} alt="" height="400" />
  </div>
);

@Relax
export default class StepTwo extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      company: IMap;

      setCurrentStep: Function;
      mergeInfo: Function;
      saveCompanyInfo: Function;
      getOcrInfo: Function;
    };
  };

  static relaxProps = {
    // 商家
    company: 'company',

    // 设置当前页
    setCurrentStep: noop,
    // 修改工商信息
    mergeInfo: noop,
    // 保存工商信息
    saveCompanyInfo: noop,
    getOcrInfo: noop
  };

  render() {
    const { company, mergeInfo } = this.props.relaxProps;
    const info = company.get('info');
    const businessLicenceImg = info.get('businessLicence')
      ? info.get('businessLicence')
      : null;
    const businessLicence = info.get('businessLicence')
      ? JSON.parse(info.get('businessLicence'))
      : [];
    const frontIDCard = info.get('frontIDCard')
      ? JSON.parse(info.get('frontIDCard'))
      : [];
    const backIDCard = info.get('backIDCard')
      ? JSON.parse(info.get('backIDCard'))
      : [];
    const warehouseImageImg = info.get('warehouseImage')
      ? info.get('warehouseImage')
      : null;
    const warehouseImage = info.get('warehouseImage')
      ? JSON.parse(info.get('warehouseImage'))
      : [];
    const doorImageImg = info.get('doorImage') ? info.get('doorImage') : null;
    const doorImage = info.get('doorImage')
      ? JSON.parse(info.get('doorImage'))
      : [];
    const { getFieldDecorator } = this.props.form;
    const foundDate = info.get('foundDate') && {
      initialValue: moment(info.get('foundDate'), Const.DAY_FORMAT)
    };

    // const businessTermStart = info.get('businessTermStart') && {
    //   initialValue: moment(info.get('businessTermStart'), Const.DAY_FORMAT)
    // };

    // const businessTermEnd = info.get('businessTermEnd') && {
    //   initialValue: moment(info.get('businessTermEnd'), Const.DAY_FORMAT)
    // };

    return (
      <div style={{ padding: '20px 0 40px 0' }}>
        <Form>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                required={true}
                label="统一社会信用代码"
              >
                {getFieldDecorator('socialCreditCode', {
                  initialValue: info.get('socialCreditCode'),
                  rules: [
                    { required: true, message: '请填写统一社会信用代码' },
                    {
                      pattern: ValidConst.socialCreditCode,
                      message: '请填写正确的统一社会信用代码且必须15-20字符'
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'socialCreditCode',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required={true} label="企业名称">
                {getFieldDecorator('companyName', {
                  initialValue: info.get('companyName'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorTrimMinAndMax(
                          rule,
                          value,
                          callback,
                          '企业名称',
                          1,
                          50
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'companyName',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="法定代表人">
                {getFieldDecorator('legalRepresentative', {
                  initialValue: info.get('legalRepresentative'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '法定代表人',
                          0,
                          10
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'legalRepresentative',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="法人电话">
                {getFieldDecorator('corporateTelephone', {
                  initialValue: info.get('corporateTelephone'),
                  rules: [
                    {
                      pattern: ValidConst.phone,
                      message: '请输入正确的电话号码'
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'corporateTelephone',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          {/* <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="注册资本">
                {getFieldDecorator('registeredCapital', {
                  initialValue: info.get('registeredCapital'),
                  rules: [
                    {
                      pattern: ValidConst.zeroPrice,
                      message: '请输入正确的注册资本'
                    },
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.toString() : '',
                          callback,
                          '注册资本',
                          0,
                          9
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    style={{ width: 142 }}
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'registeredCapital',
                        value: e.target.value
                      })
                    }
                  />
                )}
                &nbsp;万元
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="成立日期">
                {getFieldDecorator('foundDate', {
                  ...foundDate,
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.format(Const.DAY_FORMAT) : '',
                          callback,
                          '成立日期',
                          0,
                          20
                        )
                    }
                  ]
                })(
                  <DatePicker
                    format={Const.DAY_FORMAT}
                    onChange={(_date, dateString) =>
                      mergeInfo({
                        field: 'foundDate',
                        value: dateString
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="营业期限自">
                {getFieldDecorator('businessTermStart', {
                  ...businessTermStart,
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.format(Const.DAY_FORMAT) : '',
                          callback,
                          '营业期限',
                          0,
                          20
                        )
                    }
                  ]
                })(
                  <DatePicker
                    format={Const.DAY_FORMAT}
                    onChange={(_date, dateString) =>
                      mergeInfo({
                        field: 'businessTermStart',
                        value: dateString
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="营业期限至">
                {getFieldDecorator('businessTermEnd', {
                  ...businessTermEnd,
                  rules: [
                    {
                      validator: (rule, value, callback) =>
                        QMMethod.validatorMinAndMax(
                          rule,
                          value ? value.format(Const.DAY_FORMAT) : '',
                          callback,
                          '营业期限',
                          0,
                          20
                        )
                    }
                  ]
                })(
                  <DatePicker
                    format={Const.DAY_FORMAT}
                    onChange={(_date, dateString) =>
                      mergeInfo({
                        field: 'businessTermEnd',
                        value: dateString
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row> */}
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="住所">
                {getFieldDecorator('address', {
                  initialValue: info.get('address'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '住所',
                          0,
                          60
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'address',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="仓库地址">
                {getFieldDecorator('warehouseAddress', {
                  initialValue: info.get('warehouseAddress'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorMinAndMax(
                          rule,
                          value,
                          callback,
                          '仓库地址',
                          0,
                          50
                        );
                      }
                    }
                  ]
                })(
                  <Input
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'warehouseAddress',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem
                required={true}
                {...newtailFormItemLayout}
                label="经营范围"
              >
                {getFieldDecorator('businessScope', {
                  initialValue: info.get('businessScope'),
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        QMMethod.validatorTrimMinAndMax(
                          rule,
                          value,
                          callback,
                          '经营范围',
                          1,
                          500
                        );
                      }
                    }
                  ]
                })(
                  <Input.TextArea
                    style={{ height: 100 }}
                    onChange={(e: any) =>
                      mergeInfo({
                        field: 'businessScope',
                        value: e.target.value
                      })
                    }
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                required={true}
                {...formItemLayout}
                label="营业执照副本电子版"
              >
                <PicBox>
                  <QMUpload
                    name="uploadFile"
                    style={styles.box}
                    fileList={businessLicence}
                    action={
                      Const.HOST +
                      '/store/uploadStoreResource?resourceType=IMAGE'
                    }
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) =>
                      this._editImages(info, 'businessLicence')
                    }
                    beforeUpload={this._checkUploadFile}
                  >
                    {businessLicence.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  {getFieldDecorator('businessLicence', {
                    initialValue: businessLicenceImg,
                    rules: [{ required: true, message: '请上传营业执照' }]
                  })(<Input type="hidden" />)}
                  <Popover content={content}>
                    <ExamplePic>
                      <img src={post} alt="" width="100%" />
                      <p>示例</p>
                    </ExamplePic>
                  </Popover>
                </PicBox>
                <p>仅限jpg、jpeg、gif、png，大小不超过2M，仅限上传1张</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="法人身份证">
                <PicBox>
                  <QMUpload
                    name="uploadFile"
                    style={styles.box}
                    fileList={frontIDCard}
                    action={
                      Const.HOST +
                      '/store/uploadStoreResource?resourceType=IMAGE'
                    }
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) => this._editImages(info, 'frontIDCard')}
                    beforeUpload={this._checkUploadFile}
                  >
                    {frontIDCard.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  <Popover content={person}>
                    <ExamplePic>
                      <img src={front} alt="" width="100%" />
                      <p>正面示例</p>
                    </ExamplePic>
                  </Popover>
                  <QMUpload
                    style={styles.box}
                    name="uploadFile"
                    fileList={backIDCard}
                    action={
                      Const.HOST +
                      '/store/uploadStoreResource?resourceType=IMAGE'
                    }
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) => this._editImages(info, 'backIDCard')}
                    beforeUpload={this._checkUploadFile}
                  >
                    {backIDCard.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  <Popover content={personback}>
                    <ExamplePic>
                      <img src={back} alt="" width="100%" />
                      <p>反面示例</p>
                    </ExamplePic>
                  </Popover>
                </PicBox>
                <p>
                  请上传身份证正反面照片，仅限jpg、jpeg、gif、png，大小不超过2M，仅限上
                  传2张
                </p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} required label="仓库照片">
                <PicBox>
                  <QMUpload
                    name="uploadFile"
                    style={styles.box}
                    fileList={warehouseImage}
                    action={
                      Const.HOST +
                      '/store/uploadStoreResource?resourceType=IMAGE'
                    }
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) =>
                      this._editImages(info, 'warehouseImage')
                    }
                    beforeUpload={this._checkUploadFile}
                  >
                    {warehouseImage.length < 4 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  {getFieldDecorator('warehouseImage', {
                    initialValue: warehouseImageImg,
                    rules: [{ required: true, message: '请上传仓库照片' }]
                  })(<Input type="hidden" />)}
                </PicBox>
                <p>仅限jpg、jpeg、gif、png，大小不超过2M，最多上传4张</p>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} required label="招牌照片">
                <PicBox>
                  <QMUpload
                    name="uploadFile"
                    style={styles.box}
                    fileList={doorImage}
                    action={
                      Const.HOST +
                      '/store/uploadStoreResource?resourceType=IMAGE'
                    }
                    listType="picture-card"
                    accept={'.jpg,.jpeg,.png,.gif'}
                    onChange={(info) => this._editImages(info, 'doorImage')}
                    beforeUpload={this._checkUploadFile}
                  >
                    {doorImage.length < 1 && (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                  {getFieldDecorator('doorImage', {
                    initialValue: doorImageImg,
                    rules: [{ required: true, message: '请上传招牌照片' }]
                  })(<Input type="hidden" />)}
                </PicBox>
                <p>仅限jpg、jpeg、gif、png，大小不超过2M，仅限上传1张</p>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...tailFormItemLayout}>
                <Button onClick={this._prev}>上一步</Button>
                <Button
                  style={{ marginLeft: 10 }}
                  type="primary"
                  onClick={this._next}
                >
                  下一步
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  /**
   * 下一步
   */
  _next = () => {
    const { saveCompanyInfo, company } = this.props.relaxProps;
    const form = this.props.form;
    form.validateFields(null, (errs) => {
      //时间都填了且截至时间小于或等于起始时间
      // if (
      //   form.getFieldValue('businessTermStart') &&
      //   form.getFieldValue('businessTermEnd') &&
      //   !form
      //     .getFieldValue('businessTermStart')
      //     .isBefore(form.getFieldValue('businessTermEnd'))
      // ) {
      //   form.resetFields(['businessTermEnd']);
      //   let errorObject = {};
      //   errorObject['businessTermEnd'] = {
      //     //value: form.getFieldValue('businessTermEnd').format(Const.DAY_FORMAT),
      //     errors: [new Error('不可早于或等于开始日期')]
      //   };
      //   form.setFields(errorObject);
      //   this.setState({});
      // } else {
      //如果校验通过
      if (!errs) {
        saveCompanyInfo(company.get('info'));
      } else {
        this.setState({});
      }
      // }
    });
  };

  /**
   * 上一步
   */
  _prev = () => {
    const { setCurrentStep } = this.props.relaxProps;
    setCurrentStep(0);
  };

  /**
   * 改变图片
   */
  _editImages = (info, field) => {
    const { file, fileList } = info;
    const { mergeInfo } = this.props.relaxProps;
    const status = file.status;
    if (status !== 'uploading') {
      if (__DEV__) {
        console.log(file, fileList);
      }
    }
    if (status === 'done') {
      message.success(`${file.name} 上传成功！`);
    } else if (status === 'error') {
      message.error(`${file.name} 上传失败！`);
    }
    if (field == 'businessLicence') {
      this.props.form.setFieldsValue({
        businessLicence: fileList
      });
      if (status === 'done') {
        this.handleOcr(fileList);
      }
    }
    if (field == 'warehouseImage') {
      this.props.form.setFieldsValue({
        warehouseImage: fileList
      });
    }
    if (field == 'doorImage') {
      this.props.form.setFieldsValue({
        doorImage: fileList
      });
    }
    mergeInfo({ field, value: JSON.stringify(fileList) });
  };

  // 营业执照ocr解析
  handleOcr = async (fileList) => {
    const { form } = this.props;
    const { getOcrInfo } = this.props.relaxProps;
    if (fileList[0] && fileList[0].response && fileList[0].response[0]) {
      const ocrInfo = await getOcrInfo(fileList[0].response[0]);
      if (ocrInfo) {
        form.setFieldsValue(ocrInfo);
      }
    }
  };

  /**
   * 检查文件格式
   */
  _checkUploadFile = (file, fileList) => {
    if (fileList.length > 1) {
      message.error('只能上传一张图片');
      return false;
    }
    let fileName = file.name.toLowerCase();
    // 支持的图片格式：jpg、jpeg、png、gif
    if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      if (file.size <= Const.fileSize.TWO) {
        return true;
      } else {
        message.error('文件大小不能超过2M');
        return false;
      }
    } else {
      message.error('文件格式错误');
      return false;
    }
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
  }
};
