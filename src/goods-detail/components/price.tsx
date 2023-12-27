import * as React from 'react';
import { Relax } from 'plume2';
import { Radio } from 'antd';
import { Const } from 'qmkit';

import LevelPrice from './level-price';
import AreaPrice from './area-price';

@Relax
export default class Price extends React.Component<any, any> {
  props: {
    relaxProps?: {
      priceOpt: number;
      marketPrice: number;
      costPrice: number;
    };
  };

  static relaxProps = {
    priceOpt: 'priceOpt',
    marketPrice: ['goods', 'marketPrice'],
    costPrice: ['goods', 'costPrice']
  };

  render() {
    const { priceOpt } = this.props.relaxProps;
    return (
      <div style={{ marginBottom: 20 }}>
        <span style={{ marginLeft: 10 }}>
          生效的设价方式：
          <Radio disabled checked>
            {Const.priceType[priceOpt]}
          </Radio>
        </span>
        {priceOpt == 0 ? <LevelPrice /> : priceOpt == 1 ? <AreaPrice /> : null}
      </div>
    );
  }
}
