import { Actor, Action } from 'plume2';

export default class PriceActor extends Actor {
  defaultState() {
    return {
      // 是否申请金额
      applyStatus: false,
      // 申请金额
      applyPrice: 0,
      applyIntegral: 0
    };
  }

  @Action('priceActor: editPriceItem')
  editPriceItem(state, { key, value }: { key: string; value: any }) {
    return state.set(key, value);
  }
}
