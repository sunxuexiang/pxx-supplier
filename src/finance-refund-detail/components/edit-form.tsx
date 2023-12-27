import React from 'react';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import { DatePicker, Form, Input, Select } from 'antd';
import InputNumber from 'antd/lib/input-number';
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
    //客户收款账户
    const customerAccounts = _state.get('customerAccounts');
    const selectedAccountId = _state.get('selectedAccountId');

    const selectedAccount = customerAccounts.find(
      account => account.get('customerAccountId') == selectedAccountId
    );

    let customerAccountId = {};
    let createTime = {};
    let comment = {};
    let accountId = {};

    return (
      <Form>
        <FormItem {...formItemLayout} label="选择收款账户">
          {getFieldDecorator('customerAccountId', {
            ...customerAccountId,
            rules: [{ required: true, message: '请选择收款账户' }]
          })(
            <Select
              onSelect={e =>
                (this._store as any).onSelectAccountId(e.valueOf())
              }
            >
              {this._renderBank()}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="账户名">
          <label>
            {selectedAccount
              ? selectedAccount.get('customerAccountName')
              : null}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="账号">
          <label>
            {selectedAccount ? selectedAccount.get('customerAccountNo') : null}
          </label>
        </FormItem>
        <FormItem {...formItemLayout} label="开户行">
          <label>
            {selectedAccount ? selectedAccount.get('customerBankName') : null}
          </label>
        </FormItem>

        <FormItem {...formItemLayout} label="退款账户">
          {getFieldDecorator('accountId', {
            ...accountId,
            rules: [{ required: true, message: '请选择退款账户' }]
          })(<Select>{this._renderOfflineBank()}</Select>)}
        </FormItem>

        <FormItem {...formItemLayout} label="退款金额">
          {getFieldDecorator('actualReturnPrice', {
            ...createTime,
            rules: [{ required: true, message: '请填写退款金额' }]
          })(<InputNumber step={0.01} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="退款日期">
          {getFieldDecorator('createTime', {
            ...createTime,
            rules: [{ required: true, message: '请选择收款日期' }]
          })(<DatePicker format={'YYYY-MM-DD'} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('refundComment', {
            ...comment,
            rules: [{ required: false }]
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    );
  }

  _renderBank() {
    const customerAccounts = this._store.state().get('customerAccounts');

    return customerAccounts.map(customerAccount => {
      return (
        <Option
          value={customerAccount.get('customerAccountId')}
          key={customerAccount.get('customerAccountId')}
        >
          {this._renderBankName(customerAccount)}
        </Option>
      );
    });
  }

  /**
   * 渲染银行名称
   * @param customerAccount customerAccount
   * @returns {string}
   * @private
   */
  _renderBankName(customerAccount) {
    return `${customerAccount.get('customerBankName')} ${customerAccount.get(
      'customerAccountNo'
    )}`;
  }

  /**
   *
   * @param offlineAccounts
   * @private
   */
  _renderOfflineBank() {
    const offlineAccounts = this._store.state().get('offlineAccounts');
    return offlineAccounts.map(offlineAccount => {
      return (
        <Option
          value={offlineAccount.get('accountId').toString()}
          key={offlineAccount.get('accountId')}
        >
          {this._renderOfflineBankName(offlineAccount)}
        </Option>
      );
    });
  }

  _renderOfflineBankName(offlineAccount) {
    return `${offlineAccount.get('bankName')} ${offlineAccount.get('bankNo')}`;
  }
}
