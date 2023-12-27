import * as React from 'react';
import { Relax } from 'plume2';

import { noop, ValidConst } from 'qmkit';
import { Button, Form, Input, InputNumber, message } from 'antd';
import '../index.less';
import { IMap } from 'plume2/es5/typings';

const nonePng = require('../../images/none.png');
const FormItem = Form.Item;

@Relax
export default class Withdrawal extends React.Component<any, any> {
  _form;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(WithdrawalForm);
  }

  props: {
    relaxProps?: {
      accountMoney: string | number;
      withdrawalNum: number;
      editBankInfo: IMap;
      update: Function;
      onEditConfirm: Function;
      loading: boolean;
      onSubmit: Function;
    };
  };

  static relaxProps = {
    accountMoney: 'accountMoney',
    withdrawalNum: 'withdrawalNum',
    editBankInfo: 'editBankInfo',
    loading: 'loading',
    update: noop,
    onEditConfirm: noop,
    onSubmit: noop
  };

  state = {
    editFlag: false
  };

  render() {
    const { editFlag } = this.state;
    const {
      accountMoney,
      withdrawalNum,
      update,
      editBankInfo,
      loading
    } = this.props.relaxProps;
    const WrapperForm = this.WrapperForm;
    return (
      <div className="jw-detail">
        <p>账户鲸币余额</p>
        <p className="jw-detail-money">{accountMoney}</p>
        <p>提现鲸币数量</p>
        <div className="jw-detail-input">
          <InputNumber
            min={0}
            precision={2}
            step={1}
            max={accountMoney ? Number(accountMoney) : null}
            formatter={(value) =>
              value && value !== 0 ? `¥${value}` : '请输入提现金额'
            }
            value={withdrawalNum || null}
            style={{ width: '200px' }}
            onChange={(value) => update({ key: 'withdrawalNum', value })}
          />
          <Button type="primary" onClick={() => this.withdrawalAll()}>
            全部提现
          </Button>
        </div>
        <p style={{ display: 'none' }}>
          银行卡信息
          {!editFlag && (
            <Button type="link" onClick={() => this.editInfo()}>
              编辑
            </Button>
          )}
          {editFlag && (
            <React.Fragment>
              <Button type="link" onClick={() => this.editConfirm()}>
                确认
              </Button>
              <Button
                type="link"
                onClick={() => this.setState({ editFlag: false })}
              >
                取消
              </Button>
            </React.Fragment>
          )}
        </p>
        {editFlag && (
          <WrapperForm
            ref={(form) => (this._form = form)}
            relaxProps={this.props.relaxProps}
          />
        )}
        {false && !editFlag && (
          <React.Fragment>
            <p className="jw-detail-item">
              账户名称：{editBankInfo.get('accountName')}
            </p>
            <p className="jw-detail-item">
              开户行：{editBankInfo.get('bankName')}
            </p>
            <p className="jw-detail-item">
              银行卡号：{editBankInfo.get('bankNo')}
            </p>
          </React.Fragment>
        )}
        <div className="jw-detail-bottom">
          <Button type="primary" loading={loading} onClick={this.submit}>
            确认提现
          </Button>
        </div>
      </div>
    );
  }

  // 全部提现
  withdrawalAll = () => {
    const { accountMoney, update } = this.props.relaxProps;
    update({ key: 'withdrawalNum', value: accountMoney });
  };

  editInfo = () => {
    this.setState({ editFlag: true });
  };

  editConfirm = () => {
    const { onEditConfirm } = this.props.relaxProps;
    this._form.validateFields((errs, values) => {
      if (!errs) {
        onEditConfirm(values);
        this.setState({ editFlag: false });
      }
    });
  };

  //确认提现
  submit = () => {
    const { editFlag } = this.state;
    const { onSubmit } = this.props.relaxProps;
    if (editFlag) {
      message.error('请先确认银行卡信息');
      return;
    }
    onSubmit();
  };
}

class WithdrawalForm extends React.Component<any, any> {
  props: {
    form;
    relaxProps?: {
      accountMoney: string | number;
      withdrawalNum: number;
      editBankInfo: IMap;
      update: Function;
      onEditConfirm: Function;
    };
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { editBankInfo } = this.props.relaxProps;
    return (
      <Form layout="inline">
        <p>
          <FormItem label="账户名称">
            {getFieldDecorator('accountName', {
              initialValue: editBankInfo.get('accountName') || '',
              rules: [
                { required: true, whitespace: true, message: '请输入账户名称' },
                { pattern: ValidConst.noChar, message: '不允许特殊字符' }
              ]
            })(<Input />)}
          </FormItem>
        </p>
        <p>
          <FormItem label="开户行">
            {getFieldDecorator('bankName', {
              initialValue: editBankInfo.get('bankName') || '',
              rules: [
                { required: true, whitespace: true, message: '请输入开户行' },
                { pattern: ValidConst.noChar, message: '不允许特殊字符' }
              ]
            })(<Input />)}
          </FormItem>
        </p>
        <p>
          <FormItem label="银行卡号">
            {getFieldDecorator('bankNo', {
              initialValue: editBankInfo.get('bankNo') || '',
              rules: [
                { required: true, whitespace: true, message: '请输入银行卡号' },
                {
                  pattern: ValidConst.bankNumber,
                  message: '请输入正确的银行卡号'
                }
              ]
            })(<Input />)}
          </FormItem>
        </p>
      </Form>
    );
  }
}
