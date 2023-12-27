import React from 'react';
import PropTypes from 'prop-types';
//noinspection TypeScriptCheckImport
import { Store } from 'plume2';
import { Form, Input, Row, Col } from 'antd';
import { Const, TimerButton } from 'qmkit';

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

    const uuid = this.props.uuid;

    const enableSend = this.props.enableSend;

    let phone = {
      initialValue: this.props.phone
    };

    let enterValue = {
      initialValue: this.props.enterValue
    };

    const moblie = this.props.phone;

    const store = this._store as any;

    return (
      <Form>
        <FormItem {...formItemLayout} label="手机">
          {getFieldDecorator('phone', {
            ...phone,
            rules: [
              { required: true, message: '请输入手机号' },
              {
                pattern: /^\d{11}$/,
                message: '请输入正确的手机号'
              }
            ]
          })(
            <Input
              onChange={(e) => store.onInputPhone(e.currentTarget.value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="图片验证码">
          <Row>
            <Col span={12}>
              {getFieldDecorator('imgCode', {
                ...enterValue,
                rules: [{ required: true, message: '请输入验证码' }]
              })(
                <Input
                  onBlur={(e) => store.onCheckCaptcha(e.currentTarget.value)}
                />
              )}
            </Col>
            <Col span={8} style={{ marginLeft: 10 }}>
              <img
                style={styles.code}
                src={`${Const.HOST}/captcha?uuid=${uuid}`}
                onClick={() => store.onChangeUUid()}
              />
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label="短信验证码">
          <Row>
            <Col span={12}>
              {getFieldDecorator('msgCode', {
                rules: [{ required: true, message: '请输入短信验证码' }]
              })(<Input />)}
            </Col>
            <Col span={8} style={{ marginLeft: 10 }}>
              {!moblie || enableSend ? (
                <TimerButton key="timeBtn-1" disabled={true} />
              ) : (
                <TimerButton
                  resetWhenError={true}
                  key="timeBtn-2"
                  disabled={false}
                  onPress={() => store.sendSms()}
                />
              )}
            </Col>
          </Row>
        </FormItem>
      </Form>
    );
  }
}

const styles = {
  code: {
    height: 28,
    width: 60,
    objectFit: 'cover',
    objectPosition: '0 -20px'
  }
} as any;
