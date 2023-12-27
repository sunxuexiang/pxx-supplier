import * as React from 'react';
import {
  Form,
  Input,
  Checkbox,
  Table,
  Button,
  Row,
  Col,
  message,
  Switch,
  Popover,
  Icon
} from 'antd';
import { Relax } from 'plume2';
import { noop, ValidConst } from 'qmkit';
import { IMap } from 'typings/globalType';

const { Column } = Table;
const FormItem = Form.Item;
const img02 = require('../image/price-way.png'); // 允许独立设价

@Relax
export default class AreaPrice extends React.Component<any, any> {
  WrapperForm: any;

  props: {
    relaxProps?: {
      mtkPrice: number;
      costPrice: number;
      levelDiscountFlag: boolean;
      editPriceSetting: Function;
      areaPrice: IMap;
      deleteAreaPrice: Function;
      editAreaPriceItem: Function;
      addAreaPrice: Function;
      updateAreaPriceForm: Function;
      toggleSetAlonePrice: Function;
      goods: IMap;
    };
  };

  static relaxProps = {
    mtkPrice: 'mtkPrice',
    costPrice: 'costPrice',
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
    updateAreaPriceForm: noop,
    toggleSetAlonePrice: noop,
    goods: 'goods'
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
    const { levelDiscountFlag, areaPrice, goods } = this.props.relaxProps;
    const areaPriceData = areaPrice
      .valueSeq()
      .toList()
      .toJS();

    // 允许独立设价
    const content1 = (
      <div style={{ width: 625, height: 323 }}>
        <img src={img02} alt="" />
      </div>
    );
    return (
      <div>
        <div style={styles.bar}>
          <Form className="login-form" layout="inline">
            <div
              style={{
                marginTop: 6,
                marginLeft: 10,
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              <Checkbox
                onChange={this._editPriceSetting.bind(
                  this,
                  'levelDiscountFlag'
                )}
                checked={levelDiscountFlag}
              >
                叠加客户等级折扣
              </Checkbox>
              <Switch
                checked={goods.get('allowPriceSet')}
                onChange={(e) => this._toggleSetAlonePrice(e ? 1 : 0)}
              />
              <span>&nbsp;&nbsp;允许独立设价&nbsp;&nbsp;</span>
              <Popover
                getPopupContainer={() =>
                  document.getElementById('page-content')
                }
                content={content1}
                placement="top"
              >
                <Icon type="question-circle-o" style={{ color: '#1890ff' }} />
              </Popover>
            </div>

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
                    </span>订货区间
                  </div>
                }
                key="area"
                width={80}
                render={(rowInfo, _i, index) => {
                  return (
                    <Row>
                      <Col span={10}>
                        <FormItem>
                          {getFieldDecorator(
                            'areacount_' + rowInfo.intervalPriceId,
                            {
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
                            }
                          )(<Input addonBefore=" ≥ " disabled={index == 0} />)}
                        </FormItem>
                      </Col>
                    </Row>
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
                    </span>订货价
                  </div>
                }
                key="price"
                width={80}
                render={(rowInfo) => {
                  return (
                    <Row>
                      <Col span={10}>
                        <FormItem>
                          {getFieldDecorator(
                            'areaprice_' + rowInfo.intervalPriceId,
                            {
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
                            }
                          )(<Input />)}
                        </FormItem>
                      </Col>
                    </Row>
                  );
                }}
              />
              <Column
                title="操作"
                key="opt"
                width={80}
                render={(rowInfo, _x, i) => {
                  return i > 0 ? (
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
          </Form>
        </div>
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

  /**
   * 独立设价的切换
   */
  _toggleSetAlonePrice = (e) => {
    const { toggleSetAlonePrice } = this.props.relaxProps;
    toggleSetAlonePrice(e);
  };
}

const styles = {
  bar: {
    padding: 10
  }
};
