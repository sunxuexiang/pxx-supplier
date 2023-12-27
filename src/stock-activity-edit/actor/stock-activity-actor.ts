/**
 * Created by hht on 2018/2/28.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class StockActivityActor extends Actor {
  defaultState() {
    return {
      marketingBean: {
        wareId: 1,
        pileActivityType:0,
        forcePileFlag:0,
        startTime:null,
        endTime:null,
        state:0,
      },
      type: null
    };
  }

  constructor() {
    super();
  }

  @Action('set:setType')
  setType(state, type) {
    return state.set('type', type)
  }

  @Action('marketing:reductionBean')
  getReductionBean(state: IMap, res) {
    return state.set('marketingBean', fromJS(res));
  }
}
