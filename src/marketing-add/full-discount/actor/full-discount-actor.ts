/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FullDiscountActor extends Actor {
  defaultState() {
    return {
      marketingBean: {
        //商家入驻需求 wareId默认为-1（通用）  原来为1
        wareId: '-1',
        isAddMarketingName: 1,
        subType: 1
      },
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

  @Action('marketing:discountBean')
  getDiscountBean(state: IMap, res) {
    const bean = fromJS(res).set(
      'fullDiscountLevelList',
      fromJS(res)
        .get('fullDiscountLevelList')
        .map((item) =>
          item.set(
            'discount',
            parseFloat((item.get('discount') * 10).toFixed(3))
          )
        )
    );
    return state.set('marketingBean', bean);
  }
}
