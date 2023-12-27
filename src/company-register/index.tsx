import React from 'react';

import { Form, Layout } from 'antd';
import { StoreProvider } from 'plume2';

import DetailForm from './component/detail-from';
import Banner from './component/banner';
import AppStore from './store';
import './css/style.less';
import './css/iconfont.css';

const { Header, Content } = Layout;

@StoreProvider(AppStore, { debug: __DEV__ })
export default class CompanyRegister extends React.Component<any, any> {
  store: AppStore;
  form: any;

  componentDidMount() {
    this.store.init();
  }

  constructor(props) {
    super(props);
    this.form = Form.create()(DetailForm as any);
  }

  render() {
    const WrapperForm = this.form;
    return (
      <Layout style={styles.container}>
        <Header className="header">
          <div style={styles.wrapper}>
            <a href="/" style={styles.logoBg}>
              {/* <img
                style={styles.logoImg}
                src="https://wanmi-b2b.oss-cn-shanghai.aliyuncs.com/201901311031234670.png"
              /> */}
            </a>
          </div>
        </Header>
        <Content>
          <div style={styles.wrapper1} id="page-content">
            <div className="container login company-register">
              <div className="section" style={{ background: 'none' }}>
                <div className="content" style={{ background: 'none' }}>
                  <Banner />
                  <div className="supplier-box">
                    <div className="top-box clearfix">
                      <div className="pull-left">
                        <span className="title">商家入驻</span>
                      </div>
                      <div className="pull-right small-link ">
                        <div className="t-middle">
                          已有账号？
                          <a href="/login" className="loginText">
                            前去登录
                          </a>
                        </div>
                      </div>
                    </div>
                    <WrapperForm ref={(form) => (this['_form'] = form)} />
                  </div>
                </div>
              </div>
            </div>
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
  wrapper1: {
    backgroundColor: '#f5f5f5',
    height: 'calc(100vh - 64px)',
    position: 'relative',
    overflowY: 'auto'
  } as any,
  content: {
    width: 960,
    margin: '30px auto',
    padding: 90,
    backgroundColor: '#fff'
  }
};
