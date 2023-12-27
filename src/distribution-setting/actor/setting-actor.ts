import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      loading: false,
      setting: {
        openFlag: false, // 是否开启社交分销
        commissionFlag: false, // 是否开启通用分销佣金
        commissionRate: null // 通用分销佣金比例
      }
    };
  }

  @Action('setting:init')
  init(state: IMap, setting) {
    return state.set('setting', setting).set('loading', true);
  }

  @Action('change:form:value')
  changeFormValue(state: IMap, { key, value }) {
    return state.setIn(['setting', key], value);
  }
}
