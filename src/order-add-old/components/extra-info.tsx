import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Radio,
  Checkbox,
  message,
  Icon
} from 'antd';

import {
  Const,
  Tips,
  FindArea,
  QMUpload,
  ValidConst,
  AreaSelect,
  QMMethod
} from 'qmkit';
import Store from '../store';
import { fromJS } from 'immutable';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const formItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 14
  }
};
const smallformItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const addressformItemLayout = {
  labelCol: {
    span: 4,
    xs: { span: 6 },
    sm: { span: 4 },
    md: { span: 3 },
    lg: { span: 2 },
    xl: { span: 2 }
  },
  wrapperCol: {
    span: 6,
    xs: { span: 10 },
    sm: { span: 8 },
    md: { span: 6 },
    lg: { span: 4 },
    xl: { span: 4 }
  }
};

export default class ExtraForm extends React.Component<any, any> {
  props: {
    form?: any;
    history?: any;
    sperator?: boolean;
    selectedInvoiceAddrId?: string;
  };

  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this.state = {
      //发票类型，0：普通发票 1：增值税专用发票 -1：无
      invoiceType: '-1',
      invoiceSperateAddr: false,
      //配送方式
      deliverWay: '1',
      //支付方式
      payType: '0',
      selectedInvoiceAddrId: '',
      invoiceResult: '-1'
    };

    this._store = ctx['_plume$Store'];
  }

  componentDidUpdate() {
    const deliverWay = this._store.state().getIn(['extra', 'deliverWay']);
    const payType = this._store.state().getIn(['extra', 'payType']);
    const invoiceType = this._store.state().getIn(['extra', 'invoiceType']);
    const invoiceResult = this._store.state().getIn(['extra', 'invoiceResult']);
    const selectedInvoiceAddrId = this.props.selectedInvoiceAddrId;

    if (deliverWay != this.state.deliverWay.toString()) {
      this.setState({
        deliverWay: deliverWay.toString()
      });
      this.props.form.setFieldsValue({
        deliverWay: deliverWay.toString()
      });
    }

    if (payType != this.state.payType.toString()) {
      this.setState({
        payType: payType.toString()
      });
      this.props.form.setFieldsValue({
        payType: payType.toString()
      });
    }

    if (invoiceType != this.state.invoiceType.toString()) {
      this.setState({
        invoiceType: invoiceType.toString()
      });
      this.props.form.setFieldsValue({
        invoiceType: invoiceType.toString()
      });
    }

    if (invoiceResult != this.state.invoiceResult.toString()) {
      this.setState({
        invoiceResult: invoiceResult.toString()
      });
      this.props.form.setFieldsValue({
        invoiceResult: invoiceResult.toString()
      });
    }

    //选择发票单独收货地址
    if (
      this.props.sperator &&
      this.state.selectedInvoiceAddrId != selectedInvoiceAddrId
    ) {
      if (invoiceType == 0 || invoiceType == 1) {
        if (this.props.sperator && selectedInvoiceAddrId) {
          this.props.form.setFieldsValue({
            invoiceAddress: selectedInvoiceAddrId
          });
        } else {
          this.props.form.resetFields(['invoiceAddress']);
        }
        this.setState({
          selectedInvoiceAddrId: selectedInvoiceAddrId
        });
      }
    }
  }

  render() {
    //收货地址展示方式  0：地址量小于10   1：地址量超过10条，未点击"更多"  2：地址量超过10条，已点击"更多"
    const invoiceShowType = this._store.state().get('invoiceShowType');

    const { getFieldDecorator } = this.props.form;
    //当前选中的用户id
    const selectedCustomerId = this._store.state().get('selectedCustomerId');
    //当前地址列表
    const addrs = this._store.state().get('invoiceAddrs');
    //当前选中的用户增票资质
    const invoice = this._store.state().get('invoice');
    //增票信息
    const invoiceResponse = invoice.get('customerInvoiceResponse');
    //发票Options
    const invoiceOptions = this._store.state().get('invoiceOptions');
    //发票信息
    const invoiceProjectType = this._store
      .state()
      .getIn(['extra', 'invoiceProjectType']);

    const selectedInvoiceAddrId = this.props.selectedInvoiceAddrId;
    //买家备注
    const buyerRemark = this._store.state().getIn(['extra', 'buyerRemark']);
    //订单附件
    const images = (
      this._store.state().getIn(['extra', 'images']) || fromJS([])
    ).toJS();
    const { onExtraInfoChange, invoiceShowMore } = this._store;
    //开票项目
    const projectOptions = this._store
      .state()
      .getIn(['extra', 'projectOptions']);
    //发票抬头
    const invoiceTitle = this._store.state().getIn(['extra', 'invoiceTitle']);
    //纳税人识别号
    let taxNo = this._store.state().getIn(['extra', 'taxNo']);
    //开票项目
    const invoiceResult = this._store.state().getIn(['extra', 'invoiceResult']);

    const invoiceConsignee = this._store.state().get('invoiceConsignee');
    const isSupportInvoice = this._store.state().get('isSupportInvoice');

    taxNo = taxNo || invoiceConsignee.get('taxNo');

    //地址数组
    let addsArray = [];

    if (
      invoiceConsignee.get('provinceId') &&
      invoiceConsignee.get('addressId') == 'tempId'
    ) {
      addsArray.push(
        invoiceConsignee.get('provinceId') &&
          invoiceConsignee.get('provinceId').toString()
      );
      addsArray.push(
        invoiceConsignee.get('cityId') &&
          invoiceConsignee.get('cityId').toString()
      );
      addsArray.push(
        invoiceConsignee.get('areaId') &&
          invoiceConsignee.get('areaId').toString()
      );
    }

    const addressInit = {
      initialValue: addsArray.length === 0 ? null : addsArray
    };

    const phone = {
      initialValue:
        invoiceConsignee.get('addressId') == 'tempId'
          ? invoiceConsignee.get('phone')
          : null
    };

    const name = {
      initialValue:
        invoiceConsignee.get('addressId') == 'tempId'
          ? invoiceConsignee.get('name')
          : null
    };

    const detailAddress = {
      initialValue:
        invoiceConsignee.get('addressId') == 'tempId'
          ? invoiceConsignee.get('address')
          : null
    };

    const customerInvoiceTempAddressVisiable = this._store
      .state()
      .get('customerInvoiceTempAddressVisiable');

    return (
      <div>
        <strong style={styles.title}>附加信息: </strong>

        {/*p配送方式 0:其他 1:快递*/}
        <FormItem {...formItemLayout} label="配送方式">
          <Col span={8}>
            {getFieldDecorator('deliverWay', {
              initialValue: '1'
            })(
              <Select
                disabled={selectedCustomerId ? false : true}
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(val) => {
                  this.setState({
                    deliverWay: val
                  });
                  onExtraInfoChange({
                    field: 'deliverWay',
                    val
                  });
                }}
              >
                <Option value="1">快递配送</Option>
              </Select>
            )}
          </Col>
        </FormItem>

        {/*支付方式 0 在线支付 1线下支付 */}
        <FormItem {...formItemLayout} label="支付方式">
          <Col span={8}>
            {getFieldDecorator('payType', {
              initialValue: '0'
            })(
              <Select
                disabled={selectedCustomerId ? false : true}
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                onChange={(val) => {
                  this.setState({
                    payType: val
                  });
                  onExtraInfoChange({
                    field: 'payType',
                    val
                  });
                }}
              >
                <Option value="0">在线支付</Option>
                <Option value="1">线下支付</Option>
              </Select>
            )}
          </Col>
        </FormItem>

        {/*发票 0：普通发票 1：增值税专用发票 -1：不需要发票*/}
        <FormItem {...formItemLayout} label="发票信息">
          <Col span={8}>
            {getFieldDecorator('invoiceType', {
              initialValue: '-1'
            })(
              <Select
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                disabled={isSupportInvoice && selectedCustomerId ? false : true}
                onChange={(val) => {
                  this.setState({
                    invoiceType: val
                  });
                  onExtraInfoChange({
                    field: 'invoiceType',
                    val
                  });
                }}
              >
                <Option key={Math.random()} value="-1">
                  不需要发票
                </Option>
                {invoiceOptions.map((option) => (
                  <Option key={option.get('val')} value={option.get('val')}>
                    {option.get('label')}
                  </Option>
                ))}
              </Select>
            )}
          </Col>
        </FormItem>

        {/*如果是普通发票 0:普通发票 1:增值税专用发票 -1:不需要发票 */}
        {(this.state.invoiceType == '0' || this.state.invoiceType == '1') && (
          <div>
            {this.state.invoiceType == '0' && (
              <FormItem {...formItemLayout} label="发票信息">
                <Col span={8}>
                  {getFieldDecorator('invoiceProject', {
                    initialValue: invoiceProjectType
                      ? invoiceProjectType.toString()
                      : '0'
                  })(
                    <RadioGroup
                      size="default"
                      onChange={(e) => {
                        const val = (e.target as any).value;
                        onExtraInfoChange({
                          field: 'invoiceProjectType',
                          val
                        });
                      }}
                    >
                      <RadioButton value="0">个人</RadioButton>
                      <RadioButton value="1">单位</RadioButton>
                    </RadioGroup>
                  )}
                </Col>
              </FormItem>
            )}
            <FormItem {...formItemLayout} label="请选择开票项目">
              <Col span={24}>
                {getFieldDecorator('invoiceResult', {
                  initialValue: invoiceResult,
                  rules: [{ len: 32, message: '必须选择开票项目' }]
                })(
                  <Select
                    getPopupContainer={() =>
                      document.getElementById('page-content')
                    }
                    style={{ width: 200 }}
                    onChange={(val) => {
                      this.setState({
                        invoiceResult: val
                      });
                      onExtraInfoChange({
                        field: 'invoiceResult',
                        val
                      });
                      this.setState({});
                    }}
                  >
                    <Option value="-1">请选择开票项目</Option>
                    {projectOptions
                      .filter(
                        (f) =>
                          this.state.invoiceType == '1'
                            ? f.projectId == '00000000000000000000000000000000'
                            : true
                      )
                      .map((v: { projectId: string; projectName: string }) => (
                        <Option key={v.projectId} value={v.projectId}>
                          {v.projectName}
                        </Option>
                      ))}
                  </Select>
                )}
              </Col>
            </FormItem>
            {this.state.invoiceType == '0' &&
              invoiceProjectType == 1 && (
                <FormItem {...formItemLayout} label="发票抬头">
                  {getFieldDecorator('invoiceTitle', {
                    initialValue: invoiceTitle,
                    rules: [
                      { required: true, message: '必须填写发票抬头' },
                      { min: 1, message: '发票抬头不可少于1个字符' },
                      { max: 50, message: '发票抬头最多可以输入50个字符' }
                    ]
                  })(
                    <Input
                      style={{ width: 450 }}
                      onChange={(e) => {
                        const val = (e.target as any).value;
                        onExtraInfoChange({
                          field: 'invoiceTitle',
                          val
                        });
                        this.setState({});
                      }}
                    />
                  )}
                </FormItem>
              )}
            {this.state.invoiceType == '0' &&
              invoiceProjectType == 1 && (
                <FormItem {...formItemLayout} label="纳税人识别号">
                  {getFieldDecorator('taxNo', {
                    initialValue: taxNo,
                    rules: [
                      {
                        pattern: ValidConst.tax,
                        message: '请输入正确的纳税人识别号且必须15-20字符'
                      }
                    ]
                  })(
                    <Input
                      style={{ width: 450 }}
                      placeholder="填写错误将不能作为税收凭证或无法报销"
                      onChange={(e) => {
                        const val = (e.target as any).value;
                        onExtraInfoChange({
                          field: 'taxNo',
                          val
                        });
                        this.setState({});
                      }}
                    />
                  )}
                </FormItem>
              )}
            {this.state.invoiceType == '1' && (
              <FormItem
                {...formItemLayout}
                label={<span>&nbsp;</span>}
                colon={false}
              >
                <Row>
                  <Col span={16}>
                    <p>单位全称:{invoiceResponse.get('companyName')}</p>
                    <p>
                      单位纳税人识别号:{invoiceResponse.get('taxpayerNumber')}
                    </p>
                    <p>单位电话:{invoiceResponse.get('companyPhone')}</p>
                    <p>地址:{invoiceResponse.get('companyAddress')}</p>
                    <p>银行基本户号:{invoiceResponse.get('bankNo')}</p>
                    <p>开户行:{invoiceResponse.get('bankName')}</p>
                  </Col>
                </Row>
              </FormItem>
            )}
            <FormItem {...formItemLayout} label=" " colon={false}>
              <Checkbox
                checked={this.props.sperator}
                defaultChecked={this.props.sperator}
                onChange={(_e: any) => {
                  const checked = this.props.sperator;
                  if (checked && !selectedCustomerId) {
                    message.error('请选择会员');
                    return;
                  }
                  onExtraInfoChange({
                    field: 'sperator',
                    val: !checked
                  });
                }}
              >
                使用单独的发票收货信息
              </Checkbox>
            </FormItem>
            {/*如果是独立发票地址*/}
            {this.props.sperator &&
              selectedCustomerId && (
                <FormItem label="收货信息" hasFeedback {...smallformItemLayout}>
                  <Radio.Group
                    value={selectedInvoiceAddrId}
                    onChange={(e: any) => {
                      const addrId = e.target.value;
                      this._store.onSelectInvoiceAddress(addrId);
                    }}
                  >
                    {addrs.map(
                      (v, k) =>
                        invoiceShowType === 2 || k < 10 ? (
                          <div key={k} className="addressDisplay">
                            <Radio value={v.get('deliveryAddressId')}>
                              收货人：{v.get('consigneeName')}&nbsp; 联系电话：{v.get(
                                'consigneeNumber'
                              )}&nbsp; 收货信息：{FindArea.addressInfo(
                                v.get('provinceId')
                                  ? v.get('provinceId').toString()
                                  : '',
                                v.get('cityId')
                                  ? v.get('cityId').toString()
                                  : '',
                                v.get('areaId')
                                  ? v.get('areaId').toString()
                                  : ''
                              )}
                              {v.get('deliveryAddress')}&nbsp;
                              {v.get('isDefaltAddress') === 1 ? '默认地址' : ''}
                            </Radio>
                          </div>
                        ) : null
                    )}
                    {invoiceShowType === 1 ? (
                      <a
                        href="javascript:void(0)"
                        onClick={() => {
                          invoiceShowMore(2);
                        }}
                      >
                        更多
                      </a>
                    ) : (
                      ''
                    )}
                    <div>
                      <Radio value="tempId">
                        <span style={{ color: '#F56C1D' }}>
                          没有可用地址，请填写临时地址
                        </span>
                      </Radio>
                    </div>
                  </Radio.Group>
                  <br />

                  <Row>
                    <Col>
                      <FormItem {...formItemLayout}>
                        {getFieldDecorator('invoiceAddress', {
                          initialValue: selectedInvoiceAddrId,
                          rules: [
                            {
                              required:
                                selectedCustomerId && this.props.sperator
                                  ? true
                                  : false,
                              message: '必须选择一个收货地址'
                            }
                          ]
                        })(<input type="hidden" />)}
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>
              )}

            {customerInvoiceTempAddressVisiable && (
              <Row>
                <Col offset={3}>
                  <FormItem
                    label="所在地区"
                    hasFeedback
                    {...addressformItemLayout}
                  >
                    {getFieldDecorator('invoiceConsigneeAddressIds', {
                      ...addressInit,
                      rules: [{ required: true, message: '请选择省市区' }]
                    })(
                      <AreaSelect
                        onChange={(val) => {
                          this._store.settingInvoiceTempAddress(
                            'tempAddress',
                            val
                          );
                        }}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    label="详细地址"
                    hasFeedback
                    {...addressformItemLayout}
                  >
                    {getFieldDecorator('invoiceConsigneeAddress', {
                      ...detailAddress,
                      rules: [
                        { required: true, message: '请填写详细地址' },
                        { min: 5, message: '详细地址长度必须为5-60个字符之间' },
                        { max: 60, message: '详细地址长度必须为5-60个字符之间' }
                      ]
                    })(
                      <Input
                        onChange={(val) =>
                          this._store.settingInvoiceTempAddress(
                            'address',
                            (val.target as any).value
                          )
                        }
                      />
                    )}
                  </FormItem>
                  <FormItem
                    label=" 收货人"
                    hasFeedback
                    {...addressformItemLayout}
                  >
                    {getFieldDecorator('invoiceConsigneeName', {
                      ...name,
                      rules: [
                        { required: true, message: '请填写收货人' },
                        {
                          validator: (rule, value, callback) => {
                            QMMethod.validatorMinAndMax(
                              rule,
                              value,
                              callback,
                              '收货人',
                              2,
                              15
                            );
                          }
                        }
                      ]
                    })(
                      <Input
                        onChange={(val) =>
                          this._store.settingInvoiceTempAddress(
                            'name',
                            (val.target as any).value
                          )
                        }
                      />
                    )}
                  </FormItem>
                  <FormItem
                    label="手机号码"
                    hasFeedback
                    {...addressformItemLayout}
                  >
                    {getFieldDecorator('invocieConsigneeDetailAddress', {
                      ...phone,
                      rules: [
                        { required: true, message: '请填写手机号码' },
                        {
                          pattern: ValidConst.phone,
                          message: '请输入正确的手机号码'
                        }
                      ]
                    })(
                      <Input
                        onChange={(val) =>
                          this._store.settingInvoiceTempAddress(
                            'phone',
                            (val.target as any).value
                          )
                        }
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            )}
          </div>
        )}

        {/*订单附件*/}

        <FormItem {...formItemLayout} label="订单附件">
          {getFieldDecorator('enclose', {
            initialValue: ''
          })(
            <div className="clearfix">
              <QMUpload
                disabled={selectedCustomerId ? false : true}
                name="uploadFile"
                style={styles.box}
                fileList={images}
                listType={'picture-card'}
                beforeUpload={this.beforeUpload}
                onChange={this._editImages}
                action={`${
                  Const.HOST
                }/store/uploadStoreResource?resourceType=IMAGE`}
                accept={'.jpg,.jpeg,.png,.gif'}
              >
                {images.length < 10 ? (
                  <Icon type="plus" style={styles.plus} />
                ) : null}
              </QMUpload>
              <div>
                <Tips title="支持的图片格式：jpg、jpeg、png、gif，文件大小不超过5M,最多上传10张" />
              </div>
            </div>
          )}
        </FormItem>

        {/*备注*/}
        <FormItem {...formItemLayout} label={<span>填写备注</span>} hasFeedback>
          {getFieldDecorator('buyerRemark', {
            rules: [{ max: 100, message: '最多可输入100个字符' }],
            initialValue: ''
          })(
            <Col span={24}>
              <Input.TextArea
                disabled={selectedCustomerId ? false : true}
                value={buyerRemark}
                onChange={(e) => {
                  if (!selectedCustomerId) {
                    message.error('请选择会员');
                    return;
                  }
                  const val = (e.target as any).value;
                  onExtraInfoChange({
                    field: 'buyerRemark',
                    val
                  });
                }}
              />
            </Col>
          )}
        </FormItem>
      </div>
    );
  }

  beforeUpload(file) {
    const isSupportImage =
      file.type === 'image/jpeg' ||
      file.type === 'image/gif' ||
      file.type == 'image/png';
    if (!isSupportImage) {
      message.error('只能上传jpg, png, gif类型的图片');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过5MB!');
    }
    return isSupportImage && isLt5M;
  }

  /**
   * 改变图片
   */
  _editImages = ({ file, fileList }) => {
    if (file.status == 'error') {
      message.error('上传失败');
    }

    // 规避有时没有生成缩略图导致页面图片展示不了的问题
    if (file.response) {
      fileList.map((v) => {
        if (v.uid === file.uid && !v.thumbUrl) {
          v.thumbUrl = v.response[0];
        }
      });
    }

    const { editImages } = this._store;
    editImages(fromJS(fileList));
  };
}

const styles = {
  title: {
    fontSize: 14,
    marginBottom: 10,
    display: 'block'
  },
  plus: {
    color: '#999',
    fontSize: '28px'
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  } as any
};
