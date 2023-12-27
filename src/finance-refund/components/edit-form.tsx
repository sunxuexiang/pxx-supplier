import React from 'react';
import { Store } from 'plume2';
import { DatePicker, Form, Input, Select, Icon } from 'antd';
import { ValidConst, QMMethod } from 'qmkit';
import PropTypes from 'prop-types';
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

  state = {
    // 是否新增客户账户
    isAddCustomerAccount: false as boolean
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const _state = this._store.state();

    // 默认退款金额
    let refundAmount = _state.get('returnAmount')
      ? _state.get('returnAmount').toString()
      : '';
    if (refundAmount) {
      refundAmount = parseFloat(refundAmount).toFixed(2);
    }

    let customerAccountId = {};
    let createTime = {};
    let comment = {};
    let accountId = {};

    return (
      <Form>
        <div style={styles.text}>
          <Icon type="info-circle" />
          <h4>请确认您已线下退款</h4>
        </div>
        <FormItem {...formItemLayout} label="选择收款账户">
          {getFieldDecorator('customerAccountId', {
            ...customerAccountId,
            rules: [{ required: true, message: '请选择收款账户' }]
          })(
            <Select onSelect={e => this.onCustomerAccountSelect(e)}>
              {this._renderBank()}
            </Select>
          )}
        </FormItem>
        {this.state.isAddCustomerAccount ? (
          <div>
            <FormItem {...formItemLayout} label="账户名">
              {getFieldDecorator('customerAccountName', {
                rules: [
                  {
                    required: true,
                    message: '请填写账户名'
                  },
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
            <FormItem {...formItemLayout} label="账号">
              {getFieldDecorator('customerAccountNo', {
                rules: [
                  { required: true, message: '请填写账号' },
                  { max: 30, message: '账号长度必须为1-30个数字之间' },
                  { pattern: ValidConst.number, message: '请输入正确的账号' }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="开户行">
              {getFieldDecorator('customerBankName', {
                rules: [
                  {
                    required: true,
                    message: '请填写开户行'
                  },
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
          </div>
        ) : null}

        <FormItem {...formItemLayout} label="退款账户">
          {getFieldDecorator('accountId', {
            ...accountId,
            rules: [{ required: true, message: '请选择退款账户' }]
          })(<Select>{this._renderOfflineBank()}</Select>)}
        </FormItem>

        <FormItem {...formItemLayout} label="退款金额">
          {getFieldDecorator('actualReturnPrice', {
            initialValue: refundAmount,
            rules: [
              { required: true, message: '请填写退款金额' },
              { pattern: ValidConst.zeroPrice, message: '请输入正确的退款金额' }
            ]
          })(<Input />)}
        </FormItem>

        <FormItem {...formItemLayout} label="退款日期">
          {getFieldDecorator('createTime', {
            ...createTime,
            rules: [{ required: true, message: '请选择收款日期' }]
          })(
            <DatePicker
              format={'YYYY-MM-DD'}
              disabledDate={this.disabledDate}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="备注">
          {getFieldDecorator('refundComment', {
            ...comment,
            rules: [{ required: false }, { validator: this.checkComment }]
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    );
  }

  _renderBank() {
    const customerAccounts = this._store.state().get('customerAccounts');

    let accounts = customerAccounts.map(customerAccount => {
      return (
        <Option
          value={customerAccount.get('customerAccountId')}
          key={customerAccount.get('customerAccountId')}
        >
          {this._renderBankName(customerAccount)}
        </Option>
      );
    });

    return accounts.count() >= 5
      ? accounts
      : accounts.concat(
          <Option value={'0'} key="add-customer-account">
            <span style={{ color: 'green' }}>+其他收款账户</span>
          </Option>
        );
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

  /**
   * 是否选择了新增
   * @param e
   */
  onCustomerAccountSelect(e) {
    this.setState({ isAddCustomerAccount: e.valueOf() === '0' });
    (this._store as any).onSelectAccountId(e.valueOf());
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }

  /**
   * 校验备注
   * @param rule
   * @param value
   * @param callback
   */
  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }
    if (value.length > 100) {
      callback(new Error('限制0-100字'));
      return;
    }
    callback();
  };
}

const styles = {
  text: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14
  }
} as any;
