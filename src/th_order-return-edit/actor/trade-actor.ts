import { Actor, Action } from 'plume2';
import { IMap } from 'typings/globalType';

export default class TradeActor extends Actor {
  defaultState() {
    return {
      // 订单详情
      returnDetail: {
        returnItems: [],
        returnGifts: []
      },
      // 是否为退货，true：退货  false：退款
      isReturn: false,
      // 是否是在线支付  true 是  false 否
      isOnLine: false,
      // 可申请退款金额
      canApplyPrice: 0
    };
  }

  @Action('tradeActor: init')
  init(
    state,
    {
      returnDetail,
      isReturn,
      isOnLine,
      canApplyPrice
    }: {
      returnDetail: IMap;
      isReturn: Boolean;
      isOnLine: Boolean;
      canApplyPrice: number;
    }
  ) {
    return state
      .set('returnDetail', returnDetail)
      .set('isReturn', isReturn)
      .set('isOnLine', isOnLine)
      .set('canApplyPrice', canApplyPrice);
  }

  @Action('tradeActor: editGoodsNum')
  editGoodsNum(state, { skuId, value }: { skuId: string; value: number }) {
    return state.updateIn(['returnDetail', 'returnItems'], tradeItems => {
      const index = tradeItems.findIndex(item => item.get('skuId') == skuId);
      return tradeItems.update(index, item => item.set('num', value));
    });
  }
}
