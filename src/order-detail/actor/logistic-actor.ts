/**
 * Created by chenpeng on 2017/6/23.
 */

import { Action, Actor, IMap } from 'plume2';
import { List } from 'immutable';

export default class LogisticActor extends Actor {
  defaultState() {
    return {
      logistics: []
    };
  }

  @Action('logistics:init')
  init(state: IMap, res: List<any>) {
    return state.set('logistics', res);
  }
}
