import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    };
  }

  @Action('order-return-list:loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('order-return-list:loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }
}
