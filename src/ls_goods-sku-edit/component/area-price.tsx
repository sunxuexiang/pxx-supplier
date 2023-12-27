import * as React from 'react';
import { Form, Input, Checkbox, Table, Button, message } from 'antd';
import { Relax } from 'plume2';
import { noop, ValidConst, QMFloat } from 'qmkit';
import { IMap } from 'typings/globalType';

const { Column } = Table;
const FormItem = Form.Item;

@Relax
export default class AreaPrice extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      marketPrice: number;
      levelDiscountFlag: boolean;
      editPriceSetting: Function;
      areaPrice: IMap;
      deleteAreaPrice: Function;
      editAreaPriceItem: Function;
      addAreaPrice: Function;
      updateAreaPriceForm: Function;
    };
  };

  static relaxProps = {
    marketPrice: ['goods', 'marketPrice'],
    // 是否叠加客户等级折扣
    levelDiscountFlag: 'levelDiscountFlag',
    // 修改价格设置
    editPriceSetting: noop,
    // 区间价map
    areaPrice: 'areaPrice',
    // 删除区间价
    deleteAreaPrice: noop,
    // 修改区间价单个项
    editAreaPriceItem: noop,
    // 新增区间价
    addAreaPrice: noop,
    updateAreaPriceForm: noop
  };

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(AreaPriceForm);
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const relaxProps = this.props.relaxProps;
    const { updateAreaPriceForm } = relaxProps;
    return (
      <WrapperForm
        ref={(form) => updateAreaPriceForm(form)}
        {...{ relaxProps: relaxProps }}
      />
    );
  }
}

class AreaPriceForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { levelDiscountFlag, areaPrice, marketPrice } = this.props.relaxProps;
    const areaPriceData = areaPrice
      .valueSeq()
      .toList()
      .toJS();
    return (
      <div>
        <Form className="login-form" layout="inline">
          <div
            style={{ marginTop: 6, display: 'inline-block', marginLeft: 10 }}
          >
            <span>
              SKU门店价：
              <strong style={{ color: '#333333' }}>
                {QMFloat.addZero(marketPrice)}
              </strong>
            </span>
            <Checkbox
              onChange={this._editPriceSetting.bind(this, 'levelDiscountFlag')}
              checked={levelDiscountFlag}
              style={{ marginLeft: 15 }}
            >
              叠加客户等级折扣
            </Checkbox>
          </div>
        </Form>

        {/*区间价价table*/}
        <Table
          style={{ paddingTop: '10px' }}
          dataSource={areaPriceData}
          pagination={false}
          rowKey="intervalPriceId"
          footer={() => (
            <Button onClick={this._addAreaPrice}>+ 新增区间</Button>
          )}
        >
          <Column
            title={
              <div>
                <span
                  style={{
                    color: 'red',
                    fontFamily: 'SimSun',
                    marginRight: '4px',
                    fontSize: '12px'
                  }}
                >
                  *
                </span>
                订货区间
              </div>
            }
            key="area"
            width={80}
            render={(rowInfo, _i, index) => {
              return (
                <FormItem>
                  {getFieldDecorator('areacount_' + rowInfo.intervalPriceId, {
                    rules: [
                      {
                        required: true,
                        message: '请填写订货区间'
                      },
                      {
                        validator: (_rule, value, callback) => {
                          if (!value || index == 0) {
                            // 第一行的值固定是1，不校验
                            callback();
                            return;
                          }

                          if (
                            isNaN(value) ||
                            value.toString().indexOf('.') > -1 ||
                            value < 2
                          ) {
                            callback(new Error('请输入大于1的整数'));
                            return;
                          }

                          if (value > 9999999) {
                            callback(new Error('最大值为9999999'));
                            return;
                          }

                          callback();
                        }
                      }
                    ],
                    onChange: this._editPriceItem.bind(
                      this,
                      rowInfo.intervalPriceId,
                      'count'
                    ),
                    initialValue: rowInfo.count
                  })(<Input addonBefore=" ≥ " disabled={index == 0} />)}
                </FormItem>
              );
            }}
          />
          <Column
            title={
              <div>
                <span
                  style={{
                    color: 'red',
                    fontFamily: 'SimSun',
                    marginRight: '4px',
                    fontSize: '12px'
                  }}
                >
                  *
                </span>
                订货价
              </div>
            }
            key="price"
            width={80}
            render={(rowInfo) => {
              return (
                <FormItem>
                  {getFieldDecorator('areaprice_' + rowInfo.intervalPriceId, {
                    rules: [
                      {
                        required: true,
                        message: '请填写价格'
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
                          return isNaN(parseFloat(value))
                            ? 0
                            : parseFloat(value);
                        }
                      }
                    ],
                    onChange: this._editPriceItem.bind(
                      this,
                      rowInfo.intervalPriceId,
                      'price'
                    ),
                    initialValue: rowInfo.price
                  })(<Input />)}
                </FormItem>
              );
            }}
          />
          <Column
            title="操作"
            key="opt"
            width={80}
            render={(rowInfo, _x, index) => {
              return index > 0 ? (
                <Button
                  onClick={this._deleteAreaPrice.bind(
                    this,
                    rowInfo.intervalPriceId
                  )}
                >
                  删除
                </Button>
              ) : null;
            }}
          />
        </Table>
      </div>
    );
  }

  /**
   * 修改价格设置
   */
  _editPriceSetting = (key: string, e) => {
    const { editPriceSetting } = this.props.relaxProps;
    let checked;
    let value = e;
    if (e && e.target) {
      checked = e.target.checked;
      value = e.target.value;
    }

    if (key === 'mtkPrice') {
      if (isNaN(value) || value === undefined || value === '') {
        return;
      }
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
  _editPriceItem = (id: string, key: string, e) => {
    const { editAreaPriceItem } = this.props.relaxProps;
    if (e && e.target) {
      e = e.target.value;
    }
    editAreaPriceItem(id, key, e);

    if (key == 'count') {
      // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
      const fieldsValue = this.props.form.getFieldsValue();
      // 同步值
      let levelPriceFields = {};
      Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
        // 级别价的表单字段以usercount_开头
        if (field === 'areacount_' + id) {
          levelPriceFields[field] = e;
        }
      });
      // update
      this.props.form.setFieldsValue(levelPriceFields);
    } else if (key == 'price') {
      // form表单initialValue方式赋值不成功，这里通过setFieldsValue方法赋值
      const fieldsValue = this.props.form.getFieldsValue();
      // 同步值
      let levelPriceFields = {};
      Object.getOwnPropertyNames(fieldsValue).forEach((field) => {
        // 级别价的表单字段以usermaxcount_开头
        if (field === 'areaprice_' + id) {
          levelPriceFields[field] = e;
        }
      });
      // update
      this.props.form.setFieldsValue(levelPriceFields);
    }
  };

  /**
   * 删除级别价
   */
  _deleteAreaPrice = (id: string) => {
    const { deleteAreaPrice } = this.props.relaxProps;
    deleteAreaPrice(id);
  };

  /**
   * 新增区间价
   */
  _addAreaPrice = () => {
    const { addAreaPrice, areaPrice } = this.props.relaxProps;
    if (areaPrice != null && areaPrice.count() >= 5) {
      message.error('最多添加5个区间价');
      return;
    }
    addAreaPrice();
  };
}
