import React from 'react';

import { Form, Input, Radio, TreeSelect, Button, Col, Select } from 'antd';
import { QMMethod, FindArea, ValidConst, noop, history } from 'qmkit';
import { IList } from 'typings/globalType';
import styled from 'styled-components';
const FormDiv = styled.div`
  .ant-form-item-label {
    width: 100px;
  }
  #freightTempName {
    width: 350px;
  }
  .ant-select-selection {
    width: 350px;
  }
  .ant-radio-group {
    .radio-item {
      margin-bottom: 5px;
    }
    .ant-row {
      display: inline-block;
      margin-bottom: 0;
      #satisfyFreight,
      #fixedFreight,
      #satisfyPrice {
        width: 100px;
        text-align: center;
      }
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
`;

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 20
  }
};
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const RadioGroup = Radio.Group;
const Option = Select.Option;
/**
 * 运费模板
 */
export default class FreightTemp extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      // 运费模板Id
      freightTempId: string;
      // 模板名称
      freightTempName: string;
      // 仓库id
      wareId: string;
      // 区域Ids
      destinationArea: IList;
      // 运送方式
      freightType: number;
      // 不满*元
      satisfyPrice: number;
      // 运费
      satisfyFreight: number;
      // 固定运费
      fixedFreight: number;
      // 已经被选中的地区Id
      selectedAreas: IList;
      // 是否默认 1默认 0非默认
      defaultFlag: number;
      // 配送地区
      destinationAreaName: IList;
      // 来源 0 快递到家 1同城配送
      pageType: number;

      // 区域设置
      areaIdsSave: Function;
      // 根据字段修改值
      storeFreightFieldsValue: Function;
      // 存储运费模板
      saveStoreFreight: Function;
    };
  };

  static relaxProps = {
    freightTempId: 'freightTempId',
    freightTempName: 'freightTempName',
    wareId: 'wareId',
    destinationArea: 'destinationArea',
    freightType: 'freightType',
    satisfyPrice: 'satisfyPrice',
    satisfyFreight: 'satisfyFreight',
    fixedFreight: 'fixedFreight',
    selectedAreas: 'selectedAreas',
    defaultFlag: 'defaultFlag',
    destinationAreaName: 'destinationAreaName',
    pageType: 'pageType',

    areaIdsSave: noop,
    storeFreightFieldsValue: noop,
    saveStoreFreight: noop
  };

  render() {
    const {
      freightTempName,
      destinationArea,
      freightType,
      satisfyPrice,
      satisfyFreight,
      fixedFreight,
      storeFreightFieldsValue,
      selectedAreas,
      destinationAreaName,
      defaultFlag,
      wareId,
      pageType
    } = this.props.relaxProps;
    const treeData = FindArea.findProvinceCity(selectedAreas.toJS());
    console.log('3333333334444444444444', treeData);
    const tProps = {
      treeData,
      onChange: this._changeArea,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder:
        defaultFlag == 1 ? destinationAreaName.toJS().toString() : '请选择地区',
      dropdownStyle: { maxHeight: 400, overflow: 'auto' },
      disabled: defaultFlag == 1,
      style: {
        width: 350
      }
    };

    const { getFieldDecorator } = this.props.form;
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
                disabled={defaultFlag == 1}
                placeholder="模板名称限制2-20个字符"
                onChange={(e) =>
                  storeFreightFieldsValue({
                    field: 'freightTempName',
                    value: e.target.value
                  })
                }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="配送方式" required={true}>
            <Radio defaultChecked>快递到家</Radio>
            <label style={{ color: '#b5b5b5' }}>请为快递配送设置运费模板</label>
          </FormItem>

          <FormItem {...formItemLayout} required={true} label="发货仓">
            <Col span={7}>
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
                    storeFreightFieldsValue({
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

          <FormItem {...formItemLayout} label="地区设置" required={true}>
            {getFieldDecorator('destinationArea', {
              initialValue: destinationArea.toJS(),
              rules: [
                {
                  required: true,
                  message: '请选择地区'
                }
              ]
            })(
              <TreeSelect
                {...tProps}
                filterTreeNode={(input, treeNode) =>
                  treeNode.props.title
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="计费规则" required={true}>
            <RadioGroup
              defaultValue={freightType}
              value={freightType}
              onChange={(e) => this._changeFreightType(e.target.value)}
            >
              <div className="radio-item">
                <Radio value={0}>订单不满</Radio>
                <FormItem>
                  {getFieldDecorator('satisfyPrice', {
                    initialValue: satisfyPrice,
                    rules: this._validMoney(freightType, 0)
                  })(
                    <Input
                      disabled={freightType == 1}
                      onChange={(e) =>
                        storeFreightFieldsValue({
                          field: 'satisfyPrice',
                          value: e.target.value
                        })
                      }
                    />
                  )}
                </FormItem>
                <span
                  style={{
                    paddingLeft: 10,
                    paddingRight: 10
                  }}
                >
                  元，运费
                </span>
                <FormItem>
                  {getFieldDecorator('satisfyFreight', {
                    initialValue: satisfyFreight,
                    rules: this._validMoney(freightType, 0)
                  })(
                    <Input
                      disabled={freightType == 1}
                      onChange={(e) =>
                        storeFreightFieldsValue({
                          field: 'satisfyFreight',
                          value: e.target.value
                        })
                      }
                    />
                  )}
                </FormItem>
                <span style={{ paddingLeft: 10 }}>
                  元，满足条件后包邮，订单按照排除了优惠活动后的金额判断是否满足包邮条件
                </span>
              </div>
              <div className="radio-item">
                <Radio value={1}>固定运费</Radio>
                <FormItem>
                  {getFieldDecorator('fixedFreight', {
                    initialValue: fixedFreight,
                    rules: this._validMoney(freightType, 1)
                  })(
                    <Input
                      disabled={freightType == 0}
                      onChange={(e) => {
                        storeFreightFieldsValue({
                          field: 'fixedFreight',
                          value: e.target.value
                        });
                      }}
                    />
                  )}
                </FormItem>
                <span style={{ paddingLeft: 10 }}>元</span>
              </div>
            </RadioGroup>
          </FormItem>
          <div className="bar-button">
            <Button
              onClick={() => this._save()}
              type="primary"
              style={{ marginRight: 20, marginLeft: 22 }}
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
                  state: { mainTab: '4', tab: 0 }
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
   * 存储区域Id
   */
  _changeArea = (value, label) => {
    this.props.relaxProps.areaIdsSave(value, label);
  };

  /**
   * 保存
   */
  _save = () => {
    const {
      saveStoreFreight,
      freightType,
      defaultFlag
    } = this.props.relaxProps;
    let validStr =
      defaultFlag == 1 ? [] : ['freightTempName', 'destinationArea'];
    validStr = validStr.concat(
      freightType == 0 ? ['satisfyPrice', 'satisfyFreight'] : ['fixedFreight']
    );
    this.props.form.validateFieldsAndScroll(validStr, (errs) => {
      //如果校验通过
      if (!errs) {
        saveStoreFreight();
      }
    });
  };

  /**
   * 修改运费方式重置表单
   */
  _changeFreightType = (value) => {
    const { storeFreightFieldsValue } = this.props.relaxProps;
    const { resetFields, validateFields } = this.props.form;
    storeFreightFieldsValue({
      field: 'freightType',
      value: value
    });
    resetFields();
    if (value == 0) {
      storeFreightFieldsValue({
        field: 'fixedFreight',
        value: ''
      });
      validateFields(['satisfyPrice', 'satisfyFreight']);
    } else {
      storeFreightFieldsValue({
        field: 'satisfyPrice',
        value: ''
      });
      storeFreightFieldsValue({
        field: 'satisfyFreight',
        value: ''
      });
      validateFields(['fixedFreight']);
    }
  };

  /**
   * 规则校验
   */
  _validMoney = (_freightType, _flag) => {
    return [
      { required: true, message: '请输入金额' },
      {
        pattern: ValidConst.zeroPrice,
        message: '请填写两位小数的合法金额'
      },
      {
        type: 'number',
        max: 99999999.99,
        message: '最大值为99999999.99',
        transform: function(value) {
          return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
        }
      }
    ];
  };
}
