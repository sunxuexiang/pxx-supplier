import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
const FormItem = Form.Item;
const logo = require('../img/logo.png');
import { Store } from 'plume2';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import PropTypes from 'prop-types';
import { history, Const } from 'qmkit';
import moment from 'moment';

export default class LoginForm extends React.Component<any, any> {
  form;
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
    const loginLogo = this._store.state().get('loginLogo');
    const isLoading = this._store.state().get('isLoading');

    return (
      <Form style={styles.loginForm}>
        <FormItem style={{ marginBottom: 15 }}>
          <div style={styles.header}>
            <img style={styles.logo} src={loginLogo ? loginLogo : logo} />
          </div>
          <strong style={styles.title}>商家后台</strong>
        </FormItem>
        <FormItem>
          {getFieldDecorator('account', {
            rules: [{ required: true, message: '账号不能为空' }]
          })(
            <Input
              prefix={<Icon type="user" style={{ fontSize: 13 }} />}
              placeholder="请输入您的登录账号"
            />
          )}
        </FormItem>
        <FormItem style={{ marginBottom: 0 }}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '密码不能为空' }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </FormItem>
        <FormItem>
          {/*{getFieldDecorator('isRemember', {
          })(
            <Checkbox>记住账号</Checkbox>
          )}*/}
          <a
            style={{ float: 'left' }}
            onClick={() => history.push('/company-register')}
          >
            免费注册
          </a>
          <a
            style={{ float: 'right' }}
            onClick={() => history.push('/find-password')}
          >
            忘记密码
          </a>
        </FormItem>
        <FormItem>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            style={styles.loginBtn}
            onClick={(e) => this._handleLogin(e)}
          >
            登录
          </Button>
        </FormItem>
        <FormItem style={{ marginBottom: 0 }}>
          <div>
            <p
              style={{ textAlign: 'center', lineHeight: '20px', color: '#999' }}
            >
              © 2017-{moment().format('YYYY')} 大白鲸
            </p>
            <p
              style={{ textAlign: 'center', lineHeight: '20px', color: '#999' }}
            >
              版本号：{Const.COPY_VERSION}
            </p>
          </div>
        </FormItem>
      </Form>
    );
  }

  _handleLogin = (e) => {
    e.preventDefault();
    const form = this.props.form as WrappedFormUtils;
    form.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        (this._store as any).login(values, true);
      }
    });
  };
}

const styles = {
  loginForm: {
    width: 370,
    minHeight: 325,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 30,
    marginTop: -50
  },
  loginBtn: {
    width: '100%'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  logo: {
    display: 'block',
    width: 'auto',
    height: 42
  },
  title: {
    fontSize: 18,
    color: '#333',
    lineHeight: 1,
    textAlign: 'center',
    display: 'block'
  }
} as any;
