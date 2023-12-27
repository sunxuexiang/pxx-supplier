import React from 'react';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import { Form, Input } from 'antd';

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
    const { getFieldDecorator } = this.props.form;
    const _state = this._store.state();
    const accountForm = _state.get('accountForm');

    let accountName = {};
    let bankName = {};
    let bankNo = {};

    if (_state.get('edit')) {
      accountName = {
        initialValue: accountForm.get('accountName')
      };

      bankName = {
        initialValue: accountForm.get('bankName')
      };

      bankNo = {
        initialValue: accountForm.get('bankNo')
      };
    }

    return (
      <Form>
        <FormItem {...formItemLayout} label="账户名称">
          {getFieldDecorator('accountName', {
            ...accountName,
            rules: [
              { required: true, message: '请输入账户名称' },
              { validator: this.checkAccountName }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="开户银行">
          {getFieldDecorator('bankName', {
            ...bankName,
            rules: [
              { required: true, message: '请输入开户银行' },
              { validator: this.checkBankName }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="银行账户">
          {getFieldDecorator('bankNo', {
            ...bankNo,
            rules: [
              { required: true, message: '请输入银行账户' },
              { validator: this.checkBankAccount }
            ]
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }

  checkAccountName = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 50) {
      callback(new Error('账户名称不超过50个字符'));
      return;
    }

    callback();
  };

  checkBankName = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 50) {
      callback(new Error('开户银行不超过50个字符'));
      return;
    }

    callback();
  };

  checkBankAccount = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    const bankNoReg = /^\d{1,30}$/;
    if (!bankNoReg.test(value)) {
      callback(new Error('请输入正确的银行账户'));
      return;
    }

    callback();
  };
}
