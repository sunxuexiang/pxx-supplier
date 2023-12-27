import React from 'react';
import { Layout } from 'antd';
import { StoreProvider } from 'plume2';
import ProcessBar from './components/process-bar';
import InputNumber from './components/input-number';
import VerifyIdentity from './components/verify-identity';
import SettingPassword from './components/setting-password';
import AppStore from './store';
import './style.css';

const logoImg = require('./img/logo.png');
const { Header, Content } = Layout;

// @ts-ignore
@StoreProvider(AppStore, { debug: __DEV__ })
export default class FindPassword extends React.Component<any, any> {
  store: AppStore;

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const state = this.props.location.state;
    const { phone } = (state || {}) as any;
    this.store.init(phone);
  }

  render() {
    const _current = this.store.state().get('current');
    const logo = this.store.state().get('logo');
    return (
      <Layout style={styles.container}>
        <Header className="header">
          <div style={styles.wrapper}>
            <a href="/" style={styles.logoBg}>
              <img style={styles.logoImg} src={logo ? logo : logoImg} />
            </a>
          </div>
        </Header>
        <Content>
          <div style={styles.content}>
            <ProcessBar />
            {_current === 0 ? <InputNumber /> : null}
            {_current === 1 ? <VerifyIdentity /> : null}
            {_current === 2 ? <SettingPassword /> : null}
          </div>
        </Content>
      </Layout>
    );
  }
}

const styles = {
  logoBg: {
    width: 140,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.49)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    height: '100vh',
    backgroundColor: '#f0f0f0'
  },
  logoImg: {
    display: 'block',
    width: 120,
    height: 'auto'
  },
  wrapper: {
    width: 960,
    margin: '0 auto'
  },
  content: {
    width: 960,
    margin: '30px auto',
    padding: 90,
    backgroundColor: '#fff'
  }
};
