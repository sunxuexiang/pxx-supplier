import React from 'react';
import { Button, DatePicker, Form, Input, Modal } from 'antd';

const FormItem = Form.Item;

export default class DeliverModal extends React.Component<any, any> {
  _form: any;
  WrapperForm: any;

  constructor(props) {
    super(props);
    this.WrapperForm = Form.create({})(DeliverForm);
  }

  state = {
    posting: false
  };

  render() {
    const WrapperForm = this.WrapperForm;
    const { data, onHide, handleOk } = this.props;
    if (!data.get('visible')) {
      return null;
    }

    return (
      <Modal  maskClosable={false}
        title="填写物流信息"
        visible={data.get('visible')}
        onCancel={() => onHide()}
        footer={[
          <Button key="back" size="large" onClick={() => onHide()}>
            取消
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
          {...{ formType: data.get('type') }}
        />
      </Modal>
    );
  }

  _handleOk(handleOk: Function) {
    const { data, onHide } = this.props;
    this._form.validateFields(null, (errs, values) => {
      if (!errs) {
        values.date = values.date.format('YYYY-MM-DD HH:mm:ss');
        this.setState({ posting: true });
        handleOk(data.get('rid'), values).then(() => {
          this.setState({ posting: false });
          onHide();
        });
      }
    });
  }
}

class DeliverForm extends React.Component<any, any> {
  checkConfirm = (_rule, value, callback) => {
    const form = this.props.form;
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

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
        <FormItem {...formItemLayout} label="物流公司" hasFeedback>
          {getFieldDecorator('logisticCompany', {
            rules: [
              {
                required: true,
                message: '请填写物流公司'
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="物流单号" hasFeedback>
          {getFieldDecorator('logisticNo', {
            rules: [
              {
                required: true,
                message: '请填写物流单号'
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="退货日期" hasFeedback>
          {getFieldDecorator('date', {
            rules: [
              {
                required: true,
                message: '请填写退货日期'
              }
            ]
          })(<DatePicker />)}
        </FormItem>
      </Form>
    );
  }
}
