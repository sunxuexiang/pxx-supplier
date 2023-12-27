import React from 'react';

const img = require('./back.png');

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
        <h2 style={styles.title}>签署完成</h2>
        <img
          style={isMobile ? styles.mobileImg : styles.img}
          src={img}
          alt=""
        />
        <div>您的大白鲸App - 商家入驻合同已签署完成，</div>
        <p>请再次登录商家后台完成信息资料填写！</p>
        <div style={styles.address}>后台地址：https://supplier.cjdbj.cn</div>
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
    paddingTop: '16px',
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
    marginBottom: '12vh'
  },
  img: {
    width: '260px',
    marginBottom: '16px'
  },
  mobileImg: {
    width: '60vw',
    marginBottom: '16px'
  },
  address: {
    marginTop: '16px'
  }
};
