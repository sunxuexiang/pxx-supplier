import React from 'react';
import { Form, Input, Select, Icon, DatePicker } from 'antd';
import * as webapi from '../webapi';

const FormItem = Form.Item;
const Option = Select.Option;

// @Relax
export default class ReceiveAdd extends React.Component<any, any> {
  _form: Object;

  render() {
    const ReceiveFormDetail = Form.create({})(ReceiveForm);

    return (
      <div style={styles.container}>
        <div style={styles.text}>
          <Icon type="info-circle" />
          <h4>请确认客户已线下付款</h4>
        </div>

        <label style={styles.record}>收款记录</label>
        <ReceiveFormDetail ref={_form => (this['_form'] = _form)} />
      </div>
    );
  }
}

class ReceiveForm extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      account: []
    };
  }

  componentDidMount() {
    webapi.fetchOffLineAccout().then(({ res }) => {
      this.setState({
        account: res
      });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
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

    return (
      <Form>
        <FormItem {...formItemLayout} label="收款账户" hasFeedback>
          {getFieldDecorator('accountId', {
            rules: [
              {
                required: true,
                message: '请选择收款账号'
              }
            ]
          })(
            <Select>
              {this.state.account.map(v => (
                <Option key={v.bankNo} value={v.accountId + ''}>
                  {v.bankName}-{v.bankNo}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="收款日期" hasFeedback>
          {getFieldDecorator('createTime', {
            rules: [
              {
                required: true,
                message: '请选择收款日期'
              }
            ]
          })(<DatePicker disabledDate={this.disabledDate} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="备注" hasFeedback>
          {getFieldDecorator('comment', {
            rules: [{ validator: this.checkComment }]
          })(<Input.TextArea />)}
        </FormItem>
      </Form>
    );
  }

  disabledDate(current) {
    // Can not select days before today and today
    return current && current.valueOf() > Date.now();
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
}

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
