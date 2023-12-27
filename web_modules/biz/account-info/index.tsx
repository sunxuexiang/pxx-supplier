import React from 'react';
import { Form, Input } from 'antd';
import { ValidConst, QMMethod } from 'qmkit';

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
 * 添加银行账号
 */
export default class AccountInfo extends React.Component<any, any> {
  _accountInfoForm: any;

  render() {
    const AccountFormComponent = Form.create({})(AccountInfoForm);
    const AccountForm = React.createElement(AccountFormComponent, {
      ref: '_accountInfoForm',
      account: this.props.account
    } as any);

    return AccountForm;
  }

  data = cb => {
    const form = this.refs._accountInfoForm as any;
    form.validateFields(null, (errs, values) => {
      const {
        customerAccountName,
        customerAccountNo,
        customerBankName
      } = values;

      //如果校验通过
      if (!errs) {
        cb({
          customerAccountName,
          customerAccountNo,
          customerBankName
        });
      }
    });
  };
}

/**
 * 新增银行账号form
 */
class AccountInfoForm extends React.Component<any, any> {
  static defaultProps = {
    account: {
      customerAccountName: '',
      customerAccountNo: '',
      customerBankName: ''
    }
  };

  render() {
    let { account } = this.props;
    const { getFieldDecorator } = this.props.form;
    account = account || AccountInfoForm.defaultProps.account;

    return (
      <Form>
        <FormItem {...formItemLayout} label="账户名" hasFeedback>
          {getFieldDecorator('customerAccountName', {
            initialValue: account.customerAccountName,
            rules: [
              { required: true, message: '请填写账户名' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '账户名',
                    1,
                    50
                  );
                }
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="账号" hasFeedback>
          {getFieldDecorator('customerAccountNo', {
            initialValue: account.customerAccountNo,
            rules: [
              { required: true, message: '请填写账号' },
              { max: 30, message: '账号长度必须为1-30个数字之间' },
              { pattern: ValidConst.number, message: '请输入正确的账号' }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="开户行" hasFeedback>
          {getFieldDecorator('customerBankName', {
            initialValue: account.customerBankName,
            rules: [
              { required: true, message: '请填写开户行' },
              {
                validator: (rule, value, callback) => {
                  QMMethod.validatorMinAndMax(
                    rule,
                    value,
                    callback,
                    '开户行',
                    1,
                    50
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
