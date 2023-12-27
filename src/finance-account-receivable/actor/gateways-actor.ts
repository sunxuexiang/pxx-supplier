import { Actor, Action, IMap } from 'plume2';

export default class GateWaysActor extends Actor {
  defaultState() {
    return {
      gateways: [],
      channelJson: {},
      channel_visible: false
    };
  }

  constructor() {
    super();
  }

  @Action('gateWays:init')
  init(state: IMap, content) {
    return state.set('gateways', content);
  }

  @Action('gateWays:formValue')
  formValue(state: IMap, valueJson) {
    return state.setIn(valueJson['key'], valueJson['value']);
  }

  @Action('modal:channel_show')
  show(state: IMap, channelJson) {
    return state.set('channel_visible', true).set('channelJson', channelJson);
  }

  @Action('modal:channel_hide')
  hide(state: IMap) {
    return state.set('channel_visible', false);
  }
}
