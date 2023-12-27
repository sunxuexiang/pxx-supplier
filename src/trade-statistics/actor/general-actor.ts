/**
 * Created by feitingting on 2017/10/18.
 */

import { Actor, Action, IMap } from 'plume2';

export default class GeneralActor extends Actor {
  defaultState() {
    return {
      //交易概况
      tradeGeneral: {
        //下单笔数
        orderCount: '',
        //下单人数
        orderNum: '',
        //下单金额
        orderAmt: '',
        //付款人数
        PayOrderNum: '',
        //付款订单数
        PayOrderCount: '',
        //付款金额
        payOrderAmt: '',
        //访客数
        totalUv: '',
        //笔单价
        everyUnitPrice: '',
        //客单价
        customerUnitPrice: '',
        //退单笔数
        returnOrderCount: '',
        //退单人数
        returnOrderNum: '',
        //退单金额
        returnOrderAmt: '',
        //后台获取的概况是否为空
        isNull: false,
        //下单转化率
        orderConversionRate: '',
        //付款转化率
        payOrderConversionRate: '',
        //全店转化率
        wholeStoreConversionRate: ''
      }
    };
  }

  /**
   *
   * @param state
   */
  @Action('trade:general')
  general(state: IMap, context: any) {
    return state.update('tradeGeneral', tradeGeneral =>
      tradeGeneral.merge(context)
    );
  }

  @Action('trade:isNull')
  isNull(state, isNull: boolean) {
    return state.set('isNull', isNull);
  }
}
