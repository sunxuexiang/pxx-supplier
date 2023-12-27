import React from 'react';
import { Form, Input } from 'antd';
import moment from 'moment';
import { IMap } from 'typings/globalType';
import { ValidConst } from 'qmkit';

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
      urlType: number;
    };
  };

  render() {
    const { formData, urlType } = this.props.relaxProps;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form className="login-form errorFeedback">
        {/* <FormItem {...formItemLayout} label="物流公司编号">
          {getFieldDecorator('companyNumber', {
            rules: [
              { required: true, whitespace: true, message: '请输入公司编号' },
              { max: 20, min: 5, message: '5-20个字符' }
            ],
            onChange: (e) =>
              this._changeFormData('companyNumber', e.target.value),
            initialValue: formData.get('companyNumber')
          })(
            <Input placeholder="请输入物流公司编号，5-20位数字、字母或组合" />
          )}
        </FormItem> */}
        <FormItem
          {...formItemLayout}
          label={`${urlType === 1 ? '指定专线' : '物流公司'}名称`}
        >
          {getFieldDecorator('logisticsName', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: '请输入物流公司名称'
              },
              { max: 100, message: '1-100字符' }
            ],
            onChange: (e) =>
              this._changeFormData('logisticsName', e.target.value),
            initialValue: formData.get('logisticsName')
          })(
            <Input
              placeholder={`请输入${
                urlType === 1 ? '指定专线' : '物流公司'
              }名称，不超过100字符`}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={`${urlType === 1 ? '指定专线' : '物流公司'}电话`}
        >
          {getFieldDecorator('logisticsPhone', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: `请输入${urlType === 1 ? '指定专线' : '物流公司'}电话`
              },
              {
                pattern: ValidConst.phoneortele,
                message: '请输入正确的手机格式,1-15位字符'
              }
            ],
            onChange: (e) =>
              this._changeFormData('logisticsPhone', e.target.value),
            initialValue: formData.get('logisticsPhone')
          })(
            <Input
              placeholder={`请输入${
                urlType === 1 ? '指定专线' : '物流公司'
              }电话，不超过15位字符`}
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={`${urlType === 1 ? '指定专线' : '物流公司'}地址`}
        >
          {getFieldDecorator('logisticsAddress', {
            rules: [
              {
                required: true,
                whitespace: true,
                message: `请输入${urlType === 1 ? '指定专线' : '物流公司'}地址`
              },
              { max: 200, message: '1-200字符' }
            ],
            onChange: (e) =>
              this._changeFormData('logisticsAddress', e.target.value),
            initialValue: formData.get('logisticsAddress')
          })(
            <Input
              placeholder={`请输入${
                urlType === 1 ? '指定专线' : '物流公司'
              }地址，不超过200字符`}
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
