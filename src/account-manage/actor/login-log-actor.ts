import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

/**
 * 登录日志
 */
export default class LoginLogActor extends Actor {
  defaultState() {
    return {
      logs: []
    };
  }

  @Action('accountManager:logs')
  logs(state: IMap, logs) {
    return state.set('logs', fromJS(logs));
  }
}
