import { Actor, Action } from 'plume2';
import { IMap, IList } from 'typings/globalType';

export default class TradeActor extends Actor {
  defaultState() {
    return {
      // 订单详情
      tradeDetail: {
        tradeItems: [], // 拥有退货数量的商品(过滤了可退数量等于0的)
        gifts: []
      },
      // 该订单原来的商品
      originTradeItems: [],
      // 已经完成的退单
      returnOrderList: [],
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
      tradeDetail,
      originTradeItems,
      returnOrderList,
      isReturn,
      isOnLine,
      canApplyPrice
    }: {
      tradeDetail: IMap;
      originTradeItems: IList;
      returnOrderList: IList;
      isReturn: Boolean;
      isOnLine: Boolean;
      canApplyPrice: number;
    }
  ) {
    return state
      .set('tradeDetail', tradeDetail)
      .set('originTradeItems', originTradeItems)
      .set('returnOrderList', returnOrderList)
      .set('isReturn', isReturn)
      .set('isOnLine', isOnLine)
      .set('canApplyPrice', canApplyPrice);
  }

  @Action('tradeActor: editGoodsNum')
  editGoodsNum(
    state,
    { devanningId, value }: { devanningId: string; value: number }
  ) {
    return state.updateIn(['tradeDetail', 'tradeItems'], (tradeItems) => {
      let index = null;
      index = tradeItems.findIndex(
        (item) =>
          item.get('devanningId') == devanningId ||
          item.get('skuId') == devanningId
      );
      // if(!index) {
      //   index = tradeItems.findIndex(
      //     (item) => item.get('skuId') == devanningId
      //   );
      // }
      console.log(devanningId, 'devanningIddevanningId1', index);
      return tradeItems.update(index, (item) => item.set('num', value));
    });
  }

  @Action('tradeActor: price')
  editGoodssplit(
    state,
    { devanningId, value }: { devanningId: string; value: number }
  ) {
    return state.updateIn(['tradeDetail', 'tradeItems'], (tradeItems) => {
      // const index = tradeItems.findIndex(
      //   (item) => item.get('devanningId') == devanningId
      // );

      let index = null;
      index = tradeItems.findIndex(
        (item) =>
          item.get('devanningId') == devanningId ||
          item.get('skuId') == devanningId
      );
      // if(!index) {
      //   index = tradeItems.findIndex(
      //     (item) => item.get('skuId') == devanningId
      //   );
      // }
      console.log(devanningId, 'devanningIddevanningId2', index);
      return tradeItems.update(index, (item) => item.set('splitPrice', value));
    });
  }
  @Action('tradeActor: prices')
  editGoodsPrice(
    state,
    { devanningId, value }: { devanningId: string; value: number }
  ) {
    return state.updateIn(['tradeDetail', 'tradeItems'], (tradeItems) => {
      // const index = tradeItems.findIndex(
      //   (item) => item.get('devanningId') == devanningId
      // );
      console.log(devanningId, 'devanningIddevanningId');

      let index = null;
      index = tradeItems.findIndex(
        (item) =>
          item.get('devanningId') == devanningId ||
          item.get('skuId') == devanningId
      );
      // if(!index) {
      //   index = tradeItems.findIndex(
      //     (item) => item.get('skuId') == devanningId
      //   );
      // }
      console.log(devanningId, 'devanningIddevanningId3', index);
      return tradeItems.update(index, (item) => item.set('price', value));
    });
  }

  @Action('tradeActor: updateGifts')
  updateGifts(state, newGiftItems) {
    return state.setIn(['tradeDetail', 'gifts'], newGiftItems);
  }
}
