/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FullDiscountActor extends Actor {
  defaultState() {
    return {
      marketingBean: {}
    };
  }

  constructor() {
    super();
  }

  @Action('marketing:discountBean')
  getDiscountBean(state: IMap, res) {
    // const bean = fromJS(res).set(
    //   'fullDiscountLevelList',
    //   fromJS(res)
    //     .get('fullDiscountLevelList')
    //     .map((item) =>
    //       item.set(
    //         'discount',
    //         parseFloat((item.get('discount') * 10).toFixed(3))
    //       )
    //     )
    // );
    return state.set('marketingBean', fromJS(res));
  }
}
