import React from 'react';
import { Form, Select, DatePicker, Input } from 'antd';
import { Store } from 'plume2';
import { QMMethod } from 'qmkit';
import { fromJS } from 'immutable';

import PropTypes from 'prop-types';

const FormItem = Form.Item;
const Option = Select.Option;

export default class DeliveryForm extends React.Component<any, any> {
  props: {
    form: any;
  };

  _store: Store;

  //声明上下文依赖
  static contextTypes = {
    _plume$Store: PropTypes.object
  };

  constructor(props, ctx) {
    super(props);
    this._store = ctx['_plume$Store'];
  }

  render() {
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
    const { getFieldDecorator } = this.props.form;

    const store = this._store as any;

    const logistics = store.state().get('logistics');

    const options =
      fromJS(logistics) &&
      fromJS(logistics)
        .map(v => (
          <Option
            key={v.get('expressCompanyId')}
            value={v.get('expressCompanyId') + ''}
          >
            {v.getIn(['expressCompany', 'expressName'])}
          </Option>
        ))
        .toArray();

    return (
      <div>
        <Form className="login-form">
          <FormItem {...formItemLayout} required={true} label="物流公司">
            {getFieldDecorator('deliverId', {
              rules: [
                {
                  required: true,
                  message: '请输入物流公司'
                }
              ]
            })(
              <Select
                dropdownStyle={{ zIndex: 1053 }}
                notFoundContent="您还未设置常用物流公司"
              >
                {options}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} required={true} label="物流单号">
            {getFieldDecorator('deliverNo', {
              rules: [
                { required: true, message: '请输入物流单号' },
                {
                  validator: (rule, value, callback) => {
                    QMMethod.validatorDeliveryCode(
                      rule,
                      value,
                      callback,
                      '物流单号'
                    );
                  }
                }
              ]
            })(<Input placeholder="" />)}
          </FormItem>
          <FormItem {...formItemLayout} required={true} label="发货日期">
            {getFieldDecorator('deliverTime', {
              rules: [
                {
                  required: true,
                  message: '请输入发货日期'
                }
              ]
            })(<DatePicker disabledDate={this.disabledDate} />)}
          </FormItem>
        </Form>
      </div>
    );
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
}
