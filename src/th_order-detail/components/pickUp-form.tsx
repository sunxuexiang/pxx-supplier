import React from 'react';
import { Form, Select, DatePicker, Input } from 'antd';
import { Store } from 'plume2';
import { QMMethod, ValidConst } from 'qmkit';
import { fromJS } from 'immutable';

import PropTypes from 'prop-types';

const FormItem = Form.Item;
const Option = Select.Option;

export default class PickUpForm extends React.Component<any, any> {
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

    return (
      <div>
        <Form className="login-form">
          <FormItem {...formItemLayout} required={true} label="自提码">
            {getFieldDecorator('pickUpCode', {
              rules: [
                { required: true, message: '请输入自提码' },
                { min: 6, message: '自提码必须为6个字符' },
                { max: 6, message: '自提码必须为6个字符' }
              ]
            })(<Input placeholder="" />)}
          </FormItem>
        </Form>
      </div>
    );
  }
}
