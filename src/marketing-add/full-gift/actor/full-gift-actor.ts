/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FullGiftActor extends Actor {
  defaultState() {
    return {
      marketingBean: {
        //商家入驻需求 wareId默认为-1（通用）  原来为1
        wareId: '-1',
        isAddMarketingName: 1,
        subType: 1
      },
      giftLevelList: fromJS([]),
      type: null
    };
  }

  constructor() {
    super();
  }
  @Action('set:setType')
  setType(state, type) {
    return state.set('type', type);
  }
  @Action('marketing:giftBean')
  getGiftBean(state: IMap, res) {
    return state.set('marketingBean', fromJS(res));
  }

  @Action('marketing:giftLevelList')
  getGifttLevelBean(state: IMap, list) {
    return state.set('giftLevelList', fromJS(list));
  }
}
