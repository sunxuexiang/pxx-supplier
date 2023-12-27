import * as React from 'react';
import { Relax } from 'plume2';
import { Alert, Radio, Switch } from 'antd';
import { noop, QMFloat, Const } from 'qmkit';

import LevelPrice from './level-price';
import AreaPrice from './area-price';

@Relax
export default class Price extends React.Component<any, any> {
  props: {
    relaxProps?: {
      priceOpt: number;
      editPriceSetting: Function;
      marketPrice: number;
      // 是否独立设价
      aloneFlag: boolean;
      // 切换是否保持独立设价
      switchAloneFlag: Function;
    };
  };

  static relaxProps = {
    priceOpt: ['spu', 'priceType'],
    editPriceSetting: noop,
    marketPrice: ['goods', 'marketPrice'],
    aloneFlag: 'aloneFlag',
    switchAloneFlag: noop
  };

  render() {
    const {
      priceOpt,
      marketPrice,
      aloneFlag,
      switchAloneFlag
    } = this.props.relaxProps;
    return (
      <div>
        {priceOpt != 2 && (
          <Alert
            message={
              <div>
                <p>请注意</p>
                <p>开启保持独立设价后，该SKU将不会与SPU设价方案同步</p>
              </div>
            }
            type="info"
          />
        )}
        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: 15,
            marginTop: 10,
            marginBottom: 10,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>
            生效的设价方式：
            <Radio value={0} checked>
              {Const.priceType[priceOpt]}&nbsp;&nbsp;
            </Radio>
          </span>
          {priceOpt != 2 && (
            <span>
              <Switch
                checked={aloneFlag}
                onChange={(flag) => switchAloneFlag(flag)}
              />
              &nbsp;&nbsp;&nbsp;保持独立设价
            </span>
          )}
        </div>

        {priceOpt == 0 ? (
          <LevelPrice />
        ) : priceOpt == 1 ? (
          <AreaPrice />
        ) : (
          <span>
            SKU门店价：
            <strong style={{ color: '#333333' }}>
              {QMFloat.addZero(marketPrice)}
            </strong>
          </span>
        )}
      </div>
    );
  }

  _editPriceSetting = (e) => {
    const { editPriceSetting } = this.props.relaxProps;
    editPriceSetting('priceOpt', e.target.value);
  };
}
