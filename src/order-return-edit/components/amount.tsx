import * as React from 'react';
import { Relax } from 'plume2';
import { noop } from 'qmkit';
import { IMap } from 'typings/globalType';

@Relax
export default class Amount extends React.Component<any, any> {
  props: {
    flushState?: any;
    form?: any;
    relaxProps?: {
      applyStatus: boolean;
      applyPrice: number;
      applyIntegral: number;
      editPriceItem: Function;
      returnDetail: IMap;
      // 是否是在线支付  true 是  false 否
      isOnLine: boolean;
      // 可申请退款金额
      canApplyPrice: number;
    };
  };

  static relaxProps = {
    // 是否申请金额
    applyStatus: 'applyStatus',
    // 申请金额
    applyPrice: 'applyPrice',
    // 申请积分
    applyIntegral: 'applyIntegral',
    // 修改金额项
    editPriceItem: noop,
    // 订单详情
    returnDetail: 'returnDetail',
    // 是否是在线支付  true 是  false 否
    isOnLine: 'isOnLine',
    // 可申请退款金额
    canApplyPrice: 'canApplyPrice'
  };

  render() {
    const { applyStatus, applyPrice, applyIntegral, returnDetail } = this.props.relaxProps;
    const goodsPrice = Number.parseFloat(
      returnDetail
        .get('returnItems')
        .reduce((sum, item) => sum + item.get('splitPrice'), 0)
        .toFixed(2)
    );
    const shouldIntegral = returnDetail.getIn(['returnPoints', 'applyPoints']) || 0;

    return (
      <div style={{ marginBottom: 20 }}>
        <div style={styles.priceContainer}>
          <div style={styles.applyPrice} />
          <div style={styles.priceBox}>
            <label style={styles.priceItem as any}>
              <span style={styles.name}>应退金额: </span>
              <strong>
                ￥{applyStatus ? applyPrice.toFixed(2) : goodsPrice.toFixed(2)}
              </strong>
            </label>
            <label style={styles.priceItem as any}>
              <span style={styles.name}>应退积分: </span>
              <strong>
                {applyStatus
                  ? applyIntegral
                  : shouldIntegral}
              </strong>
            </label>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 修改申请退款状态
   */
  _editApplyStatus = (key: string, e) => {
    const { editPriceItem } = this.props.relaxProps;

    // 获取复选框状态
    const { checked } = e.target;

    this.props.form.resetFields(['applyPrice']);

    editPriceItem(key, checked);
    editPriceItem('applyPrice', 0);
  };

  /**
   * 修改申请退款的金额
   */
  _editApplyPrice = (key: string, returnPrice) => {
    const { editPriceItem } = this.props.relaxProps;

    editPriceItem(key, returnPrice);
  };
}

const styles = {
  priceContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #eeeeee',
    marginTop: -4,
    borderTop: 0
  } as any,

  applyPrice: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  } as any,
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  } as any,
  name: {
    width: 120,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 200,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  } as any
} as any;
