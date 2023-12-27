import React from 'react';

const img = require('../shop/img/auth.png');

export default class ContractH5 extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: false
    };
  }

  componentDidMount() {
    if (
      navigator.userAgent.match(/Mobi/i) ||
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPhone/i)
    ) {
      this.setState({ isMobile: true });
    }
  }

  render() {
    const { isMobile } = this.state;
    return (
      <div style={isMobile ? styles.mobileBody : styles.body}>
        <h2 style={styles.title}>商家实名认证</h2>
        <img
          style={isMobile ? styles.mobileImg : styles.img}
          src={img}
          alt=""
        />
        <h2 style={styles.status}>商家实名认证通过</h2>
        <div style={isMobile ? styles.mobileContent : styles.content}>
          商家实名认证已经通过，法人手机将收到签约条款的短信链接，请通过链接完成签署
        </div>
      </div>
    );
  }
}

const styles = {
  body: {
    textAlign: 'center',
    fontSize: '16px',
    backgroundColor: '#FCFDFF',
    height: '100vh',
    padding: '16px',
    color: '#707070'
  },
  mobileBody: {
    textAlign: 'center',
    fontSize: '14px',
    backgroundColor: '#FCFDFF',
    height: '100vh',
    paddingTop: '16px',
    color: '#707070'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '12vh'
  },
  status: {
    fontWeight: 'bold',
    marginBottom: '3vh'
  },
  img: {
    width: '260px',
    marginBottom: '10vh'
  },
  mobileImg: {
    width: '60vw',
    marginBottom: '16px'
  },
  content: {
    margin: '0 auto'
  },
  mobileContent: {
    margin: '0 auto',
    width: '272px'
  }
};
