import React from 'react';
import { StoreProvider } from 'plume2';
import { Button, Form, Input, Modal, Select, Alert } from 'antd';
import { IList } from 'typings/globalType';
import { fromJS } from 'immutable';
import { ValidConst, QMMethod } from 'qmkit';
import AppStore from './store';

const FormItem = Form.Item;
const Option = Select.Option;
@StoreProvider(AppStore, { debug: __DEV__ })
export default class RefundModal extends React.Component<any, any> {
  store: AppStore;
  _form: any;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(RefundForm);
  }

  state = {
    posting: false,
    visible: false
  };

  componentWillReceiveProps(nextProps) {
    const visible = nextProps.data.get('visible');
    if (visible != this.state.visible) {
      if (visible) {
        this.store.init(nextProps.data.get('customerId'));
      }
      this.setState({ visible: visible });
    }
  }

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide, handleOk } = this.props;
    if (!data.get('visible')) {
      return null;
    }

    const formInitialData = {
      customerId: data.get('customerId'),
      accounts: this.store.state().get('accounts'),
      customerAccounts: this.store.state().get('customerAccounts'),
      refundAmount: data.get('refundAmount') || 0,
      applyPoints: data.get('applyPoints') || 0,
      mergFlag: data.get('mergFlag'),
      modifyPrice: data.get('modifyPrice'),
      modifyComment: data.get('modifyComment'),
    };

    return (
      <Modal maskClosable={false}
        title="添加退款记录"
        visible={data.get('visible')}
        onCancel={() => onHide()}
        footer={[
          <Button key="back" size="large" onClick={() => onHide()}>
            取消{data.get('mergFlag')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            size="large"
            loading={this.state.posting}
            onClick={() => this._handleOk(handleOk)}
          >
            确定
          </Button>
        ]}
      >
        <WrapperForm
          ref={(form) => (this['_form'] = form)}
          {...formInitialData}
        />
      </Modal>
    );
  }

  _handleOk(handleOk: Function) {
    const { data, onHide } = this.props;
    this._form.validateFields(null, (errs, values) => {
      //todo
      if (!errs) {
        values.customerId = this.props.data.get('customerId');
        this.setState({ posting: true });
        handleOk(data.get('rid'), values)
          .then(() => {
            this.setState({ posting: false });
            onHide();
          })
          .catch(() => {
            this.setState({ posting: false });
          });
      }
    });
  }
}

class RefundForm extends React.Component<any, any> {
  props: {
    form: any;
    customerId: string;
    accounts: IList;
    customerAccounts: IList;
    refundAmount: number;
    applyPoints: number;
    mergFlag: boolean;
    modifyPrice: number | null;
    modifyComment: string | null;
  };



  constructor(props) {
    super(props);

    this.state = {
      // 是否新增客户账户
      isAddCustomerAccount: false as boolean,
      editRefund: false,
      refund: (props.modifyPrice || props.refundAmount).toFixed(2)
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    let customerAccountId = {};
    let comment = { initialValue: '' };

    return (
      <div style={styles.container}>
        <Alert
          style={{ marginBottom: 10 }}
          message={
            <div>
              <p>请确认退款金额以及客户收款的账户。</p>
              <p>点击保存后，平台将按照确认的金额将款项返还给客户，对应积分同时进行返还。</p>
              <p>修改退款金额请将修改原因填写至退款备注。</p>
              <p style={{ color: 'red' }}>实际退款数量请查看退款详情中的“实际退货数量”</p>
              {this.props.mergFlag ? <div style={{ color: 'red' }}> 该订单为合并支付订单，合并支付的所有订单都添加退款记录后才能一起退款成功</div> : null}
            </div>
          }
          type="info"
        />
        <Form>

          <FormItem>
            <Input type="hidden" value={this.props.customerId} />
          </FormItem>
          <FormItem {...formItemLayout} label="收款账户">
            {getFieldDecorator('customerAccountId', {
              ...customerAccountId,
              rules: [{ required: true, message: '请选择收款账户' }]
            })(
              <Select
                onSelect={(customerAccountId) =>
                  this.onCustomerAccountSelect(customerAccountId)
                }
              >
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
                      whitespace: true,
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
                      whitespace: true,
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
          <FormItem {...formItemLayout} label="退款金额">
            {getFieldDecorator('actualReturnPrice', {
              initialValue: this.props.modifyPrice ? this.props.modifyPrice.toFixed(2)
                : this.props.refundAmount.toFixed(2),
              rules: [
                {
                  required: true,
                  message: '请填写退款金额'
                },
                {
                  pattern: ValidConst.zeroPrice,
                  message: '请填写两位小数的合法金额'
                }
              ]
            })(<Input type="hidden" />)}
            {this.state.editRefund ? (
              <Input
                style={{ width: 150, marginRight: 10 }}
                onChange={(e) => {
                  this.setState({ refund: (e.target as any).value });
                  this.props.form.setFieldsValue({
                    actualReturnPrice: (e.target as any).value
                  });
                }}
                value={this.state.refund}
              />
            ) : (
              <label style={{ marginRight: 10 }}>
                {this.props.modifyPrice ? this.props.modifyPrice.toFixed(2)
                  : this.props.refundAmount.toFixed(2)}
              </label>
            )}
            <Button
              onClick={() => {
                this.setState({ editRefund: !this.state.editRefund }, () => {
                  if (!this.state.editRefund) {
                    this.props.form.setFieldsValue({
                      actualReturnPrice: Number(this.props.modifyPrice || this.props.refundAmount).toFixed(2)
                    });
                    this.setState({ refund: Number(this.props.modifyPrice || this.props.refundAmount).toFixed(2) });
                  }
                });
              }}
            >
              {this.state.editRefund ? '放弃修改' : '修改'}
            </Button>
          </FormItem>

          <FormItem {...formItemLayout} label="退款积分">
            {getFieldDecorator('actualReturnPoints', {
              initialValue: this.props.applyPoints || Number(0),
            })(<Input type="hidden" />)}
            <label style={{ marginRight: 10 }}>
              {this.props.applyPoints &&
                this.props.applyPoints ||
                Number(0)}
            </label>
          </FormItem>
          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('refundComment', {
              ...comment,
              initialValue: this.props.modifyComment || '',
              rules: [
                {
                  min: 1,
                  max: 100,
                  message: '1-100字'
                }
              ]
            })(<Input.TextArea />)}
          </FormItem>
        </Form>
      </div>
    );
  }

  _renderBank() {
    const customerAccounts = this.props.customerAccounts;

    let accounts = (customerAccounts ? customerAccounts : fromJS([])).map(
      (customerAccount) => {
        return (
          <Option
            value={customerAccount.get('customerAccountId')}
            key={customerAccount.get('customerAccountId')}
          >
            {this._renderBankName(customerAccount)}
          </Option>
        );
      }
    );

    return accounts.count() >= 5
      ? accounts
      : accounts.concat(
        <Option value={'0'} key="add-customer-account">
          <span style={{ color: 'green' }}>+其他收款账户</span>
        </Option>
      );
  }

  /**
   * 客户收款账户选中
   * @param customerAccountId
   */
  onCustomerAccountSelect(customerAccountId) {
    this.setState({ isAddCustomerAccount: customerAccountId === '0' });
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
}

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

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10
  },
  text: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14
  },
  record: {
    color: '#333',
    fontSize: 14,
    paddingLeft: 30,
    paddingTop: 5,
    paddingBottom: 5
  }
} as any;
