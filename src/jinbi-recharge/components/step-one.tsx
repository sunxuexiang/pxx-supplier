import * as React from 'react';
import { Relax } from 'plume2';

import { noop } from 'qmkit';
import { Button, InputNumber, Input, Radio } from 'antd';
import '../index.less';

const RadioGroup = Radio.Group;
@Relax
export default class StepOne extends React.Component<any, any> {
  props: {
    relaxProps?: {
      accountMoney: string | number;
      rechargeNum: number;
      update: Function;
      goNext: Function;
      payType: number;
    };
  };

  static relaxProps = {
    accountMoney: 'accountMoney',
    rechargeNum: 'rechargeNum',
    payType: 'payType',
    update: noop,
    goNext: noop
  };

  state = {
    chooseBtn: -1
  };

  render() {
    const { chooseBtn } = this.state;
    const {
      accountMoney,
      rechargeNum,
      payType,
      update,
      goNext
    } = this.props.relaxProps;
    return (
      <div className="jr-detail">
        <p>账户鲸币余额</p>
        <p className="jr-detail-money">{accountMoney || 0}</p>
        <p>充值鲸币数量</p>
        <p>
          <Button
            type={chooseBtn === 1 ? 'primary' : 'default'}
            onClick={() => this.btnClick(1, 500)}
          >
            500元鲸币
          </Button>
          <Button
            type={chooseBtn === 2 ? 'primary' : 'default'}
            onClick={() => this.btnClick(2, 1000)}
          >
            1000元鲸币
          </Button>
          <Button
            type={chooseBtn === 3 ? 'primary' : 'default'}
            onClick={() => this.btnClick(3, 10000)}
          >
            10000元鲸币
          </Button>
          <Button
            type={chooseBtn === 5 ? 'primary' : 'default'}
            onClick={() => this.btnClick(5, 100000)}
          >
            100000元鲸币
          </Button>
        </p>
        {chooseBtn === 4 && (
          // <InputNumber
          //   min={0}
          //   precision={0}
          //   step={1}
          //   formatter={(value) => `¥${value}`}
          //   value={rechargeNum}
          //   style={{ width: '200px' }}
          //   onChange={(value) => update({ key: 'rechargeNum', value })}
          // />
          //测试用 可充值0.01
          <InputNumber
            min={0}
            // precision={0}
            // step={1}
            formatter={(value) => `¥${value}`}
            value={rechargeNum}
            style={{ width: '250px', height: '46px', fontSize: 22 }}
            onChange={(value) => update({ key: 'rechargeNum', value })}
          />
        )}
        {chooseBtn !== 4 && (
          <div onClick={() => this.inputClick()}>
            <Input
              size="large"
              prefix="￥"
              placeholder="点击输入充值数量"
              disabled
              value={rechargeNum || ''}
              style={{ width: '250px', height: '46px', fontSize: 22 }}
            />
          </div>
        )}
        <p style={{ marginTop: 20 }}>支付方式</p>
        <RadioGroup
          value={payType}
          onChange={(e) => update({ key: 'payType', value: e.target.value })}
        >
          <Radio value={0}>微信支付/支付宝支付</Radio>
          <Radio value={1}>公账支付</Radio>
        </RadioGroup>
        <div className="jr-detail-botton">
          <Button type="primary" onClick={() => goNext()}>
            下一步
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
