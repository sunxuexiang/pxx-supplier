import React from 'react';

import { Relax } from 'plume2';
import { StoreProvider } from 'plume2';
import AppStore from '../store';

@Relax
@StoreProvider(AppStore, { debug: __DEV__ })
export default class Paint extends React.Component<any, any> {
  store: AppStore;

  props: {
    relaxProps?: {
      tradeGeneral: any;
    };
  };

  static relaxProps = {
    tradeGeneral: 'tradeGeneral'
  };

  render() {
    const isNull = this.store.state().get('isNull');
    const { tradeGeneral } = this.props.relaxProps;
    //访客数
    const totalUv = tradeGeneral.get('totalUv');
    //下单人数
    const orderNum = tradeGeneral.get('orderNum');
    //下单金额
    const PayOrderNum = tradeGeneral.get('PayOrderNum');

    const orderConversionRate = isNull
      ? '-'
      : parseFloat(tradeGeneral.get('orderConversionRate')).toFixed(2) + '%';
    const payOrderConversionRate = isNull
      ? '-'
      : parseFloat(tradeGeneral.get('payOrderConversionRate')).toFixed(2) + '%';
    const wholeStoreConversionRate = isNull
      ? '-'
      : parseFloat(tradeGeneral.get('wholeStoreConversionRate')).toFixed(2) +
        '%';

    return (
      <div style={styles.chart}>
        {/* Yes, I'm very boring to draw the funnel, please look at here */}
        <div style={styles.box}>
          <div style={styles.topAng}>
            <div style={styles.topNum}>
              <div style={styles.topItem}>
                <p style={styles.num}>访客数</p>
                <p style={styles.num}>{totalUv}</p>
              </div>
            </div>
          </div>
          <div style={styles.midAng}>
            <div style={styles.midNum}>
              <div style={styles.topItem}>
                <p style={styles.num}>下单人数</p>
                <p style={styles.num}>{orderNum}</p>
              </div>
            </div>
          </div>
          <div style={styles.subAng}>
            <div style={styles.subNum}>
              <div style={styles.topItem}>
                <p style={styles.last}>付款人数</p>
                <p style={styles.num}>{PayOrderNum}</p>
              </div>
            </div>
          </div>
        </div>

        {/*you don't need to care about it*/}
        <div className="leftTopBorder" />
        <div className="leftBottomBorder" />
        <div className="rightBorder" />

        {/* you just also wanna focus on here */}
        <div style={styles.orderPercent}>
          <p style={styles.text}>下单转化率</p>
          <p style={styles.text}>{orderConversionRate}</p>
        </div>

        <div style={styles.payPercent}>
          <p style={styles.text}>付款转化率</p>
          <p style={styles.text}>{payOrderConversionRate}</p>
        </div>

        <div style={styles.wholePercent}>
          <p style={styles.text}>全店转化率</p>
          <p style={styles.text}>{wholeStoreConversionRate}</p>
        </div>
      </div>
    );
  }
}

const styles = {
  chart: {
    position: 'relative',
    width: 360,
    height: 360
  } as any,
  box: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  } as any,
  topAng: {
    width: 240,
    height: 0,
    borderTop: '90px solid #78d0a6',
    borderLeft: '30px solid transparent',
    borderRight: '30px solid transparent',
    position: 'relative',
    background: '#ffffff',
    zIndex: 1
  } as any,
  topNum: {
    position: 'absolute',
    left: -30,
    top: -90,
    width: 240,
    height: 90,
    zIndex: 2
  } as any,
  topItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  } as any,
  midAng: {
    position: 'relative',
    width: 172,
    height: 0,
    borderTop: '100px solid #6dccc9',
    borderLeft: '33px solid transparent',
    borderRight: '33px solid transparent',
    marginTop: 10,
    zIndex: 1,
    background: '#ffffff'
  } as any,
  midNum: {
    position: 'absolute',
    left: -33,
    top: -100,
    width: 172,
    height: 100,
    zIndex: 2
  } as any,
  subAng: {
    position: 'relative',
    width: 100,
    height: 0,
    borderTop: '150px solid #5bbcdc',
    borderLeft: '50px solid transparent',
    borderRight: '50px solid transparent',
    marginTop: 10,
    zIndex: 1
  } as any,
  subNum: {
    position: 'absolute',
    left: -50,
    top: -150,
    width: 100,
    height: 120,
    zIndex: 2
  } as any,
  num: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold'
  } as any,
  last: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'center'
  } as any,
  orderPercent: {
    position: 'absolute',
    top: 68,
    left: -2,
    width: 85,
    textAlign: 'center',
    background: '#ffffff',
    zIndex: 1,
    padding: '5px 0'
  } as any,
  text: {
    fontSize: 14,
    color: '#333333'
  },
  payPercent: {
    position: 'absolute',
    bottom: 100,
    left: -2,
    width: 85,
    textAlign: 'center',
    background: '#ffffff',
    zIndex: 1,
    padding: '5px 0'
  } as any,
  wholePercent: {
    position: 'absolute',
    bottom: 180,
    right: 0,
    width: 85,
    textAlign: 'center',
    background: '#ffffff',
    zIndex: 1,
    padding: '5px 0'
  } as any
};
