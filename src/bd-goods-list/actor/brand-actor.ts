import { Actor, Action } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class BrandActor extends Actor {
  defaultState() {
    return {
      brandList: []
    };
  }

  @Action('brandActor: init')
  init(state, brandList: IList) {
    return state.set('brandList', brandList);
  }
}
