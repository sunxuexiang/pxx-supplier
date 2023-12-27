import React from 'react';
import { Form, Input } from 'antd';

import { AreaSelect, ValidConst, QMMethod } from 'qmkit';

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

/**
 * 添加收获地址
 */
export default class AddressInfo extends React.Component<any, any> {
  _addressInfoForm: any;

  render() {
    const AddressFormComponent = Form.create({})(AddressInfoForm);
    const AddressForm = React.createElement(AddressFormComponent, {
      ref: '_addressInfoForm',
      addr: this.props.addr
    } as any);

    return AddressForm;
  }

  data = cb => {
    const form = this.refs._addressInfoForm as any;
    form.validateFields(null, (errs, values) => {
      const { area, consigneeName, consigneeNumber, deliveryAddress } = values;

      //如果校验通过
      if (!errs) {
        cb({
          consigneeName: consigneeName.trim(),
          consigneeNumber,
          deliveryAddress: deliveryAddress.trim(),
          provinceId: area[0],
          cityId: area[1],
          areaId: area[2]
        });
      }
    });
  };
}

/**
 * 新增地址form
 */
class AddressInfoForm extends React.Component<any, any> {
  static defaultProps = {
    addr: {
      area: [],
      consigneeName: '',
      consigneeNumber: '',
      deliveryAddress: ''
    }
  };

  render() {
    let { addr } = this.props;
    const { getFieldDecorator } = this.props.form;
    addr = addr || AddressInfoForm.defaultProps.addr;

    const initArea = {};
    if (addr.area && addr.area.length > 0) {
      initArea['initialValue'] = addr.area;
    }

    return (
      <Form>
        <FormItem
          {...formItemLayout}
          label="收货人"
          required={true}
          hasFeedback
        >
          {getFieldDecorator('consigneeName', {
            initialValue: addr.consigneeName,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '收货人',
                    2,
                    15
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="手机" hasFeedback>
          {getFieldDecorator('consigneeNumber', {
            initialValue: addr.consigneeNumber,
            rules: [
              { required: true, message: '请输入手机号' },
              { pattern: ValidConst.phone, message: '请输入正确的手机号码' }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="所在地区" hasFeedback>
          {getFieldDecorator('area', {
            ...initArea,
            rules: [{ required: true, message: '请输入省市区' }]
          })(<AreaSelect />)}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="详细地址"
          required={true}
          hasFeedback
        >
          {getFieldDecorator('deliveryAddress', {
            initialValue: addr.deliveryAddress,
            rules: [
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '详细地址',
                    5,
                    60
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }
}
