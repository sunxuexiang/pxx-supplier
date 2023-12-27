import { Actor, Action } from 'plume2';
import { IList } from 'typings/globalType';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 退货原因
      returnReasonList: [],
      // 退货方式
      returnWayList: [],
      // 选中的退货原因
      selectedReturnReason: '',
      // 选中的退货方式
      selectedReturnWay: '',
      // 退货说明
      description: '',
      orderStatus: ''
    };
  }

  @Action('formActor: init')
  init(
    state,
    {
      returnReasonList,
      returnWayList
    }: { returnReasonList: IList; returnWayList: IList }
  ) {
    return state
      .set('returnReasonList', returnReasonList)
      .set('returnWayList', returnWayList);
  }

  /**
   * 修改项
   */
  @Action('formActor: editItem')
  editItem(state, { key, value }: { key: string; value: string }) {
    return state.set(key, value);
  }
  @Action('list:orderStatus')
  orderStatus(state, orderStatus) {
    return state.set('orderStatus', orderStatus);
  }
}
