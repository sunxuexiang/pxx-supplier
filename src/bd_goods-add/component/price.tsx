import * as React from 'react';
import { Relax } from 'plume2';
import { Radio, Alert } from 'antd';
import { noop } from 'qmkit';

import LevelPrice from './level-price';
import AreaPrice from './area-price';

const RadioGroup = Radio.Group;

@Relax
export default class Price extends React.Component<any, any> {
  props: {
    relaxProps?: {
      priceOpt: number;
      editPriceSetting: Function;
      marketPrice: number;
      costPrice: number;
      saleType: number;
    };
  };

  static relaxProps = {
    priceOpt: 'priceOpt',
    editPriceSetting: noop,
    marketPrice: ['goods', 'marketPrice'],
    costPrice: ['goods', 'costPrice'],
    saleType: ['goods', 'saleType']
  };

  render() {
    const { priceOpt, saleType } = this.props.relaxProps;
    return (
      <div>
        <Alert
          message={
            <div>
              <p>请注意</p>
              <p>
                请先选择该商品使用的设价方式，同一SPU下所有SKU都使用同一种设价方式；
              </p>
              <p>
                进行SPU批量设价，设价方案将会覆盖所有SKU（开启保持独立设价的SKU除外），请谨慎操作；
              </p>
              <p>如需针对SKU单独设价，您可前往SKU的设价页；</p>
            </div>
          }
          type="info"
        />

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: 15,
            marginTop: 10,
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <RadioGroup onChange={this._editPriceSetting} value={priceOpt}>
            <Radio value={2}>以门店价销售&nbsp;&nbsp;</Radio>
            <Radio value={0}>按客户设价&nbsp;&nbsp;</Radio>
            {saleType === 0 && (
              <Radio value={1}>按订货量设价&nbsp;&nbsp;</Radio>
            )}
          </RadioGroup>
        </div>

        {priceOpt == 0 && <LevelPrice />}
        {priceOpt == 1 && <AreaPrice />}
      </div>
    );
  }

  _editPriceSetting = (e) => {
    const { editPriceSetting } = this.props.relaxProps;
    editPriceSetting('priceOpt', e.target.value);
  };
}
