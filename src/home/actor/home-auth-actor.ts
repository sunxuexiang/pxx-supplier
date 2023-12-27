import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class HomeAuthActor extends Actor {
  defaultState() {
    return {
      session: {}, //授权信息
      isAuthVisible: false, //授权modal是否显示
      isAuthTipVisible: false //授权tip是否显示
    };
  }

  /**
   * 初始化授权码信息
   */
  @Action('home-auth-actor:init')
  init(state: IMap, res) {
    return state.set('session', fromJS(res));
  }

  /**
   * 设置授权modal是否显示
   */
  @Action('home-auth-actor:setAuthVisible')
  setAuthVisible(state: IMap, res: boolean) {
    return state.set('isAuthVisible', res);
  }

  /**
   * 设置授权tip是否显示
   */
  @Action('home-auth-actor:setAuthTipVisible')
  setAuthTipVisible(state: IMap, res: boolean) {
    return state.set('isAuthTipVisible', res);
  }
}
