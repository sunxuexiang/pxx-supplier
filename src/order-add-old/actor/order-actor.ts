import { Actor, Action, IMap } from 'plume2';

export default class OrderActor extends Actor {
  defaultState() {
    return {
      //订单id
      tradeId: '',
      //订单提交状态
      submitting: false
    };
  }

  /**
   * 修改订单--保存tradeId
   * @param state
   * @param tradeId
   * @returns {Map<string, V>}
   */
  @Action('trade:init')
  init(state: IMap, tradeId) {
    return state.set('tradeId', tradeId);
  }

  /**
   * 订单提交状态
   */
  @Action('order:submitting')
  orderSubmitting(state: IMap, submitting) {
    return state.set('submitting', submitting);
  }
}
