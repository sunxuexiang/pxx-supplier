/**
 * Created by feitingting on 2017/12/13.
 */

import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class DetailActor extends Actor {
  defaultState() {
    return {
      //店铺ID
      storeId: null,
      //明细种类（收入明细还是退款明细）
      kind: '',
      //收入明细
      incomeDetail: [],
      //退款明细
      refundDetail: [],
      //支付方式
      payWaysObj: {},
      //付款方式（收入明细）
      incomePayWay: '',
      //付款方式（对账明细）
      refundPayWay: '',
      //交易流水号
      tradeNo:'',
      //开始时间
      beginTime: '',
      //结束时间
      endTime: '',
      //初始页码
      pageNum: 0,
      //总数
      total: 0,
      //每页显示
      pageSize: 15
    };
  }

  /**
   * 初始化
   * @param state
   * @param sid
   * @param kind
   * @returns {Map<string, V>}
   */
  @Action('detail:init')
  init(state: IMap, { sid, kind, beginTime, endTime }) {
    return state
      .set('storeId', sid)
      .set('kind', kind)
      .set('beginTime', beginTime)
      .set('endTime', endTime);
  }

  /**
   * 收入明细
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('detail:income')
  income(state: IMap, res) {
    return state.set('incomeDetail', fromJS(res));
  }

  /**
   * 支付方式类型
   * @param state
   * @param res
   */
  @Action('detail:payWays')
  payWays(state, res) {
    return state.set('payWaysObj', fromJS(res));
  }

  /**
   * 支付方式
   * @param state
   * @param value
   * @returns {Map<string, V>}
   */
  @Action('detail:income:payWay')
  incomePayWay(state: IMap, value) {
    return state.set('incomePayWay', value);
  }

  /**
   * 支付方式
   * @param state
   * @param value
   * @returns {Map<string, V>}
   */
  @Action('detail:refund:payWay')
  refundPayWay(state: IMap, value) {
    return state.set('refundPayWay', value);
  }

  /**
   * 交易流水号
   * @param state
   * @param value
   * @returns {Map<string, V>}
   */
  @Action('detail:tradeNo')
  setTradeNo(state: IMap, value) {
    return state.set('tradeNo', value);
  }

  /**
   * 退款明细
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('detail:refund')
  refund(state: IMap, res) {
    return state.set('refundDetail', fromJS(res));
  }

  /**
   * 页码
   * @param state
   * @param value
   */
  @Action('detail:pageNum')
  pageNum(state, value) {
    return state.set('pageNum', value);
  }

  /**
   * 总数
   * @param state
   * @param value
   */
  @Action('detail:total')
  total(state, value) {
    return state.set('total', value);
  }
}
