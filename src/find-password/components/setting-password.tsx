import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { Relax } from 'plume2';
import { noop } from 'qmkit';

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

@Relax
export default class InputNumber extends React.Component<any, any> {
  props: {
    relaxProps?: {
      toNext: Function;
      onInputPassword: Function;
      resetPassword: Function;
    };
  };

  static relaxProps = {
    toNext: noop,
    onInputPassword: noop,
    resetPassword: noop
  };

  render() {
    const { onInputPassword, resetPassword } = this.props.relaxProps;

    return (
      <Form>
        <FormItem {...formItemLayout} label="新密码">
          <Input
            type="password"
            placeholder="请输入新的登录密码"
            maxLength={16}
            onBlur={e => onInputPassword(e.currentTarget.value)}
          />
        </FormItem>
        <Row>
          <Col span={6}>&nbsp;</Col>
          <Col span={8}>
            <Button type="primary" onClick={() => resetPassword()}>
              提交并登录
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
