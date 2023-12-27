import * as React from 'react';
import { Relax } from 'plume2';

import { noop } from 'qmkit';
import { Button, Row, Col } from 'antd';
import '../index.less';

const nonePng = require('../../images/none.png');

@Relax
export default class StepTwo extends React.Component<any, any> {
  props: {
    relaxProps?: {
      wechatPayUrl: string;
      aliPayUrl: string;
      rechargeNum: number;
      endTime: string;
      update: Function;
      goBack: Function;
    };
  };

  static relaxProps = {
    wechatPayUrl: 'wechatPayUrl',
    aliPayUrl: 'aliPayUrl',
    rechargeNum: 'rechargeNum',
    endTime: 'endTime',
    update: noop,
    goBack: noop
  };

  state = {
    chooseBtn: -1
  };

  render() {
    const {
      rechargeNum,
      wechatPayUrl,
      aliPayUrl,
      goBack,
      endTime
    } = this.props.relaxProps;
    return (
      <div className="jr-detail">
        <p>支付内容：鲸币充值</p>
        <p>充值数量：{rechargeNum}鲸币</p>
        <p>扫码支付</p>
        <div className="jr-detail-imgbox">
          <div className="jr-detail-imgitem">
            <img src={wechatPayUrl || nonePng} alt="" />
            <div>请使用手机“扫一扫”功能扫描二维码支付（建议使用微信）</div>
            <div>{endTime}</div>
          </div>
          {/* <div className="jr-detail-imgitem">
            <img src={aliPayUrl || nonePng} alt="" />
            <div>打开手机支付宝 扫一扫继续付款</div>
          </div> */}
        </div>
        <p style={{ textAlign: 'center' }}>
          应付：
          <span className="jr-detail-money">{rechargeNum}</span>元
        </p>
        <div className="jr-detail-botton">
          <Button type="primary" onClick={() => goBack()}>
            返回
          </Button>
        </div>
      </div>
    );
  }

  btnClick = (chooseBtn, num) => {
    const { update } = this.props.relaxProps;
    this.setState({ chooseBtn });
    update({ key: 'rechargeNum', value: num });
  };

  inputClick = () => {
    this.setState({ chooseBtn: 4 });
  };
}
