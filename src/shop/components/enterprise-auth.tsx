import React from 'react';
import { Relax } from 'plume2';

import { Row, Col, Button } from 'antd';
import { noop, cache, history } from 'qmkit';
import Header from './head';
import QRCode from 'qrcode';
import '../index.less';
import { IMap } from 'plume2/es5/typings';

const png = require('../img/auth.png');

@Relax
export default class EnerpriseAuth extends React.Component<any, any> {
  props: {
    relaxProps?: {
      authStatus: number;
      companyUrl: string;
      companyInfo: IMap;
      backToAuth: Function;
      returnRegister: Function;
      backToAgree: Function;
    };
  };

  static relaxProps = {
    authStatus: 'authStatus',
    companyUrl: 'companyUrl',
    companyInfo: 'companyInfo',
    backToAuth: noop,
    returnRegister: noop,
    backToAgree: noop
  };
  render() {
    const {
      authStatus,
      companyUrl,
      backToAuth,
      backToAgree,
      returnRegister,
      companyInfo
    } = this.props.relaxProps;
    let qrCodeUrl = null;
    if (authStatus === 0 && companyUrl) {
      QRCode.toDataURL(companyUrl, { errorCorrectionLevel: 'H' }, function(
        _err,
        url
      ) {
        qrCodeUrl = url;
      });
    }
    const accountName = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA))
      .accountName;
    return (
      <div>
        <Header
          postTxt="入驻商家签约"
          btnShow
          btnTxt="商家入驻教程"
          btnClick={this.goVideo}
        />
        <div className="shopContent shop-auth-box">
          <h1 className="shop-title">商家实名认证</h1>
          {authStatus === 0 && companyUrl && (
            <div>
              <Row>
                <Col span={12} className="shop-center-col">
                  <img className="shop-qrcode" src={qrCodeUrl} alt="" />
                  <div className="shop-text-content">
                    请使用微信扫一扫，在手机上打开认证页面，完成商家实名认证操作。
                  </div>
                </Col>
                <Col
                  span={12}
                  className="shop-center-col"
                  style={{ paddingTop: '160px' }}
                >
                  <div className="shop-btn">
                    <Button
                      type="primary"
                      onClick={() => window.open(companyUrl, '_blank')}
                    >
                      点我开始商家认证
                    </Button>
                  </div>
                  <div className="shop-text-content">
                    点击上方按钮，在电脑上打开认证页面，完成商家实名认证操作。
                  </div>
                </Col>
              </Row>
            </div>
          )}
          {authStatus !== 0 && (
            <React.Fragment>
              <div className="shop-status-box">
                <div style={{ textAlign: 'center' }}>
                  <img className="shop-auth-icon" src={png} alt="" />
                  <div className="shop-auth-title">
                    {this.showTitle(authStatus)}
                  </div>
                  {authStatus === 1 && (
                    <div>商家实名认证中，请耐心等待审核！</div>
                  )}
                  {authStatus === 2 && (
                    <div>
                      商家实名认证已经通过， 法人手机
                      <span className="shop-text-phone">
                        {accountName || ''}
                      </span>
                      的号码将收到签约条款的短信链接，请通过链接完成签署
                    </div>
                  )}
                  {authStatus === 3 && (
                    <div>您的商家实名认证审核不通过，请重新认证</div>
                  )}
                  {authStatus === 2 && (
                    <div className="shop-text-content shop-text-content-long">
                      没收到签署短信或短信失效？点击
                      <Button type="link" onClick={() => returnRegister()}>
                        重新发送链接
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="shop-status-bottom">
                {authStatus === 3 && (
                  <Button type="primary" onClick={() => backToAuth()}>
                    返回
                  </Button>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
  showTitle = (type) => {
    let title = '';
    switch (type) {
      case 1:
        title = '商家实名认证中';
        break;
      case 2:
        title = '商家实名认证通过';
        break;
      case 3:
        title = '商家实名认证不通过';
        break;
      default:
        break;
    }
    return title;
  };

  goVideo = () => {
    history.push('/video-tutorial-notpass');
  };
}
