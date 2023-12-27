import React from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import { Relax } from 'plume2';
import { noop, TimerButton } from 'qmkit';

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
      sendValidCode: Function;
      validCode: Function;
      onInputCode: Function;
    };
  };

  static relaxProps = {
    toNext: noop,
    sendValidCode: noop,
    validCode: noop,
    onInputCode: noop
  };

  render() {
    const { sendValidCode, validCode, onInputCode } = this.props.relaxProps;

    return (
      <Form>
        <FormItem {...formItemLayout} label="短信验证码">
          <Row>
            <Col span={12} style={{ marginRight: 10 }}>
              <Input
                placeholder="请输入验证码"
                onBlur={e => onInputCode(e.currentTarget.value)}
              />
            </Col>
            <Col span={10}>
              <TimerButton onPress={() => sendValidCode()} />
            </Col>
          </Row>
        </FormItem>
        <Row>
          <Col span={6}>&nbsp;</Col>
          <Col span={8}>
            <Button type="primary" onClick={() => validCode()}>
              下一步
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
