import { Actor, Action, IMap } from 'plume2';

export default class RefuseActor extends Actor {
  defaultState() {
    return {
      refuseForm: {
        //退单id
        refundId: '',
        //拒绝原因
        refuseReason: ''
      }
    };
  }

  @Action('refuseReason')
  refuseReason(state: IMap, reason: string) {
    return state.setIn(['refuseForm', 'refuseReason'], reason);
  }

  @Action('refuse:refundId')
  refuseRefundId(state: IMap, refundId: string) {
    return state.setIn(['refuseForm', 'refundId'], refundId);
  }
}
