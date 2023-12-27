import { Actor, Action, IMap } from 'plume2';

export default class RefundRecordActor extends Actor {
  defaultState() {
    return {
      // 退款单
      refundRecord: {}
    };
  }

  @Action('order-return-detail:refund-record')
  refundRecord(state: IMap, res) {
    return state.set('refundRecord', res);
  }
}
