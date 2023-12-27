import React from 'react';
import { Form, Input, Radio, Select } from 'antd';
import { ValidConst } from 'qmkit';
import { IList, IMap } from 'typings/globalType';

const defaultImg = require('../img/none.png');
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
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

export default class EditForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      visible: boolean;
      formData: IMap;
      editFormData: Function;
      cateList: IList;
    };
  };

  render() {
    const { formData, cateList } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;
    const maxStock = formData.get('maxStock');
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="商品图片">
          {formData.get('goodsInfo').get('goodsInfoImg') ? (
            <img
              src={formData.get('goodsInfo').get('goodsInfoImg')}
              style={styles.imgItem}
            />
          ) : formData.get('goods').get('goodsImg') ? (
            <img
              src={formData.get('goods').get('goodsImg')}
              style={styles.imgItem}
            />
          ) : (
            <img src={defaultImg} style={styles.imgItem} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="商品名称">
          {formData.get('goods').get('goodsName')}
        </FormItem>
        <FormItem {...formItemLayout} label="规格">
          {formData.get('specText')}
        </FormItem>
        <FormItem {...formItemLayout} label="商家名称">
          {formData.get('goodsInfo').get('storeName')}
        </FormItem>
        <FormItem {...formItemLayout} label="门店价格">
          {'￥' +
            (formData.get('goodsInfo').get('marketPrice') == null
              ? 0
              : formData.get('goodsInfo').get('marketPrice'))}
        </FormItem>
        <FormItem {...formItemLayout} label="现有库存">
          {formData.get('goodsInfo').get('stock')}
        </FormItem>
        <FormItem {...formItemLayout} label="抢购价格">
          {getFieldDecorator('price', {
            rules: [
              {
                required: true,
                message: '请填写抢购价格'
              },
              {
                pattern: ValidConst.price,
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
            initialValue:
              formData.get('price') || formData.get('price') == 0
                ? formData.get('price').toString()
                : null
          })(
            <Input
              onChange={(e) => this._changeFormData('price', e.target.value)}
              style={{ width: '70px' }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="分类">
          {getFieldDecorator('cateId', {
            rules: [
              {
                required: true,
                message: '请选择分类'
              }
            ],
            initialValue: formData.get('flashSaleCateVO').get('cateName')
          })(
            <Select
              getPopupContainer={() => document.getElementById('page-content')}
              showSearch
              optionFilterProp="children"
              onChange={(e) => {
                this._changeFormData('cateId', e);
              }}
              style={{ width: '120px' }}
            >
              {cateList.map((v) => {
                return (
                  <Option value={v.get('cateId')} key={v.get('cateName')}>
                    {v.get('cateName')}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="抢购库存">
          {getFieldDecorator('stock', {
            initialValue:
              formData.get('stock') || formData.get('stock') == 0
                ? formData.get('stock').toString()
                : null,
            rules: [
              { required: true, message: '必须输入抢购库存' },
              {
                pattern: ValidConst.noZeroNineNumber,
                message: '请输入1-999999999的整数'
              },
              {
                validator: (_rule, value, callback) => {
                  if (maxStock < value) {
                    callback('抢购库存不可大于剩余库存');
                    return;
                  }
                  if (
                    formData.get('maxNum') &&
                    Number(formData.get('maxNum')) > Number(value)
                  ) {
                    callback('抢购库存不可小于限购数量');
                    return;
                  }
                  callback();
                }
              }
            ]
          })(
            <Input
              onChange={(e) => this._changeFormData('stock', e.target.value)}
              style={{ width: '70px' }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="限购数量">
          {getFieldDecorator('maxNum', {
            initialValue: formData.get('maxNum'),
            rules: [
              {
                required: true,
                message: '请填写限购数量'
              },
              {
                pattern: ValidConst.noZeroNineNumber,
                message: '请输入1-100的整数'
              },
              {
                validator: (_rule, value, callback) => {
                  if (100 < value) {
                    callback('限购数量不可大于100');
                    return;
                  }
                  if (value && Number(formData.get('minNum')) > Number(value)) {
                    callback('限购数量不可小于起售数量');
                    return;
                  }
                  if (value && Number(formData.get('stock')) < Number(value)) {
                    callback('限购数量不可大于抢购库存');
                    return;
                  }
                  callback();
                }
              }
            ]
          })(
            <Input
              onChange={(e) => this._changeFormData('maxNum', e.target.value)}
              style={{ width: '70px' }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="起售数量">
          {getFieldDecorator('minNum', {
            initialValue:
              formData.get('minNum') || formData.get('minNum') == 0
                ? formData.get('minNum').toString()
                : null,
            rules: [
              { required: true, message: '必须输入起售数量' },
              {
                pattern: ValidConst.noZeroNineNumber,
                message: '请输入1-100的整数'
              },
              {
                validator: (_rule, value, callback) => {
                  if (100 < value) {
                    callback('起售数量不可大于100');
                    return;
                  }
                  if (
                    formData.get('maxNum') &&
                    Number(formData.get('maxNum')) < Number(value)
                  ) {
                    callback('起售数量不可大于限购数量');
                    return;
                  }
                  callback();
                }
              }
            ]
          })(
            <Input
              onChange={(e) => this._changeFormData('minNum', e.target.value)}
              style={{ width: '70px' }}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="是否包邮">
          {getFieldDecorator('postage', {
            rules: [{ required: true, message: '请选择是否包邮' }],
            onChange: (e) => this._changeFormData('postage', e.target.value),
            initialValue: formData.get('postage')
          })(
            <RadioGroup>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    const { editFormData } = this.props.relaxProps;
    editFormData({ key, value });
  };
}

const styles = {
  item: {
    float: 'left',
    width: '50%',
    display: 'flex',
    flexDirection: 'row',
    margin: '10px 0',
    height: 124
  },
  cell: {
    color: '#999',
    width: 200,
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  } as any,
  label: {
    color: '#999',
    width: 80,
    textAlign: 'right',
    display: 'inline-block'
  } as any,
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    background: '#fff'
  },
  textCon: {
    width: 120,
    maxHeight: 62,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    webkitBoxOrient: 'vertical'
  } as any
} as any;
