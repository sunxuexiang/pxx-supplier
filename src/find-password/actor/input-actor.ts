import { Actor, Action, IMap } from 'plume2';

export default class InputActor extends Actor {
  defaultState() {
    return {
      code: '',
      phone: '',
      password: '',
      phoneInputDisable: false
    };
  }

  @Action('findPassword:inputCode')
  inputCode(state: IMap, code) {
    return state.set('code', code);
  }

  @Action('findPassword:inputPhone')
  inputPhone(state: IMap, phone) {
    return state.set('phone', phone);
  }

  @Action('findPassword:inputPassword')
  inputPassword(state: IMap, password) {
    return state.set('password', password);
  }

  @Action('set: phone')
  setPhone(state, phone) {
    return state.set('phone', phone).set('phoneInputDisable', true);
  }
}
