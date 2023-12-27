import React from 'react';
import { Form, Input, Tree, Select } from 'antd';
// import { IMap, IList } from 'typings/globalType';
const { TextArea } = Input;
import { noop, ValidConst } from 'qmkit';
// import { Relax } from 'plume2';
import PropTypes from 'prop-types';
import { Store } from 'plume2';

const FormItem = Form.Item;
const Option = Select.Option;
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
// @Relax
export default class EditForm extends React.Component<any, any> {
  _store: Store;
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }
  // props: {
  //   form: any;
  //   relaxProps?: {
  //     formData: IMap;
  //     // editFormData: Function;
  //     onFormBut: Function;
  //     // 键值设置方法
  //     fieldsValue: Function;
  //     // 优惠券分类
  //     couponCates: IList;
  //     // 优惠券分类选中Id
  //     couponCateIds: IList;
  //   };
  // };
  // static relaxProps = {
  //   formData: 'formData',
  //   onFormBut: noop,
  //   fieldsValue: noop,
  //   // editFormData:noop,
  //   couponCates: 'couponCates',
  //   couponCateIds: 'couponCateIds',
  // };

  render() {
    // const { formData, onFormBut, couponCates} = this.props.relaxProps;
    const { onFormBut, _state } = this._store as any;
    const formData = _state.get('formData');
    const couponCates = _state.get('couponCates');
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="厂商名称">
          {getFieldDecorator('companyName', {
            initialValue: formData.get('companyName'),
            onChange: (e) => {
              onFormBut('companyName', e.target.value);
            },
            rules: [
              { required: true, whitespace: true, message: '请输入厂商名称' },
              { min: 2, max: 20, message: '最多20个字符' }
            ]
          })(<Input placeholder="请输入厂商名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系方式">
          {getFieldDecorator('contactPhone', {
            rules: [
              {
                pattern: ValidConst.phone,
                message: '请输入正确的手机号码'
              }
            ],
            initialValue: formData.get('contactPhone'),
            onChange: (e) => {
              onFormBut('contactPhone', e.target.value);
            }
          })(<Input placeholder="请输入联系方式" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="旗下品牌">
          {getFieldDecorator('couponCateIds', {
            initialValue: formData.toJS().couponCateIds,
            onChange: (val, key) => {
              this.chooseCouponCateIds(val, key);
            }
          })(
            <Select
              mode="multiple"
              optionFilterProp="title"
              placeholder="请选择旗下品牌"
            >
              {couponCates.map((cate, i) => {
                return (
                  <Option
                    key={i}
                    value={cate.get('brandId')}
                    title={cate.get('brandName')}
                  >
                    {cate.get('brandName')}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="联系地址">
          {getFieldDecorator('contactAddress', {
            initialValue: formData.get('contactAddress'),
            onChange: (e) => {
              onFormBut('contactAddress', e.target.value);
            }
          })(
            <TextArea
              disabled={false}
              placeholder="最多可输入200字"
              maxLength={200}
              rows={4}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  /**
   * 修改表单字段
   */
  _changeFormData = (key, value) => {
    // const { editFormData } = this.props.relaxProps;
    // editFormData({ key, value });
  };
  /**
   * 优惠券分类选择
   */
  chooseCouponCateIds = (value, key) => {
    const { onFormBut } = this._store as any;
    const couponCateNames = [];
    key.map((item, index) => {
      couponCateNames.push(item.props.children);
    });
    onFormBut('couponCateIds', value);
    onFormBut('couponCateNames', couponCateNames);
  };
}
