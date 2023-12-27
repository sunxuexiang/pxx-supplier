import React from 'react';
import PropTypes from 'prop-types';
import { Store } from 'plume2';
import { DatePicker, Form, Input, Select } from 'antd';
import { Tips } from 'qmkit';
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
    const offlineAccounts = _state.get('offlineAccounts');

    let accountId = {};
    let createTime = {};
    let comment = {};

    return (
      <Form>
        <div style={{ paddingBottom: 10 }}>
          <Tips title="请确认客户已线下付款" />
        </div>
        <FormItem {...formItemLayout} label="收款账户">
          {getFieldDecorator('accountId', {
            ...accountId,
            rules: [{ required: true, message: '请选择收款账户' }]
          })(
            <Select dropdownStyle={{ zIndex: 1053 }}>
              {this._renderBank(offlineAccounts)}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="收款日期">
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
          {getFieldDecorator('comment', {
            ...comment,
            rules: [{ validator: this.checkComment }]
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    );
  }

  _renderBank(offlineAccounts) {
    return offlineAccounts.map(offlineAccount => {
      return (
        <Option
          value={offlineAccount.get('accountId').toString()}
          key={offlineAccount.get('accountId')}
        >
          {this._renderBankName(offlineAccount)}
        </Option>
      );
    });
  }

  /**
   * 渲染银行名称
   * @param offlineAccount
   * @returns {string}
   * @private
   */
  _renderBankName(offlineAccount) {
    return `${offlineAccount.get('bankName')} ${offlineAccount.get('bankNo')}`;
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('备注请填写小于100字符'));
      return;
    }
    callback();
  };

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
  }
}
