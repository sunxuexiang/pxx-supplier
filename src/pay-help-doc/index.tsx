import React from 'react';

export default class HelpDoc extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.container}>
        <h1>聚合支付配置帮助文档</h1>
        <br />
        <h2>一、开通支付渠道</h2>
        <br />
        <h3>1.开通支付宝支付</h3>
        <br />
        <p>
          如果您需要开通支付宝支付，请前往支付宝注册并开通您的企业支付宝账号，签约您需要的支付产品。本系统支持接入当面付、手机网站支付、APP支付、电脑网站支付，您可根据自己的实际需求签约。
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa119.png')} />
        </p>
        <br />
        <h3>2.开通微信支付</h3>
        <br />
        <p>
          注意：如果您需要微信应用内支付或者微信扫码支付，请前往微信公众平台开通。如果您需要微信APP支付，请前往微信开放平台开通。
        </p>
        <br />
        <p>
          <strong>开通微信公众号支付</strong>
        </p>
        <br />
        <p>
          如果您需开通微信公众号支付，请前往微信公众平台注册并开通您的微信服务号。获得服务号后，您还需在您的微信公众平台→微信支付→支付申请处提交申请，获取微信支付商户号。
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa283.png')} />
        </p>
        <br />
        <p>
          如果需要在微信应用内使用微信支付，您需要在您的H5端商城服务器内添加微信授权文件，并在微信支付商户平台配置您的支付授权目录
        </p>
        <br />
        <p>
          ①
          在微信公众平台→公众号设置→功能设置→网页授权域名→授权回调页面域名填写您H5端商城的域名；
        </p>
        <br />
        <p>② 下载授权文件，将文件上传至您的服务器；</p>
        <br />
        <p>
          <img src={require('./imgs/aaaa415.png')} />
        </p>
        <br />
        <p>
          ③
          登录微信支付商户平台→产品中心→开发配置→支付配置→公众号支付处填写授权目录（该目录与上一步您配置的网页授权域名需属于同一个域名，后缀格式参考下图）
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa494.png')} />
        </p>
        <br />
        <p>
          <strong>开通微信APP支付</strong>
        </p>
        <br />
        <p>
          如果您需开通微信APP支付，您需前往微信开放平台注册并开通您的微信开放平台账号。获得开放平台账号后，您需在账号中心→基本资料→开发者资质处获得开发者认证。认证通过后，您需在管理中心→移动应用创建您的APP。移动应用审核通过后，您需要申请开通该应用的微信支付。
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa639.png')} />
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa641.png')} />
        </p>
        <br />
        <p>
          <strong>开通银联支付</strong>
        </p>
        <br />
        <p>
          如果您需开通银联在线支付，请前往中国银联-商家中心注册并提交入网申请。我们支持PC在线收款的网关支付、手机无线收款的手机网页支付（WAP支付），您可根据自己的实际需求开通。
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa737.png')} />
        </p>
        <br />

        <h2>二、开通您的ping++聚合支付</h2>
        <br />
        <p>1. 前往ping++聚合支付官网注册开通您的聚合支付。</p>
        <br />
        <p>2. 登录ping++管理平台，添加需接入支付的应用。</p>
        <br />
        <p>
          <img src={require('./imgs/aaaa808.png')} />
        </p>
        <br />
        <p>
          3.
          进入您的应用，根据ping++提供的操作指引配置好各渠道参数，本系统支持接入以下渠道，您可根据您的实际需求开通。
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa869.png')} />
        </p>
        <br />
        <p>
          4.
          进入您的应用，在技术开发-Webhooks配置Webhooks通知地址（如有疑问，请联系我们的客服人员）
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa925.png')} />
        </p>
        <br />
        <p>
          5.
          您可根据自己支付业务的实际需求选择您在ping++开通的企业版本。开通ping++聚合支付时遇到任何问题，可前往ping++帮助中心或线联系ping++为您解答。
        </p>
        <br />

        <h2>三、配置商城支付</h2>
        <br />
        <p>1. 开通了支付渠道与聚合支付后，您还需将相关参数配置到本系统内</p>
        <br />
        <p>
          <img src={require('./imgs/aaaa1047.png')} />
        </p>
        <br />
        <p>2. 各参数获取方式如下：</p>
        <br />
        <p>① App ID：从ping++管理平台→应用获取</p>
        <br />
        <p>
          <img src={require('./imgs/aaaa1087.png')} />
        </p>
        <br />
        <p>② Live Secret Key：从ping++管理平台→企业设置→开发设置获取</p>
        <br />
        <p>
          <img src={require('./imgs/aaaa1130.png')} />
        </p>
        <br />
        <p>③ Ping++公钥：从ping++管理平台→企业设置→开发设置获取</p>
        <br />
        <p>
          <img src={require('./imgs/aaaa1166.png')} />
        </p>
        <br />
        <p>
          ④ 商户私钥：在ping++管理平台→企业设置→开发设置
          根据指引生成RSA公私钥对后，将公钥上传至ping++商户公钥，将私钥直接配置在本系统
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa1241.png')} />
        </p>
        <br />
        <p>
          ⑤ 微信公众号App ID/微信公众号App
          Secret：如果您需要开通微信公众号支付，您必须并正确填写微信公众号App
          ID/微信公众号App
          Secret才能生效（与您在ping++管理平台支付渠道中配置的一致，可从ping++管理平台复制粘贴）
        </p>
        <br />
        <p>
          3.
          在ping++管理平台开通支付渠道后，您可在本系统内控制相应渠道的开启或关闭
        </p>
        <br />
        <p>
          <img src={require('./imgs/aaaa1409.png')} />
        </p>
        <br />
      </div>
    );
  }
}

const styles = {
  container: {
    overflow: 'auto',
    padding: 20,
    height: 'calc(100vh)'
  }
} as any;
