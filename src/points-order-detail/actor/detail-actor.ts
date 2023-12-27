import { Actor, Action, IMap } from 'plume2';
import { Map } from 'immutable';

export default class DetailActor extends Actor {
  defaultState() {
    return {
      detail: {},
      // 表单内容
      formData: {},
      modalVisible: false,
      sellerRemarkVisible: true,
      // 卖家备注修改
      remedySellerRemark: ''
    };
  }

  @Action('detail:init')
  init(state: IMap, res: Object) {
    return state.update('detail', (detail) => detail.merge(res));
  }

  @Action('detail:setNeedAudit')
  setNeedAudit(state: IMap, need) {
    return state.set('needAudit', need);
  }

  @Action('detail-actor:changeDeliverNum')
  changeDeliverNum(state: IMap, { skuId, isGift, num }) {
    return state.update('detail', (detail) => {
      if (isGift) {
        return detail.setIn(
          [
            'gifts',
            detail.get('gifts').findIndex((item) => skuId == item.get('skuId')),
            'deliveringNum'
          ],
          num
        );
      } else {
        return detail.setIn(
          [
            'tradeItems',
            detail
              .get('tradeItems')
              .findIndex((item) => skuId == item.get('skuId')),
            'deliveringNum'
          ],
          num
        );
      }
    });
  }

  /**
   * 显示发货modal
   */
  @Action('detail-actor:showDelivery')
  show(state, needClear: boolean) {
    if (needClear) {
      state = state.set('formData', Map());
    }
    return state.set('modalVisible', true);
  }

  /**
   * 关闭发货modal
   * @param state
   */
  @Action('detail-actor:hideDelivery')
  hide(state) {
    return state.set('modalVisible', false);
  }

  /**
   * 显示/取消卖家备注修改
   * @param state
   * @returns {Map<string, boolean>}
   */
  @Action('detail-actor:setSellerRemarkVisible')
  setSellerRemarkVisible(state: IMap, param: boolean) {
    return state
      .set('sellerRemarkVisible', param)
      .set('remedySellerRemark', '');
  }

  /**
   * 修改卖家备注
   * @param state
   * @param param
   * @returns {Map<string, boolean>}
   */
  @Action('detail-actor:remedySellerRemark')
  remedySellerRemark(state: IMap, param: boolean) {
    return state.set('remedySellerRemark', param);
  }
}
