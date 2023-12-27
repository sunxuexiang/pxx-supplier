import React from 'react';
import { Form, Input, DatePicker } from 'antd';
import moment from 'moment';
import { Const, Tips } from 'qmkit';
import { IMap } from 'typings/globalType';

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

export default class EditForm extends React.Component<any, any> {
  props: {
    form: any;
    relaxProps?: {
      formData: IMap;
      editFormData: Function;
    };
  };

  render() {
    const { formData } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form errorFeedback">
        <FormItem {...formItemLayout} label="商品名称">
          {getFieldDecorator('goodsName', {
            rules: [{ max: 255, message: '最多255字符' }],
            onChange: (e) => this._changeFormData('goodsName', e.target.value),
            initialValue: formData.get('goodsName')
          })(<Input />)}
          <Tips title="字段提示信息demo" />
        </FormItem>
        <FormItem {...formItemLayout} label="sku id">
          {getFieldDecorator('goodsInfoId', {
            rules: [
              { required: true, whitespace: true, message: '请输入sku id' },
              { max: 32, message: '最多32字符' }
            ],
            onChange: (e) =>
              this._changeFormData('goodsInfoId', e.target.value),
            initialValue: formData.get('goodsInfoId')
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="sku 编码">
          {getFieldDecorator('goodsInfoNo', {
            rules: [
              { required: true, whitespace: true, message: '请输入sku 编码' },
              { max: 32, message: '最多32字符' }
            ],
            onChange: (e) =>
              this._changeFormData('goodsInfoNo', e.target.value),
            initialValue: formData.get('goodsInfoNo')
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="品牌id">
          {getFieldDecorator('brandId', {
            onChange: (e) => this._changeFormData('brandId', e.target.value),
            initialValue:
              formData.get('brandId') || formData.get('brandId') == 0
                ? formData.get('brandId').toString()
                : null
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="品牌名称">
          {getFieldDecorator('brandName', {
            rules: [{ max: 45, message: '最多45字符' }],
            onChange: (e) => this._changeFormData('brandName', e.target.value),
            initialValue: formData.get('brandName')
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="缺货数量">
          {getFieldDecorator('stockoutNum', {
            onChange: (e) =>
              this._changeFormData('stockoutNum', e.target.value),
            initialValue:
              formData.get('stockoutNum') || formData.get('stockoutNum') == 0
                ? formData.get('stockoutNum').toString()
                : null
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="缺货地区">
          {getFieldDecorator('stockoutCity', {
            rules: [{ max: 3000, message: '最多3000字符' }],
            onChange: (e) =>
              this._changeFormData('stockoutCity', e.target.value),
            initialValue: formData.get('stockoutCity')
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="补货标识,0:未补货1:已补货">
          {getFieldDecorator('replenishmentFlag', {
            onChange: (e) =>
              this._changeFormData('replenishmentFlag', e.target.value),
            initialValue:
              formData.get('replenishmentFlag') ||
              formData.get('replenishmentFlag') == 0
                ? formData.get('replenishmentFlag').toString()
                : null
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="店铺id">
          {getFieldDecorator('storeId', {
            rules: [
              { required: true, whitespace: true, message: '请输入店铺id' }
            ],
            onChange: (e) => this._changeFormData('storeId', e.target.value),
            initialValue:
              formData.get('storeId') || formData.get('storeId') == 0
                ? formData.get('storeId').toString()
                : null
          })(<Input />)}
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

  /**
   * 获取初始化的日期时间
   */
  _getInitDate(dateStr, dateFormat) {
    return dateStr ? moment(dateStr, dateFormat) : null;
  }

  /**
   * 日期时间组件公用属性
   */
  _getDateCommProps(dateFormat) {
    return {
      getCalendarContainer: () => document.getElementById('page-content'),
      allowClear: true,
      format: dateFormat
    };
  }

  /**
   * 不可选的日期
   */
  _disabledDate(current) {
    return current && current.valueOf() > Date.now();
  }
}
