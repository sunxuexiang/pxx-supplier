import { Actor, Action, IMap } from 'plume2';

export default class DetailActor extends Actor {
  defaultState() {
    return {
      detail: {},
      //驳回／拒绝收货 modal状态
      rejectModalData: {},
      //填写物流 modal状态
      deliverModalData: {},
      //线下退款 modal状态
      refundModalData: {},
      // 拒绝原因，拒绝收货、拒绝退款 或 审核驳回
      rejectReason: '',
      //在线退款状态
      onlineRefundModalData: {
        refund: 0
      }
    };
  }

  @Action('order-return-detail:init')
  init(state: IMap, res: IMap) {
    return state.set('detail', res);
  }

  @Action('order-return-detail:reject-modal:change')
  rejectModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['rejectModalData', 'visible'], modalStatus.get('visible'))
      .setIn(['rejectModalData', 'type'], modalStatus.get('type'))
      .setIn(['rejectModalData', 'onOk'], modalStatus.get('onOk'))
      .setIn(['rejectModalData', 'rid'], modalStatus.get('rid'));
  }

  @Action('order-return-detail:reject-modal:hide')
  rejectModalHide(state: IMap) {
    return state.setIn(['rejectModalData', 'visible'], false);
  }

  @Action('order-return-detail:deliver-modal:change')
  deliverModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['deliverModalData', 'visible'], modalStatus.get('visible'))
      .setIn(['deliverModalData', 'onOk'], modalStatus.get('onOk'))
      .setIn(['deliverModalData', 'rid'], modalStatus.get('rid'));
  }

  @Action('order-return-detail:deliver-modal:hide')
  deliverModalHide(state: IMap) {
    return state.setIn(['deliverModalData', 'visible'], false);
  }

  @Action('order-return-detail:refund-modal:change')
  refundModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['refundModalData', 'visible'], modalStatus.get('visible'))
      .setIn(['refundModalData', 'onOk'], modalStatus.get('onOk'))
      .setIn(['refundModalData', 'rid'], modalStatus.get('rid'))
      .setIn(
        ['refundModalData', 'refundAmount'],
        modalStatus.get('refundAmount')
      )
      .setIn(['refundModalData', 'customerId'], modalStatus.get('customerId'))
      .setIn(['refundModalData', 'applyPoints'], modalStatus.get('applyPoints'));
  }

  @Action('order-return-detail:refund-online-modal:change')
  refundOnlineModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['onlineRefundModalData', 'visible'], modalStatus.get('visible'))
      .setIn(['onlineRefundModalData', 'onOk'], modalStatus.get('onOk'))
      .setIn(['onlineRefundModalData', 'rid'], modalStatus.get('rid'))
      .setIn(
        ['onlineRefundModalData', 'refundAmount'],
        modalStatus.get('refundAmount')
      )
      .setIn(
        ['onlineRefundModalData', 'customerId'],
        modalStatus.get('customerId')
      )
      .setIn(['onlineRefundModalData', 'applyPoints'],
        modalStatus.get('applyPoints'));
  }

  @Action('order-return-detail:refund-modal:hide')
  refundModalHide(state: IMap) {
    return state.setIn(['refundModalData', 'visible'], false);
  }

  /**
   * 拒绝原因
   */
  @Action('order-return-detail:rejectReason')
  rejectReason(state: IMap, res: string) {
    return state.set('rejectReason', res);
  }

  /**
   * 隐藏线上支付退款
   * @param state
   */
  @Action('order-return-detail:hide')
  onlineRefundModalHide(state: IMap) {
    return state.setIn(['onlineRefundModalData', 'visible'], false);
  }

  /**
   * 显示线上支付退款
   * @param state
   */
  @Action('order-return-detail:show')
  onlineRefundModalshow(state: IMap) {
    return state.setIn(['onlineRefundModalData', 'visible'], true);
  }
}
