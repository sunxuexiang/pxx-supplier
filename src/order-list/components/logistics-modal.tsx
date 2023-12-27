import * as React from 'react';
import {
  Modal,
  Form,
  Select,
  Input,
  Row,
  Col,
  Table,
  InputNumber,
  DatePicker,
  Radio,
  Icon,
  message
} from 'antd';
import { Relax } from 'plume2';
import { noop, ValidConst, QMUpload, Const, Tips, cache } from 'qmkit';
import { fromJS } from 'immutable';
import { IMap, IList } from 'typings/globalType';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import moment from 'moment';

const defaultMaxSize = 5 * 1024 * 1024;
const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

const noLableLayout = {
  labelCol: {
    span: 0
  },
  wrapperCol: {
    span: 24
  }
};

const allDeliveryWay = sessionStorage.getItem(cache.DELIVERYWAY)
  ? JSON.parse(sessionStorage.getItem(cache.DELIVERYWAY))
  : [];

@Relax
export default class LogisticsModal extends React.Component {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create()(LogisticsForm as any);
  }

  props: {
    relaxProps?: {
      detail: IMap;
      expressCompanyList: IList;
      logisticsCompanyList: IList;
      marketShipmentList: IList;
      shippingList: IList;
      visible: boolean;
      loading: boolean;
      closeLogisticsModal: Function;
      supplierDeliver: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    expressCompanyList: 'expressCompanyList',
    logisticsCompanyList: 'logisticsCompanyList',
    marketShipmentList: 'marketShipmentList',
    shippingList: 'shippingList',
    visible: 'visible',
    loading: 'loading',
    closeLogisticsModal: noop,
    supplierDeliver: noop
  };

  render() {
    const { relaxProps } = this.props;
    const { visible, loading } = relaxProps;
    const WrapperForm = this.WrapperForm;

    return (
      <Modal
        maskClosable={false}
        title="订单发货"
        visible={visible}
        centered
        okText="提交"
        onOk={this._handleSubmit}
        onCancel={this.onClose}
        width={1200}
        destroyOnClose
        confirmLoading={loading}
      >
        <WrapperForm
          ref={(form) => (this._form = form)}
          relaxProps={this.props.relaxProps}
        />
      </Modal>
    );
  }

  /**
   * 提交
   */
  _handleSubmit = () => {
    const { supplierDeliver } = this.props.relaxProps;
    const form = this._form as WrappedFormUtils;
    form.validateFields((errs, values) => {
      if (!errs) {
        //提交
        supplierDeliver(values, form);
      }
    });
  };

  onClose = () => {
    const { closeLogisticsModal } = this.props.relaxProps;
    closeLogisticsModal();
  };
}

class LogisticsForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  props: {
    form;
    relaxProps?: {
      detail: IMap;
      expressCompanyList: IList;
      logisticsCompanyList: IList;
      marketShipmentList: IList;
      shippingList: IList;
    };
  };

  render() {
    const { form, relaxProps } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const {
      detail,
      expressCompanyList,
      logisticsCompanyList,
      marketShipmentList,
      shippingList
    } = relaxProps;
    //处理赠品
    const gifts = (detail.get('gifts') ? detail.get('gifts') : fromJS([])).map(
      (gift) =>
        gift
          .set('skuName', `【赠品】${gift.get('skuName')}`)
          .set('levelPrice', 0)
          .set('isGift', true)
    );
    const deliverId = getFieldValue('deliverId');
    const deliverWay = detail ? detail.toJS().deliverWay : '';
    const logistics =
      (detail.get('tradeDelivers') &&
        detail.get('tradeDelivers').toJS()[0]?.logistics) ||
      {};
    const supplierDeliverWay =
      getFieldValue('supplierDeliverWay') ||
      (deliverWay === 1 || deliverWay === 8 ? 1 : 2);
    const columns = [
      {
        title: '序号',
        key: 'index',
        render: (_text, _row, index) => index + 1
      },
      {
        title: 'SKU编码',
        dataIndex: 'skuNo',
        key: 'skuNo'
      },
      {
        title: '商品名称',
        dataIndex: 'skuName',
        key: 'skuName'
      },
      {
        title: '规格',
        dataIndex: 'goodsSubtitle',
        key: 'goodsSubtitle'
      },
      {
        title: '生产日期',
        dataIndex: 'goodsBatchNo',
        key: 'goodsBatchNo',
        render: (param) => (param ? <div>{param}</div> : <div>-</div>)
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num'
      },
      {
        title: '发货数',
        dataIndex: 'deliveredNum',
        key: 'deliveredNum',
        render: (_, row) => {
          return (
            <FormItem {...noLableLayout} style={{ marginBottom: 0 }}>
              {getFieldDecorator(
                `deliveredNum${row.isGift ? 'isGift' : ''}${row.skuId}`,
                {
                  initialValue: row.num,
                  rules: [{ required: true, message: '请填写发货数' }]
                }
              )(<InputNumber min={0} max={row.num} />)}
            </FormItem>
          );
        }
      }
    ];
    return (
      <Form {...formItemLayout} style={styles.form}>
        <h3 style={{ marginBottom: '10px' }}>商品信息</h3>
        <Table
          bordered
          dataSource={detail
            .get('tradeItems')
            .concat(gifts)
            .toJS()}
          columns={columns}
          pagination={false}
        />
        <h3 style={{ marginTop: '10px' }}>物流信息</h3>

        <Row style={{ marginTop: '10px' }}>
          <Col span={12}>
            <FormItem label="订单配送">
              {this.showdeliverWay(deliverWay)}
            </FormItem>
          </Col>
          {deliverWay === 11 && (
            <React.Fragment>
              <Col span={12}>
                <FormItem label="请选择发货点">
                  {getFieldDecorator('shipmentSiteId', {
                    rules: [{ required: true, message: '请选择发货点' }]
                  })(
                    <Select>
                      {(shippingList || fromJS([])).toJS().map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.shippingName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="接货点地址">
                  <div style={{ lineHeight: '20px', paddingTop: '10px' }}>
                    {this.showshipAddressDetail(
                      getFieldValue('shipmentSiteId')
                    )}
                  </div>
                </FormItem>
              </Col>
            </React.Fragment>
          )}
          {deliverWay === 6 && (
            <Col span={12}>
              <FormItem label="自提地址">{this.getSelfPickAddress()}</FormItem>
            </Col>
          )}
          {deliverWay === 7 && (
            <React.Fragment>
              <Col span={12}>
                <FormItem label="请选择接货点">
                  {getFieldDecorator('shipmentSiteId', {
                    rules: [{ required: true, message: '请选择接货点' }]
                  })(
                    <Select
                      onChange={this.companyChange}
                      disabled={deliverWay === 1 || deliverWay === 8}
                    >
                      {(marketShipmentList || fromJS([])).toJS().map((item) => (
                        <Option key={item.siteId} value={item.siteId}>
                          {item.siteName}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={12}>
                    <FormItem label="接货点地址">
                      <div style={{ lineHeight: '20px', paddingTop: '10px' }}>
                        {this.showAddressDetail(
                          getFieldValue('shipmentSiteId')
                        )}
                      </div>
                    </FormItem>
                  </Col>
                  <Col span={12} style={{ display: 'none' }}>
                    <FormItem>
                      {getFieldDecorator('deliverId', {
                        initialValue: logistics.logisticStandardCode || ''
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="物流公司">
                      {getFieldDecorator('logisticCompanyName', {
                        initialValue: logistics.logisticCompanyName || ''
                      })(<Input disabled />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <FormItem label="运单号">
                  {getFieldDecorator('deliverNo', {
                    initialValue: logistics.logisticNo || ''
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </React.Fragment>
          )}
          {deliverWay !== 11 && deliverWay !== 6 && deliverWay !== 7 && (
            <React.Fragment>
              {/* <Col span={12}>
                <FormItem label="选择配送方式">
                  {getFieldDecorator('supplierDeliverWay', {
                    initialValue: deliverWay === 1 || deliverWay === 8 ? 1 : 2,
                    rules: [{ required: true, message: '请选择选择配送方式' }]
                  })(
                    <Radio.Group
                      disabled={deliverWay !== 4}
                      onChange={this.wayChange}
                    >
                      <Radio value={1}>物流</Radio>
                      <Radio value={2}>快递</Radio>
                      //<Radio value={4}>店铺配送</Radio>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col> */}
              {(supplierDeliverWay === 1 || supplierDeliverWay === 2) && (
                <React.Fragment>
                  <Col span={12}>
                    <FormItem
                      label={`${
                        supplierDeliverWay === 1 ? '物流' : '快递'
                      }公司`}
                      style={
                        deliverWay === 1 || deliverWay === 8
                          ? { display: 'none' }
                          : {}
                      }
                    >
                      {getFieldDecorator('deliverId', {
                        initialValue:
                          deliverWay === 1 || deliverWay === 8
                            ? Number(
                                detail.getIn(['logisticsCompanyInfo', 'id'])
                              )
                            : '',
                        rules: [
                          {
                            required: true,
                            message: `请选择${
                              supplierDeliverWay === 1 ? '物流' : '快递'
                            }公司`
                          }
                        ]
                      })(
                        supplierDeliverWay === 1 ? (
                          <Select
                            onChange={this.companyChange}
                            disabled={deliverWay === 1 || deliverWay === 8}
                          >
                            {/* {deliverWay === 1 ? (logisticsCompanyList || fromJS([]))
                              .toJS()
                              .map((item) => (
                                <Option key={item.id} value={item.id}>
                                  {item.logisticsName}
                                </Option>
                              )) : (
                              <Option key={Number(
                                detail.getIn(['logisticsCompanyInfo', 'id'])
                              )} value={Number(
                                detail.getIn(['logisticsCompanyInfo', 'id'])
                              )}>
                                {detail.getIn([
                                  'logisticsCompanyInfo',
                                  'logisticsCompanyName'
                                ])}
                              </Option>
                            )} */}
                            <Option
                              key={Number(
                                detail.getIn(['logisticsCompanyInfo', 'id'])
                              )}
                              value={Number(
                                detail.getIn(['logisticsCompanyInfo', 'id'])
                              )}
                            >
                              {detail.getIn([
                                'logisticsCompanyInfo',
                                'logisticsCompanyName'
                              ])}
                            </Option>
                          </Select>
                        ) : (
                          <Select onChange={this.companyChange}>
                            {expressCompanyList &&
                              (expressCompanyList || fromJS([]))
                                .toJS()
                                .map((item) => (
                                  <Option
                                    key={item.expressCompany.expressCompanyId}
                                    value={item.expressCompany.expressCompanyId}
                                  >
                                    {item.expressCompany.expressName}
                                  </Option>
                                ))}
                            <Option value={-1}>其他</Option>
                          </Select>
                        )
                      )}
                    </FormItem>
                    {(deliverWay === 1 || deliverWay === 8) && (
                      <FormItem label="物流公司">
                        {getFieldDecorator('logisticCompanyName', {
                          initialValue:
                            detail.getIn([
                              'logisticsCompanyInfo',
                              'logisticsCompanyName'
                            ]) || '',
                          rules: [{ required: true, message: '请填写物流公司' }]
                        })(<Input />)}
                      </FormItem>
                    )}
                  </Col>
                  {deliverId === -1 && !(deliverWay === 1 || deliverWay === 8) && (
                    <Col span={12}>
                      <FormItem label="其他">
                        {getFieldDecorator('otherCompany', {
                          initialValue: '',
                          rules: [
                            { required: true, message: '请填写其他快递公司' }
                          ]
                        })(<Input />)}
                      </FormItem>
                    </Col>
                  )}
                  <Col span={12}>
                    <FormItem
                      label={`${
                        supplierDeliverWay === 1 ? '物流' : '快递'
                      }单号`}
                    >
                      {getFieldDecorator('deliverNo', {
                        initialValue: ''
                      })(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem
                      label={`${
                        supplierDeliverWay === 1 ? '物流' : '快递'
                      }联系方式`}
                    >
                      {getFieldDecorator('logisticPhone', {
                        initialValue:
                          deliverWay === 1 || deliverWay === 8
                            ? detail.getIn([
                                'logisticsCompanyInfo',
                                'logisticsCompanyPhone'
                              ])
                            : '',
                        rules: [
                          { required: true, message: '请填写联系方式' },
                          {
                            pattern: ValidConst.phoneortele,
                            message: '请输入正确的联系方式'
                          }
                        ]
                      })(<Input />)}
                    </FormItem>
                  </Col>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
          <Col span={12}>
            <FormItem label="发货时间">
              {getFieldDecorator('deliverTime', {
                initialValue: moment(new Date()),
                rules: [{ required: true, message: '请选择发货时间' }]
              })(
                <DatePicker
                  showTime
                  disabledDate={(current) =>
                    current && current > moment().endOf('day')
                  }
                />
              )}
            </FormItem>
          </Col>
          {(deliverWay === 1 || deliverWay === 8) && (
            <Col span={12}>
              <FormItem label="物流单图片">
                {getFieldDecorator('encloses', {
                  initialValue: { fileList: [] }
                })(
                  <QMUpload
                    name={'uploadFile'}
                    action={
                      Const.HOST +
                      '/store/uploadStoreResource?resourceType=IMAGE'
                    }
                    fileList={getFieldValue('encloses').fileList}
                    listType={'picture-card'}
                    accept={'.jpg,.jpeg,.png,.gif'}
                    beforeUpload={this._checkUploadFile}
                  >
                    {getFieldValue('encloses') &&
                    getFieldValue('encloses').fileList.length > 0 ? null : (
                      <Icon type="plus" style={styles.plus} />
                    )}
                  </QMUpload>
                )}
                <Tips title="仅支持JPG，GIF，PNG，JPEG图片文件，且最大为5M，最多上传1张" />
              </FormItem>
            </Col>
          )}
        </Row>
      </Form>
    );
  }

  getSelfPickAddress = () => {
    const { detail } = this.props.relaxProps;
    let result = '';
    if (detail) {
      const netWorkVO = detail.toJS().netWorkVO;
      result = `${netWorkVO.provinceName}${netWorkVO.cityName}${netWorkVO.areaName}${netWorkVO.townName}  ${netWorkVO.contacts}: ${netWorkVO.phone}`;
    }
    return result;
  };
  showdeliverWay = (val) => {
    let result = '';
    allDeliveryWay.forEach((item) => {
      if (item.deliveryTypeId === val) {
        result = item.deliverWayDesc;
        return;
      }
    });
    return result;
  };
  // 配送方式change
  wayChange = () => {
    const { form } = this.props;
    form.resetFields([
      'deliverId',
      'otherCompany',
      'logisticPhone',
      'deliverTime',
      'deliverNo'
    ]);
  };
  // 公司change
  companyChange = (value) => {
    const { form, relaxProps } = this.props;
    const { logisticsCompanyList } = relaxProps;
    const { getFieldValue, setFieldsValue } = form;
    const supplierDeliverWay = getFieldValue('supplierDeliverWay');
    if (supplierDeliverWay === 1) {
      let phone = '';
      logisticsCompanyList.toJS().forEach((item) => {
        if (item.id === value) {
          phone = item.logisticsPhone;
        }
      });
      setFieldsValue({
        logisticPhone: phone
      });
    }
  };

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

  // 接货点详细地址
  showAddressDetail = (id) => {
    const { marketShipmentList } = this.props.relaxProps;
    let result = '';
    marketShipmentList.toJS().forEach((item) => {
      if (item.siteId === id) {
        result = `${item.provinceName}${item.cityName}${item.districtName}${item.street}${item.address}`;
      }
    });
    return result;
  };
  // 发货点详细地址
  showshipAddressDetail = (id) => {
    const { shippingList } = this.props.relaxProps;
    let result = '';
    shippingList.toJS().forEach((item) => {
      if (item.id === id) {
        result = `${item.provinceName}${item.cityName}${item.districtName}${item.streetName}${item.detailAddress}
          ${item.shippingPerson}/${item.shippingPhone}`;
      }
    });
    return result;
  };
}

const styles = {
  form: {
    maxHeight: '800px',
    overflowY: 'auto'
  }
} as any;
