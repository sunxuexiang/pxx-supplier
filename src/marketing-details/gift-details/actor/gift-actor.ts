/**
 * Created by feitingting on 2017/6/20.
 */
import { Action, Actor, IMap } from 'plume2';

export default class GiftActor extends Actor {
  defaultState() {
    return {
      // 满赠规则数据
      levelList: [],
      giftList: []
    };
  }

  constructor() {
    super();
  }

  @Action('giftActor:init')
  init(state: IMap, data) {
    return state.merge(data);
  }
}
