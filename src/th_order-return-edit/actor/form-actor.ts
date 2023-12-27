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
      description: ''
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
    let selectedReturnReason = '';
    let selectedReturnWay = '';
    if (!returnReasonList.isEmpty()) {
      selectedReturnReason = returnReasonList
        .first()
        .keySeq()
        .first();
    }
    if (!returnWayList.isEmpty()) {
      selectedReturnWay = returnWayList
        .first()
        .keySeq()
        .first();
    }
    return state
      .set('returnReasonList', returnReasonList)
      .set('returnWayList', returnWayList)
      .set('selectedReturnReason', selectedReturnReason)
      .set('selectedReturnWay', selectedReturnWay);
  }

  /**
   * 修改项
   */
  @Action('formActor: editItem')
  editItem(state, { key, value }: { key: string; value: string }) {
    return state.set(key, value);
  }
}
