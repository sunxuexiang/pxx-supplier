import * as React from 'react';
import {Relax} from 'plume2';
import {noop, QMFloat} from 'qmkit';
import {IMap} from 'typings/globalType';

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
      tradeDetail: IMap;
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
    tradeDetail: 'tradeDetail',
    // 是否是在线支付  true 是  false 否
    isOnLine: 'isOnLine',
    // 可申请退款金额
    canApplyPrice: 'canApplyPrice'
  };

  render() {
    const {applyStatus, applyPrice, applyIntegral, tradeDetail} = this.props.relaxProps;
    const shouldPrice = tradeDetail
      .get('tradeItems')
      .filter(sku => sku.get('num') > 0)
      .map(sku => {
        return QMFloat.accMul(sku.get('price'), sku.get('num'));

        if (sku.get('num') < sku.get('canReturnNum')) {
          //小于可退数量,直接单价乘以数量
          return QMFloat.accMul(sku.get('price'), sku.get('num'));
        } else {
          //大于等于可退数量 , 使用分摊小计金额 - 已退金额(单价*(购买数量-可退数量))
          return QMFloat.accSubtr(
            sku.get('splitPrice'),
            QMFloat.accMul(
              sku.get('price'),
              QMFloat.accSubtr(sku.get('totalNum'), sku.get('canReturnNum'))
            )
          );
        }
      })
      .reduce((one, two) => QMFloat.accAdd(one, two));

    // 可退积分
    const shouldIntegral = tradeDetail.getIn(['tradePrice', 'points']) == null ? 0 : tradeDetail
        .get('tradeItems')
        .filter((sku) => sku.get('num') > 0)
        .map((sku) => {
          if (sku.get('num') < sku.get('canReturnNum')) {
            // 小于可退数量,直接均摊积分乘以数量
            return Math.floor(QMFloat.accMul(sku.get('skuPoint'), sku.get('num')));
          } else {
            // 大于等于可退数量 , 使用积分 - 已退积分(均摊积分*(购买数量-可退数量))
            return Math.floor(QMFloat.accSubtr(
              sku.get('points'),
              Math.floor(QMFloat.accMul(
                sku.get('skuPoint'),
                QMFloat.accSubtr(sku.get('totalNum'), sku.get('canReturnNum'))
              )))
            );
          }
        })
        .reduce((one, two) => one + two) || 0;

    return (
      <div style={{marginBottom: 20}}>
        <div style={styles.priceContainer}>
          <div style={styles.applyPrice}/>
          <div style={styles.priceBox}>
            <label style={styles.priceItem as any}>
              <span style={styles.name}>应退金额: </span>
              <strong>
                ￥{applyStatus
                ? applyPrice.toFixed(2)
                : QMFloat.addZero(shouldPrice)}
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
    const {editPriceItem} = this.props.relaxProps;

    // 获取复选框状态
    const {checked} = e.target;

    this.props.form.resetFields(['applyPrice']);

    editPriceItem(key, checked);
    editPriceItem('applyPrice', 0);
  };

  /**
   * 修改申请退款的金额
   */
  _editApplyPrice = (key: string, returnPrice) => {
    const {editPriceItem} = this.props.relaxProps;

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
