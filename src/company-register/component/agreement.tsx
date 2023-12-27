import React from 'react';
import { message, Layout } from 'antd';
import { Fetch } from 'qmkit';
import '../css/style.less';
const { Header, Content } = Layout;

export default class Agreement extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      businessRegister: ''
    };
  }

  componentDidMount() {
    Fetch('/business/config').then(({ res }) => {
      if ((res as any).code == 'K-000000') {
        this.setState((_prevState, _props) => ({
          businessRegister: (res as any).context.supplierRegister
        }));
      } else {
        message.error((res as any).message);
      }
    });
  }

  render() {
    const { businessRegister } = this.state;
    return (
      <Layout style={styles.container}>
        {/* <Header className="header">
          <div style={styles.wrapper}>
            <a href="/" style={styles.logoBg}>    
            </a>
          </div>
        </Header> */}
        <Content>
          <div style={styles.wrapper1} id="page-content">
            <div
              className="argeement-content wrapper"
              dangerouslySetInnerHTML={{ __html: businessRegister }}
            />
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
    padding: 10,
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
