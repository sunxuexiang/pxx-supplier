import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class AccountActor extends Actor {
  defaultState() {
    return {
      account: '',
      uuid: '',
      phone: '',
      //图片验证码
      enterValue: '',
      //禁用
      enableSend: true
    };
  }

  @Action('accountManager:employee')
  fetchAccount(state: IMap, account) {
    return state.set('account', fromJS(account));
  }

  /**
   * change uuid
   * @param state
   * @param uuid
   * @returns {Map<string, V>}
   */
  @Action('accountManager:uuid')
  uuid(state: IMap, uuid) {
    return state.set('uuid', uuid);
  }

  /**
   * 发送短信接口是否禁用
   * @param state
   * @param enable
   * @returns {Map<string, V>}
   */
  @Action('accountManager:enableSend')
  enableSend(state: IMap, enable) {
    return state.set('enableSend', enable);
  }

  @Action('accountManager:phone')
  phone(state: IMap, phone) {
    return state.set('phone', phone);
  }

  @Action('accountManager:onEnterValue')
  onEnterValue(state: IMap, enterValue) {
    return state.set('enterValue', enterValue);
  }
}
