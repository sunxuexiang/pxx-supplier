import React from 'react';
import { Row, Col, Form, message } from 'antd';
import { noop, history, Const, cache } from 'qmkit';
import { Relax } from 'plume2';
import moment from 'moment';

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
export default class SecurityCenter extends React.Component<any, any> {
  props: {
    relaxProps?: {
      logs: any;
      onShow: Function;
      account: any;
    };
  };

  static relaxProps = {
    onShow: noop,
    account: 'account',
    logs: 'logs'
  };

  render() {
    const { onShow, account } = this.props.relaxProps;
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const mobile = loginInfo && loginInfo.mobile;
    return (
      <Form>
        <FormItem {...formItemLayout} label="登录密码">
          <Row>
            <Col span={8}>******</Col>
            <Col span={8}>
              <a
                href="javascript:;"
                onClick={() =>
                  mobile && mobile != null
                    ? history.push({
                        pathname: '/find-password',
                        state: {
                          phone: mobile
                        }
                      })
                    : message.error('请先绑定手机号')
                }
              >
                修改
              </a>
            </Col>
          </Row>
        </FormItem>
        <FormItem {...formItemLayout} label="绑定手机">
          <Row>
            <Col span={8}>{(account && account.get('phone')) || '未绑定'}</Col>
            <Col span={8}>
              <a href="javascript:;" onClick={() => onShow()}>
                {account && account.get('phone') ? '修改' : '绑定'}
              </a>
            </Col>
          </Row>
        </FormItem>
        <div style={{ marginTop: 20 }}>
          <h3>登录日志</h3>
          <ul>{this._renderLog()}</ul>
        </div>
      </Form>
    );
  }

  _renderLog = () => {
    const { logs } = this.props.relaxProps;
    return logs.map((val, index) => {
      return (
        <li key={`op-${index}`} style={styles.item}>
          {val &&
            `${moment(val.get('opTime')).format(Const.TIME_FORMAT)}  ${val.get(
              'opIp'
            )}`}
        </li>
      );
    });
  };
}

const styles = {
  item: {
    padding: '5px 20px',
    fontSize: 14
  }
};
