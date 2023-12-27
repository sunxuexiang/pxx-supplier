import * as React from 'react';
import { Relax } from 'plume2';
import { noop, QMFloat, Const } from 'qmkit';
import { Radio, Switch } from 'antd';

import LevelPrice from './level-price';
import AreaPrice from './area-price';

@Relax
export default class Price extends React.Component<any, any> {
  props: {
    relaxProps?: {
      priceOpt: number;
      editPriceSetting: Function;
      marketPrice: number;
      costPrice: number;
      aloneFlag: boolean;
    };
  };

  static relaxProps = {
    priceOpt: ['spu', 'priceType'],
    editPriceSetting: noop,
    marketPrice: ['goods', 'marketPrice'],
    costPrice: ['goods', 'costPrice'],
    aloneFlag: ['goods', 'aloneFlag']
  };

  render() {
    const { priceOpt, marketPrice, aloneFlag } = this.props.relaxProps;

    return (
      <div style={{ marginBottom: 20 }}>
        <div
          style={{
            marginTop: 10,
            marginRight: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>
            生效的设价方式：
            <Radio value={0} disabled checked>
              {Const.priceType[priceOpt]}
            </Radio>
          </span>
          {priceOpt != 2 && (
            <span>
              <Switch checked={aloneFlag} disabled={true} />
              &nbsp;&nbsp;&nbsp;保持独立设价
            </span>
          )}
        </div>

        {priceOpt == 0 ? (
          <LevelPrice />
        ) : priceOpt == 1 ? (
          <AreaPrice />
        ) : (
          <div style={{ marginTop: 15 }}>
            <span>
              SKU门店价：
              <strong style={{ color: '#333333' }}>
                {QMFloat.addZero(marketPrice)}
              </strong>
            </span>
          </div>
        )}
      </div>
    );
  }
}
