import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      logo: ''
    };
  }

  constructor() {
    super();
  }

  @Action('setting:init')
  init(state: IMap, logo) {
    return state.set('logo', logo);
  }
}
