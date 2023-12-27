import * as React from 'react';
import { Form, Input, Checkbox, Table, InputNumber, Tooltip, Icon } from 'antd';
import { Relax } from 'plume2';
import { fromJS } from 'immutable';
import { noop, ValidConst, QMFloat } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

import UserPrice from './user-price';
const accMul = QMFloat.accMul;

const { Column } = Table;
const FormItem = Form.Item;

@Relax
export default class LevelPrice extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      marketPrice: number;
      costPrice: number;
      openUserPrice: boolean;
      editPriceSetting: Function;
      userLevelList: IList;
      editUserLevelPriceItem: Function;
      updateLevelPriceForm: Function;
      userLevelPrice: IMap;
      editGoods: Function;
      //起订量同步
      levelCountChecked: boolean;
      levelCountDisable: boolean;
      updateLevelCountChecked: Function;
      synchLevelCount: Function;
      //限订量同步
      levelMaxCountChecked: boolean;
      levelMaxCountDisable: boolean;
      updateLevelMaxCountChecked: Function;
      synchLevelMaxCount: Function;
    };
  };

  static relaxProps = {
    marketPrice: ['goods', 'marketPrice'],
    costPrice: ['goods', 'costPrice'],
    // 是否开启按客户单独定价
    openUserPrice: 'openUserPrice',
    // 修改价格设置
    editPriceSetting: noop,
    // 级别列表
    userLevelList: 'userLevelList',
    // 修改价格表属性
    editUserLevelPriceItem: noop,
    updateLevelPriceForm: noop,
    // 级别价格数据
    userLevelPrice: 'userLevelPrice',
    // 编辑单品字段(这边主要用于编辑sku门店价)
    editGoods: noop,
    //起订量同步
    levelCountChecked: 'levelCountChecked',
    levelCountDisable: 'levelCountDisable',
    updateLevelCountChecked: noop,
    synchLevelCount: noop,
    //限订量同步
    levelMaxCountChecked: 'levelMaxCountChecked',
    levelMaxCountDisable: 'levelMaxCountDisable',
    updateLevelMaxCountChecked: noop,
    synchLevelMaxCount: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(LevelPriceForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    const { updateLevelPriceForm } = relaxProps;
    return (
      <WrapperForm
        ref={(form) => form && updateLevelPriceForm(form)}
        {...{ relaxProps: relaxProps }}
      />
    );
  }
}

class LevelPriceForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      marketPrice,
      openUserPrice,
      userLevelList,
      userLevelPrice,
      levelCountChecked,
      levelCountDisable,
      levelMaxCountChecked,
      levelMaxCountDisable
    } = this.props.relaxProps;
    return (
      <div>
        <div style={{ paddingBottom: 10 }}>
          <Form className="login-form" layout="inline">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FormItem label="SKU门店价">
                {getFieldDecorator('marketPrice', {
                  rules: [
                    {
                      required: true,
                      message: '请填写门店价'
                    },
                    {
                      pattern: ValidConst.zeroPrice,
                      message: '请填写两位小数的合法金额'
                    },
                    {
                      type: 'number',
                      max: 9999999.99,
                      message: '最大值为9999999.99',
                      transform: function(value) {
                        return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
                      }
                    }
                  ],
                  onChange: (e) =>
                    this.props.relaxProps.editGoods(
                      fromJS({ ['marketPrice']: e.target.value })
                    ),
                  initialValue: marketPrice
                })(<Input style={{ maxWidth: 120, marginRight: 5 }} />)}
                <Tooltip
                  placement="top"
                  title={
                    '按照客户设价时需要填门店价，保存后，原有的SKU门店价将会被覆盖'
                  }
                >
                  <a style={{ fontSize: 14 }}>
                    <Icon type="question-circle-o" />
                  </a>
                </Tooltip>
              </FormItem>
              <Checkbox
                onChange={this._editPriceSetting.bind(this, 'openUserPrice')}
                checked={openUserPrice}
              >
                按客户单独定价
              </Checkbox>
            </div>
          </Form>
        </div>
        {/*级别价table*/}
        <Table
          dataSource={userLevelList.toJS()}
          pagination={false}
          rowKey="customerLevelId"
          scroll={{ y: 300 }}
        >
          <Column
            width="15%"
            title="级别"
            key="customerLevelName"
            dataIndex="customerLevelName"
          />
          <Column
            width="10%"
            key="customerLevelDiscount"
            title={
              <div>
                默认折扣价&nbsp;
                <Tooltip
                  placement="top"
                  title={
                    '如不填写自定义订货价，该级别售价默认使用折扣价，折扣价=门店价×等级折扣率'
                  }
                >
                  <a style={{ fontSize: 14 }}>
                    <Icon type="question-circle-o" />
                  </a>
                </Tooltip>
              </div>
            }
            render={(rowInfo) => (
              <div>
                <div>
                  ¥{(marketPrice * rowInfo.customerLevelDiscount).toFixed(2)}
                </div>
                <div>
                  {(rowInfo.customerLevelDiscount * 100).toFixed(0) + '%'}
                </div>
              </div>
            )}
          />
          <Column
            title={
              <div>
                自定义订货价&nbsp;
                <Tooltip
                  placement="top"
                  title={'填写后该级别销售价不会跟随门店价以及等级折扣率变化'}
                >
                  <a style={{ fontSize: 14 }}>
                    <Icon type="question-circle-o" />
                  </a>
                </Tooltip>
              </div>
            }
            key="price"
            width="25%"
            render={(rowInfo) => {
              const levelId = rowInfo.customerLevelId + '';
              return (
                <FormItem>
                  {getFieldDecorator('levelprice_' + levelId, {
                    rules: [
                      {
                        pattern: ValidConst.zeroPrice,
                        message: '请填写两位小数的合法金额'
                      },
                      {
                        type: 'number',
                        max: 9999999.99,
                        message: '最大值为9999999.99',
                        transform: function(value) {
                          return isNaN(parseFloat(value))
                            ? 0
                            : parseFloat(value);
                        }
                      }
                    ],
                    onChange: this._editPriceItem.bind(this, levelId, 'price'),
                    initialValue:
                      userLevelPrice.get(levelId) &&
                      userLevelPrice.get(levelId).get('price')
                  })(<Input />)}
                </FormItem>
              );
            }}
          />
          <Column
            title={
              <div>
                起订量
                <br />{' '}
                <Checkbox
                  checked={levelCountChecked}
                  onChange={this._synchLevelCount}
                >
                  全部相同
                </Checkbox>
              </div>
            }
            key="count"
            width="25%"
            render={(rowInfo, _l, index) => {
              const levelId = rowInfo.customerLevelId + '';
              return (
                <FormItem>
                  {getFieldDecorator('levelcount_' + levelId, {
                    rules: [
                      {
                        pattern: ValidConst.number,
                        message: '0或正整数'
                      },
                      {
                        level: levelId,
                        validator: (rule, value, callback) => {
                          let count = userLevelPrice.get(rule.level)
                            ? userLevelPrice.get(rule.level).get('maxCount')
                            : '';

                          // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
                          const fieldsValue = this.props.form.getFieldsValue();
                          // 同步值
                          let levelPriceFields = {};
                          Object.getOwnPropertyNames(fieldsValue).forEach(
                            (field) => {
                              // 级别价的表单字段以levelcount_开头
                              if (field === 'levelmaxcount_' + rule.level) {
                                levelPriceFields[field] = count;
                              }
                            }
                          );
                          // update
                          this.props.form.setFieldsValue(levelPriceFields);

                          if (
                            count != null &&
                            count != '' &&
                            value != '' &&
                            value != null &&
                            value > count
                          ) {
                            callback('不可大于限订量');
                            return;
                          }
                          callback();
                        }
                      }
                    ],
                    onChange: this._editPriceItem.bind(this, levelId, 'count'),
                    initialValue: userLevelPrice.get(levelId)
                      ? userLevelPrice.get(levelId).get('count')
                      : ''
                  })(<InputNumber disabled={index > 0 && levelCountDisable} />)}
                </FormItem>
              );
            }}
          />
          <Column
            title={
              <div>
                限订量
                <br />{' '}
                <Checkbox
                  checked={levelMaxCountChecked}
                  onChange={this._synchLevelMaxCount}
                >
                  全部相同
                </Checkbox>
              </div>
            }
            key="maxCount"
            width="25%"
            render={(rowInfo, _l, index) => {
              const levelId = rowInfo.customerLevelId + '';
              return (
                <FormItem>
                  {getFieldDecorator('levelmaxcount_' + levelId, {
                    rules: [
                      {
                        pattern: ValidConst.number,
                        message: '正整数'
                      },
                      {
                        level: levelId,
                        validator: (rule, value, callback) => {
                          let count = userLevelPrice.get(rule.level)
                            ? userLevelPrice.get(rule.level).get('count')
                            : '';

                          // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
                          const fieldsValue = this.props.form.getFieldsValue();
                          // 同步值
                          let levelPriceFields = {};
                          Object.getOwnPropertyNames(fieldsValue).forEach(
                            (field) => {
                              // 级别价的表单字段以levelcount_开头
                              if (field === 'levelcount_' + rule.level) {
                                levelPriceFields[field] = count;
                              }
                            }
                          );
                          // update
                          this.props.form.setFieldsValue(levelPriceFields);

                          if (
                            count != null &&
                            count != '' &&
                            value != '' &&
                            value != null &&
                            value < count
                          ) {
                            callback('不可小于起订量');
                            return;
                          }
                          callback();
                        }
                      }
                    ],
                    onChange: this._editPriceItem.bind(
                      this,
                      levelId,
                      'maxCount'
                    ),
                    initialValue: userLevelPrice.get(levelId)
                      ? userLevelPrice.get(levelId).get('maxCount')
                      : ''
                  })(
                    <InputNumber
                      min={1}
                      disabled={index > 0 && levelMaxCountDisable}
                    />
                  )}
                </FormItem>
              );
            }}
          />
        </Table>

        {openUserPrice ? <UserPrice /> : null}
      </div>
    );
  }

  /**
   * 修改价格设置
   */
  _editPriceSetting = (key: string, e) => {
    const { editPriceSetting, userLevelList } = this.props.relaxProps;
    let checked;
    let value = e;
    if (e && e.target) {
      checked = e.target.checked;
      value = e.target.value;
    }

    if (key === 'marketPrice') {
      if (isNaN(value) || value === undefined || value === '') {
        return;
      }

      value = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
      value = value.toFixed(2);

      // 点击保存，表单校验不通过后，getFieldDecorator的initialValue赋值不起作用，目测是antd的bug
      // 这里使用getFieldsValue和setFieldsValue进行赋值
      const fieldsValue = this.props.form.getFieldsValue();
      // 更新级别价的值
      let levelPriceFields = {};
      Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
        // 级别价的表单字段以levelprice_开头
        if (field.indexOf('levelprice_') === 0) {
          // 级别价等于新输入的门店价乘以级别折扣
          const found = userLevelList.find(
            (level) => level.get('customerLevelId') == field.split('_')[1]
          );
          const levelDiscount = found.get('customerLevelDiscount');
          levelPriceFields[field] = accMul(levelDiscount, value).toFixed(2);
        }
      });
      // update
      this.props.form.setFieldsValue(levelPriceFields);
    }

    if (value) {
      editPriceSetting(key, value);
    } else {
      editPriceSetting(key, checked);
    }
  };

  /**
   * 修改价格表属性
   */
  _editPriceItem = (userLevelId: string, key: string, e) => {
    const {
      editUserLevelPriceItem,
      synchLevelCount,
      levelCountChecked,
      synchLevelMaxCount,
      levelMaxCountChecked
    } = this.props.relaxProps;
    let v = e;
    if (e && e.target) {
      v = e.target.value;
    }
    editUserLevelPriceItem(userLevelId, key, v);

    if (key == 'count') {
      // 修改store中的库存值
      synchLevelCount();

      // 是否同步值
      if (levelCountChecked) {
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步值
        let levelPriceFields = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          // 级别价的表单字段以levelcount_开头
          if (field.indexOf('levelcount_') === 0) {
            levelPriceFields[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(levelPriceFields);
      }
    } else if (key == 'maxCount') {
      // 修改store中的库存值
      synchLevelMaxCount();

      // 是否同步值
      if (levelMaxCountChecked) {
        // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
        const fieldsValue = this.props.form.getFieldsValue();
        // 同步值
        let levelPriceFields = {};
        Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
          // 级别价的表单字段以levelmaxcount_开头
          if (field.indexOf('levelmaxcount_') === 0) {
            levelPriceFields[field] = e;
          }
        });
        // update
        this.props.form.setFieldsValue(levelPriceFields);
      }
    }
  };

  /**
   * 同步起订量库存
   */
  _synchLevelCount = (e) => {
    const { updateLevelCountChecked, synchLevelCount } = this.props.relaxProps;
    updateLevelCountChecked(e.target.checked);
    synchLevelCount();
  };

  /**
   * 同步起订量库存
   */
  _synchLevelMaxCount = (e) => {
    const {
      updateLevelMaxCountChecked,
      synchLevelMaxCount
    } = this.props.relaxProps;
    updateLevelMaxCountChecked(e.target.checked);
    synchLevelMaxCount();
  };
}
