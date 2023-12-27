import React from 'react';
import {
  goodsFreeSaveRequestsQL,
  goodsExpressSaveRequestsQL,
  goodsExpressFormQL,
  goodsFreeFormQL
} from '../ql';

import {
  Form,
  Input,
  Radio,
  TreeSelect,
  Button,
  Table,
  Checkbox,
  Icon,
  Select,
  Modal,
  Col
} from 'antd';
import {
  QMMethod,
  FindArea,
  ValidConst,
  AreaSelect,
  noop,
  history
} from 'qmkit';
import { fromJS } from 'immutable';
import styled from 'styled-components';
const FormDiv = styled.div`
  .ant-table-content {
    .ant-row {
      margin-bottom: 0;
      input {
        text-align: center;
      }
    }
  }
  .ant-form-item-label {
    width: 100px;
  }
  .ant-radio-group {
    .radio-item {
      margin-bottom: 5px;
    }
    .ant-row {
      display: inline-block;
      margin-bottom: 0;
      .has-error {
        margin-bottom: 13px;
        .ant-form-explain,
        .show-help-leave,
        .show-help-enter {
          position: absolute;
          width: 200px;
        }
      }
      .has-success {
        .ant-form-explain,
        .show-help-leave,
        .show-help-enter {
          position: absolute;
          width: 200px;
        }
      }
    }
  }
  .pl3 {
    padding-left: 3px;
  }
  .pr3 {
    padding-right: 3px;
  }
  .set-condition {
    .moreForeItem {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .has-error {
      .ant-form-explain,
      .show-help-leave,
      .show-help-enter {
        position: absolute;
        width: 300px;
        text-align: left;
      }
    }
    .has-success {
      .ant-form-explain,
      .show-help-leave,
      .show-help-enter {
        position: absolute;
        width: 300px;
        text-align: left;
      }
    }
  }
  .areaBox {
    .ant-cascader-picker {
      width: 350px;
    }
  }
  .treeSelectBox {
    .ant-row {
      width: 100%;
      .ant-select {
        width: 100%;
      }
    }
  }
`;
const InlineBDiv = styled.div`
  display: inline-block;
`;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 21
  }
};
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const Confirm = Modal.confirm;

const FREIGHT_TEMP = {
  0: { unit: '件', label: '件', options: '件数' },
  1: { unit: 'kg', label: '重', options: '重量' },
  2: { unit: 'm³', label: '体积', options: '体积' },
  3: { unit: 'kg', label: '重', options: '重量' }
};

const PLACE_HOLDER = {
  0: { unit: '1-9999', money: '0.00-9999.99' },
  1: { unit: '0.1-9999.9', money: '0.00-9999.99' },
  2: { unit: '0.001-999.999', money: '0.00-9999.99' },
  3: { unit: '0.1-9999.9', money: '0.00-9999.99' }
};

/**
 * 运费模板
 */

export default class FreightTemp extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      // 运费模板名称
      freightTempName: string;
      // 省份Id
      provinceId: number;
      // 城市Id
      cityId: number;
      // 区域Id
      areaId: number;
      // 是否包邮
      freightFreeFlag: number;
      // 计价方式(0: 按件数,1: 按重量,2: 按体积,2: 按重量/箱)
      valuationType: number;
      // 单品运费模板指定包邮条件
      goodsFreeSaveRequests: any[];
      // 快递运送
      goodsExpressSaveRequests: any[];
      // 是否指定包邮条件
      specifyTermFlag: number;
      // 是否默认
      defaultFlag: number;
      // 快递配送formId
      goodsExpressForm: string[];
      // 包邮formId
      goodsFreeForm: string[];

      // 区域存储
      areaSave: Function;
      // 存储单品运费模板
      saveGoodsFreight: Function;
      // 修改指定字段值
      changeFieldValue: Function;
      // 更改freeRequest指定字段值
      goodsFreeSaveRequestsFieldValue: Function;
      // 添加运送方式
      shippingTypeAdd: Function;
      // 移除运送方式
      shippingTypeSub: Function;
      // 设置配送地区
      changeAreaIds: Function;
      // 更改expressRequest指定字段值
      goodsExpressSaveRequestsFieldValue: Function;
      // 包邮运费模板新增
      goodsFreeAdd: Function;
      // 包邮运费模板删除
      goodsFreeSub: Function;
      // 更改是否包邮
      changeFreightFree: Function;
      // 更改是否按指定条件包邮
      changeSpecifyTermFlag: Function;
      // 更改指定包邮地区
      changeFreeAreaIds: Function;
      // 更改计价方式
      changeValuationType: Function;
      // 仓库id
      wareId: string;
      // 页面来源
      pageType: number;
    };
  };

  static relaxProps = {
    freightTempName: 'freightTempName',
    provinceId: 'provinceId',
    cityId: 'cityId',
    wareId: 'wareId',
    areaId: 'areaId',
    freightFreeFlag: 'freightFreeFlag',
    valuationType: 'valuationType',
    goodsFreeSaveRequests: goodsFreeSaveRequestsQL,
    goodsExpressSaveRequests: goodsExpressSaveRequestsQL,
    specifyTermFlag: 'specifyTermFlag',
    defaultFlag: 'defaultFlag',
    goodsExpressForm: goodsExpressFormQL,
    goodsFreeForm: goodsFreeFormQL,
    pageType: 'pageType',

    areaSave: noop,
    saveGoodsFreight: noop,
    changeFieldValue: noop,
    goodsFreeSaveRequestsFieldValue: noop,
    shippingTypeAdd: noop,
    shippingTypeSub: noop,
    changeAreaIds: noop,
    goodsExpressSaveRequestsFieldValue: noop,
    goodsFreeAdd: noop,
    goodsFreeSub: noop,
    changeFreightFree: noop,
    changeSpecifyTermFlag: noop,
    changeFreeAreaIds: noop,
    changeValuationType: noop
  };

  render() {
    let aIds = [];
    const { form } = this.props;
    const {
      freightTempName,
      provinceId,
      cityId,
      areaId,
      freightFreeFlag,
      valuationType,
      goodsFreeSaveRequests,
      goodsExpressSaveRequests,
      specifyTermFlag,
      defaultFlag,

      areaSave,
      changeFieldValue,
      shippingTypeSub,
      changeAreaIds,
      goodsExpressSaveRequestsFieldValue,
      goodsFreeSub,
      goodsFreeAdd,
      changeSpecifyTermFlag,
      changeFreeAreaIds,
      wareId,
      pageType
    } = this.props.relaxProps;
    if (provinceId && cityId && areaId) {
      aIds = [`${provinceId}`, `${cityId}`, `${areaId}`];
    }

    const tProps = {
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '请选择地区',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' }
    };

    const { getFieldDecorator } = form;
    const couponCates = JSON.parse(localStorage.getItem('warePage')) || [];
    return (
      <FormDiv>
        <Form>
          <FormItem {...formItemLayout} label="模板名称" required={true}>
            {getFieldDecorator('freightTempName', {
              initialValue: freightTempName,
              rules: [
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorTrimMinAndMax(
                      rule,
                      value,
                      callback,
                      '模板名称',
                      2,
                      20
                    );
                  }
                }
              ]
            })(
              <Input
                style={{ width: 350 }}
                disabled={defaultFlag == 1}
                placeholder="模板名称限制2-20个字符"
                onChange={(e) =>
                  changeFieldValue({
                    field: 'freightTempName',
                    value: e.target.value
                  })
                }
              />
            )}
          </FormItem>
          <div className="areaBox">
            <FormItem {...formItemLayout} required={true} label="发货地址">
              {getFieldDecorator('area', {
                initialValue: aIds,
                rules: [{ required: true, message: '请选择发货地址' }]
              })(
                <AreaSelect
                  placeholder="请选择发货地址"
                  getPopupContainer={() =>
                    document.getElementById('page-content')
                  }
                  onChange={(value) => areaSave(value)}
                />
              )}
            </FormItem>
          </div>
          <FormItem {...formItemLayout} required={true} label="发货仓">
            <Col span={9}>
              {getFieldDecorator('wareId', {
                initialValue: wareId ? wareId : undefined,
                rules: [
                  {
                    validator: (_rule, value, callback) => {
                      if (value && value.length < 1) {
                        callback('必须选择发货仓');
                        return;
                      }
                      callback();
                    }
                  }
                ]
              })(
                <Select
                  // mode="multiple"
                  placeholder="请选择发货仓"
                  onChange={(value) => {
                    changeFieldValue({
                      field: 'wareId',
                      value: value
                    });
                  }}
                >
                  {couponCates.map((cate) => {
                    return <Option value={cate.wareId}>{cate.wareName}</Option>;
                  })}
                </Select>
              )}
            </Col>
          </FormItem>

          <FormItem {...formItemLayout} label="是否包邮" required={true}>
            <RadioGroup
              onChange={(e: any) => this._changeFreightFreeFlag(e.target.value)}
              value={freightFreeFlag}
            >
              <Radio value={0}>买家承担运费</Radio>
              <Radio value={1}>卖家承担运费</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="计价方式" required={true}>
            <RadioGroup
              disabled={freightFreeFlag == 1}
              value={valuationType}
              onChange={(e: any) => this._changeFieldValue(e.target.value)}
            >
              <Radio value={0}>按件数</Radio>
              <Radio value={1}>按重量</Radio>
              <Radio value={2}>按体积</Radio>
              <Radio value={3}>按重量/件</Radio>
            </RadioGroup>
          </FormItem>

          <FormItem {...formItemLayout} label="运送方式" required={true}>
            <Radio defaultChecked>
              {pageType == 1 ? '同城配送' : '快递配送'}
            </Radio>
            <label style={{ color: '#b5b5b5' }}>{`请为${
              pageType == 1 ? '同城配送' : '快递配送'
            }设置运费模板`}</label>
            <Table
              rowKey="id"
              bordered={true}
              pagination={false}
              columns={[
                {
                  title: '配送地区',
                  dataIndex: 'destinationArea',
                  key: 'destinationArea',
                  width: '32%',
                  render: (text, record, index) => {
                    return record.defaultFlag == 1 || index == 0 ? (
                      <div>
                        默认
                        <span style={{ color: '#b5b5b5' }}>
                          除指定地区外，其余地区的运费采用“默认运费”
                        </span>
                      </div>
                    ) : (
                      <div className="treeSelectBox">
                        <FormItem>
                          {getFieldDecorator(`destinationArea${record.id}`, {
                            initialValue: text,
                            rules: [
                              {
                                required: true,
                                message: '请选择地区'
                              }
                            ]
                          })(
                            <TreeSelect
                              {...tProps}
                              treeData={this._buildExpressAreaData(record.id)}
                              onChange={(value, label) => {
                                changeAreaIds(record.id, value, label);
                              }}
                              filterTreeNode={(input, treeNode) =>
                                treeNode.props.title
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            />
                          )}
                        </FormItem>
                      </div>
                    );
                  }
                },
                {
                  title: `首${FREIGHT_TEMP[valuationType].label}(${FREIGHT_TEMP[valuationType].unit})`,
                  dataIndex: 'freightStartNum',
                  key: 'freightStartNum',
                  width: '15%',
                  render: (text, record) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `freightStartNum${record.id}${freightFreeFlag}`,
                          {
                            initialValue: text,
                            rules: this._rules(valuationType, '首', false)
                          }
                        )(
                          <Input
                            disabled={freightFreeFlag == 1}
                            placeholder={PLACE_HOLDER[valuationType].unit}
                            onChange={(e) =>
                              goodsExpressSaveRequestsFieldValue(
                                record.id,
                                'freightStartNum',
                                e.target.value
                              )
                            }
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  title: '首费(元)',
                  dataIndex: 'freightStartPrice',
                  key: 'freightStartPrice',
                  width: '15%',
                  render: (text, record) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `freightStartPrice${record.id}${freightFreeFlag}`,
                          {
                            initialValue: text,
                            rules: this._rules(valuationType, '', true)
                          }
                        )(
                          <Input
                            disabled={freightFreeFlag == 1}
                            placeholder={PLACE_HOLDER[valuationType].money}
                            onChange={(e) =>
                              goodsExpressSaveRequestsFieldValue(
                                record.id,
                                'freightStartPrice',
                                e.target.value
                              )
                            }
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  title: `续${FREIGHT_TEMP[valuationType].label}(${FREIGHT_TEMP[valuationType].unit})`,
                  dataIndex: 'freightPlusNum',
                  key: 'freightPlusNum',
                  width: '15%',
                  render: (text, record) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `freightPlusNum${record.id}${freightFreeFlag}`,
                          {
                            initialValue: text,
                            rules: this._rules(valuationType, '续', false)
                          }
                        )(
                          <Input
                            disabled={freightFreeFlag == 1}
                            placeholder={PLACE_HOLDER[valuationType].unit}
                            onChange={(e) =>
                              goodsExpressSaveRequestsFieldValue(
                                record.id,
                                'freightPlusNum',
                                e.target.value
                              )
                            }
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  title: '续费(元)',
                  dataIndex: 'freightPlusPrice',
                  key: 'freightPlusPrice',
                  width: '15%',
                  render: (text, record) => {
                    return (
                      <FormItem>
                        {getFieldDecorator(
                          `freightPlusPrice${record.id}${freightFreeFlag}`,
                          {
                            initialValue: text,
                            rules: this._rules(valuationType, '', true)
                          }
                        )(
                          <Input
                            disabled={freightFreeFlag == 1}
                            placeholder={PLACE_HOLDER[valuationType].money}
                            onChange={(e) =>
                              goodsExpressSaveRequestsFieldValue(
                                record.id,
                                'freightPlusPrice',
                                e.target.value
                              )
                            }
                          />
                        )}
                      </FormItem>
                    );
                  }
                },
                {
                  title: '操作',
                  dataIndex: 'operation',
                  key: 'operation',
                  width: '8%',
                  render: (_text, record, index) => {
                    return record.defaultFlag == 1 || index == 0 ? (
                      <Icon
                        type="plus"
                        onClick={() =>
                          freightFreeFlag == 1 ? noop : this._shippingTypeAdd()
                        }
                        style={
                          freightFreeFlag == 1
                            ? styles.disabledIcon
                            : styles.icon
                        }
                      />
                    ) : (
                      <Icon
                        type="minus"
                        onClick={() => shippingTypeSub(record.id)}
                        style={styles.icon}
                      />
                    );
                  }
                }
              ]}
              dataSource={goodsExpressSaveRequests}
            />
            {valuationType != 3 && (
              <>
                <Checkbox
                  disabled={freightFreeFlag == 1}
                  checked={specifyTermFlag == 1}
                  onChange={(e) =>
                    changeSpecifyTermFlag(e.target.checked ? 1 : 0)
                  }
                >
                  指定条件包邮
                </Checkbox>
                <Table
                  rowKey="id"
                  bordered={true}
                  pagination={false}
                  columns={[
                    {
                      title: '配送地区',
                      dataIndex: 'destinationArea',
                      key: 'destinationArea',
                      width: '20%',
                      render: (_text, record) => {
                        return (
                          <div className="treeSelectBox">
                            <FormItem>
                              {getFieldDecorator(
                                `destinationArea${record.id}`,
                                {
                                  initialValue: record.destinationArea,
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择地区'
                                    }
                                  ]
                                }
                              )(
                                <TreeSelect
                                  {...tProps}
                                  treeData={this._buildFreeAreaData(record.id)}
                                  onChange={(value, label) => {
                                    changeFreeAreaIds(record.id, value, label);
                                  }}
                                  filterTreeNode={(input, treeNode) =>
                                    treeNode.props.title
                                      .toLowerCase()
                                      .indexOf(input.toLowerCase()) >= 0
                                  }
                                />
                              )}
                            </FormItem>
                          </div>
                        );
                      }
                    },
                    {
                      title: '运送方式',
                      dataIndex: 'deliverWay',
                      key: 'deliverWay',
                      width: '20%',
                      render: () => {
                        return (
                          <Select defaultValue="1">
                            <Option value="1">
                              {pageType == 1 ? '同城配送' : '快递配送'}
                            </Option>
                          </Select>
                        );
                      }
                    },
                    {
                      title: '设置包邮条件',
                      dataIndex: 'conditionType',
                      key: 'conditionType',
                      width: '52%',
                      render: (text, record) => {
                        return (
                          <div className="set-condition">
                            <Select
                              defaultValue="0"
                              value={text.toString()}
                              onChange={(value) => {
                                this._conditionTypeChange(record.id, value);
                              }}
                              style={{ width: 110, marginTop: 3 }}
                            >
                              <Option value="0">
                                {FREIGHT_TEMP[valuationType].options}
                              </Option>
                              <Option value="1">金额</Option>
                              <Option value="2">
                                {FREIGHT_TEMP[valuationType].options}+金额
                              </Option>
                            </Select>
                            {this._freeConditions(valuationType, record)}
                          </div>
                        );
                      }
                    },
                    {
                      title: '操作',
                      dataIndex: 'operation',
                      key: 'operation',
                      width: '8%',
                      render: (_text, record, index) => {
                        return index == 0 ? (
                          <Icon
                            type="plus"
                            onClick={() => goodsFreeAdd()}
                            style={styles.icon}
                          />
                        ) : (
                          <Icon
                            type="minus"
                            onClick={() => goodsFreeSub(record.id)}
                            style={styles.icon}
                          />
                        );
                      }
                    }
                  ]}
                  dataSource={specifyTermFlag == 1 ? goodsFreeSaveRequests : []}
                />
              </>
            )}
          </FormItem>
          <div className="bar-button">
            <Button
              onClick={() => this._save()}
              type="primary"
              style={{ marginRight: 10, marginLeft: 22 }}
            >
              保存
            </Button>
            <Button
              onClick={() =>
                // history.push({
                //   pathname:
                //     pageType === 0
                //       ? '/delivery-to-home'
                //       : '/delivery-to-same-city',
                //   state: { type: 'temp' }
                // })
                history.push({
                  pathname: '/logistics-tabs',
                  state: { mainTab: '4', tab: 1 }
                })
              }
            >
              取消
            </Button>
          </div>
        </Form>
      </FormDiv>
    );
  }

  /**
   * 保存
   */
  _save = () => {
    const { saveGoodsFreight } = this.props.relaxProps;
    this.props.form.validateFieldsAndScroll(null, (errs) => {
      //如果校验通过
      if (!errs) {
        saveGoodsFreight();
      }
    });
  };

  /**
   * 是否包邮
   */
  _freeConditions = (valuationType, record) => {
    const { form } = this.props;
    const { goodsFreeSaveRequestsFieldValue } = this.props.relaxProps;
    const { getFieldDecorator } = form;
    // 按件数
    if (valuationType == 0) {
      if (record.conditionType == 0) {
        return (
          <FormItem>
            <InlineBDiv>
              <span className="pl3 pr3">满</span>
              {getFieldDecorator(`conditionOne${record.id}`, {
                initialValue: record.conditionOne,
                rules: this._freeConditionRules(valuationType, false)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionOne',
                      e.target.value
                    )
                  }
                />
              )}
              <span className="pl3">
                {FREIGHT_TEMP[valuationType].unit} 包邮
              </span>
            </InlineBDiv>
          </FormItem>
        );
      } else if (record.conditionType == 1) {
        return (
          <FormItem>
            <InlineBDiv>
              <span className="pl3 pr3">满</span>
              {getFieldDecorator(`conditionTwo${record.id}`, {
                initialValue: record.conditionTwo,
                rules: this._freeConditionRules(valuationType, true)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionTwo',
                      e.target.value
                    )
                  }
                />
              )}
              <span className="pl3">元 包邮</span>
            </InlineBDiv>
          </FormItem>
        );
      } else {
        return (
          <div className="moreForeItem">
            <span className="pl3 pr3">满</span>
            <FormItem>
              {getFieldDecorator(`conditionOne${record.id}`, {
                initialValue: record.conditionOne,
                rules: this._freeConditionRules(valuationType, false)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionOne',
                      e.target.value
                    )
                  }
                />
              )}
            </FormItem>
            <span className="pl3 pr3">
              {FREIGHT_TEMP[valuationType].unit}, 且满
            </span>
            <FormItem>
              {getFieldDecorator(`conditionTwo${record.id}`, {
                initialValue: record.conditionTwo,
                rules: this._freeConditionRules(valuationType, true)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionTwo',
                      e.target.value
                    )
                  }
                />
              )}
              <span className="pl3 pr3">元以上 包邮</span>
            </FormItem>
          </div>
        );
      }
    } else {
      // 按重量 || 按体积
      if (record.conditionType == 0) {
        return (
          <FormItem>
            <InlineBDiv>
              <span className="pl3 pr3">在</span>
              {getFieldDecorator(`conditionOne${record.id}`, {
                initialValue: record.conditionOne,
                rules: this._freeConditionRules(valuationType, false)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionOne',
                      e.target.value
                    )
                  }
                />
              )}
              <span className="pl3">
                {FREIGHT_TEMP[valuationType].unit}内 包邮
              </span>
            </InlineBDiv>
          </FormItem>
        );
      } else if (record.conditionType == 1) {
        return (
          <FormItem>
            <InlineBDiv>
              <span className="pl3 pr3">满</span>
              {getFieldDecorator(`conditionTwo${record.id}`, {
                initialValue: record.conditionTwo,
                rules: this._freeConditionRules(valuationType, true)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionTwo',
                      e.target.value
                    )
                  }
                />
              )}
              <span>元 包邮</span>
            </InlineBDiv>
          </FormItem>
        );
      } else {
        return (
          <div className="moreForeItem">
            <span className="pl3 pr3">在</span>
            <FormItem>
              {getFieldDecorator(`conditionOne${record.id}`, {
                initialValue: record.conditionOne,
                rules: this._freeConditionRules(valuationType, false)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionOne',
                      e.target.value
                    )
                  }
                />
              )}
            </FormItem>
            <span className="pl3 pr3">
              {FREIGHT_TEMP[valuationType].unit} 以内, 且满
            </span>
            <FormItem>
              {getFieldDecorator(`conditionTwo${record.id}`, {
                initialValue: record.conditionTwo,
                rules: this._freeConditionRules(valuationType, true)
              })(
                <Input
                  style={{ width: 80, textAlign: 'center' }}
                  onChange={(e) =>
                    goodsFreeSaveRequestsFieldValue(
                      record.id,
                      'conditionTwo',
                      e.target.value
                    )
                  }
                />
              )}
            </FormItem>
            <span className="pl3">元以上 包邮</span>
          </div>
        );
      }
    }
  };

  /**
   * 获取规则
   */
  _rules = (valuationType, text, flag) => {
    let rules = fromJS([]);
    if (this.props.relaxProps.freightFreeFlag == 0) {
      if (flag) {
        rules = fromJS([
          {
            validator: (_rule, value, callback) => {
              if (value || value == '0') {
                if (!ValidConst.zeroPrice.test(value)) {
                  callback('请填写两位小数的合法金额');
                }
                if (!(value < 10000 && value >= 0)) {
                  callback('最大值为9999.99');
                }
              } else {
                callback('请输入金额');
              }
              callback();
            }
          }
        ]);
      } else {
        rules = fromJS([
          {
            required: true,
            message: `请输入${text}${FREIGHT_TEMP[valuationType].label}`
          }
        ]);
        if (valuationType == 0) {
          rules = rules.concat(
            fromJS([
              {
                validator: (_rule, value, callback) => {
                  if (value) {
                    if (!ValidConst.noZeroNumber.test(value)) {
                      callback('请填写合法的数字');
                    }
                    if (!(value <= 9999 && value >= 1)) {
                      callback('请输入1-9999之间的整数');
                    }
                  }
                  callback();
                }
              }
            ])
          );
        } else if (valuationType == 1 || valuationType == 3) {
          rules = rules.concat([
            {
              validator: (_rule, value, callback) => {
                if (value) {
                  if (!ValidConst.singleDecimal.test(value)) {
                    callback('请输入合法的一位小数');
                  }
                  if (!(value < 10000 && value > 0)) {
                    callback('请输入0.1-9999.9之间的小数');
                  }
                }
                callback();
              }
            }
          ]);
        } else {
          rules = rules.concat([
            {
              validator: (_rule, value, callback) => {
                if (value) {
                  if (!ValidConst.three.test(value)) {
                    callback('请输入合法的小数');
                  }
                  if (!(value < 1000 && value > 0)) {
                    callback('请输入0.001-999.999之间的小数');
                  }
                }
                callback();
              }
            }
          ]);
        }
      }
    }

    return rules.toJS();
  };

  /**
   * 包邮条件规则展示
   */
  _freeConditionRules = (valuationType, flag) => {
    let rules = fromJS([]);
    if (this.props.relaxProps.freightFreeFlag == 0) {
      if (flag) {
        rules = fromJS([
          {
            validator: (_rule, value, callback) => {
              if (value) {
                if (!ValidConst.price.test(value)) {
                  callback('请输入合法的金额');
                }
                if (!(value < 10000000000 && value > 0)) {
                  callback('请输入0.01-9999999999.99之间的金额');
                }
              } else {
                callback('请输入金额');
              }
              callback();
            }
          }
        ]);
      } else {
        rules = fromJS([
          {
            required: true,
            message: `请输入${FREIGHT_TEMP[valuationType].options}`
          }
        ]);
        if (valuationType == 0) {
          rules = rules.concat(
            fromJS([
              {
                validator: (_rule, value, callback) => {
                  if (value) {
                    if (!ValidConst.noZeroNumber.test(value)) {
                      callback('请输入合法的整数');
                    }
                    if (!(value <= 9999 && value >= 1)) {
                      callback('请输入1-9999之间的整数');
                    }
                  }
                  callback();
                }
              }
            ])
          );
        } else if (valuationType == 1) {
          // 重量
          rules = rules.concat(
            fromJS([
              {
                validator: (_rule, value, callback) => {
                  if (value) {
                    if (!ValidConst.singleDecimal.test(value)) {
                      callback('请输入合法的一位小数');
                    }
                    if (!(value < 10000 && value > 0)) {
                      callback('请输入0.1-9999.9之间的数值');
                    }
                  }
                  callback();
                }
              }
            ])
          );
        } else {
          rules = rules.concat(
            fromJS([
              {
                validator: (_rule, value, callback) => {
                  if (value) {
                    if (!ValidConst.singleDecimal.test(value)) {
                      callback('请输入合法的一位小数');
                    }
                    if (!(value < 1000 && value > 0)) {
                      callback('请输入0.1-999.9之间的数值');
                    }
                  }
                  callback();
                }
              }
            ])
          );
        }
      }
    }
    return rules.toJS();
  };

  /**
   * 切换计价方式重置表单
   */
  _changeFieldValue = (value) => {
    const self = this;
    const { goodsExpressForm } = this.props.relaxProps;
    Confirm({
      title: '提示',
      content: '切换计价方式，原运费设置无法恢复，确定继续么？',
      iconType: 'exclamation-circle',
      onOk() {
        self.props.relaxProps.changeValuationType(value);
        self.props.form.resetFields(goodsExpressForm);
      }
    });
  };

  /**
   * 包邮条件更改
   */
  _conditionTypeChange = (id, value) => {
    this.props.relaxProps.goodsFreeSaveRequestsFieldValue(
      id,
      'conditionType',
      value
    );
    const { goodsFreeForm } = this.props.relaxProps;
    this.props.form.resetFields(goodsFreeForm);
  };

  /**
   * 更改是否包邮
   */
  _changeFreightFreeFlag = (value) => {
    const self = this;
    const {
      changeFieldValue,
      changeFreightFree,
      goodsExpressForm
    } = this.props.relaxProps;
    if (value == 1) {
      Confirm({
        title: '提示',
        content:
          '切换卖家承担运费，所有区域的运费将设置为0元且原运费设置无法恢复，确定继续么？',
        iconType: 'exclamation-circle',
        onOk() {
          changeFieldValue({ field: 'freightFreeFlag', value });
          changeFieldValue({
            field: 'specifyTermFlag',
            value: 0
          });
          changeFreightFree(value == 1);
          self.props.form.resetFields(goodsExpressForm);
        }
      });
    } else {
      changeFieldValue({ field: 'freightFreeFlag', value });
      changeFreightFree(value == 1);
    }
  };

  /**
   * 新增运费模板
   */
  _shippingTypeAdd = () => {
    this.props.relaxProps.shippingTypeAdd();
  };

  /**
   * 构建配送地区数据
   */
  _buildExpressAreaData = (id) => {
    const { goodsExpressSaveRequests } = this.props.relaxProps;
    const ids = fromJS(goodsExpressSaveRequests)
      .filter((f) => f.get('id') != id)
      .flatMap((m) => m.get('destinationArea'))
      .toJS();
    return FindArea.findProvinceCity(ids);
  };

  /**
   * 构建包邮地区数据
   */
  _buildFreeAreaData = (id) => {
    const { goodsFreeSaveRequests } = this.props.relaxProps;
    const ids = fromJS(goodsFreeSaveRequests)
      .filter((f) => f.get('id') != id)
      .flatMap((m) => m.get('destinationArea'))
      .toJS();
    return FindArea.findProvinceCity(ids);
  };
}

const styles = {
  icon: {
    fontSize: 16,
    color: '#08c',
    fontWeight: 'bolder'
  },
  disabledIcon: {
    fontSize: 16,
    color: '#ccc',
    fontWeight: 'bolder'
  }
} as any;
