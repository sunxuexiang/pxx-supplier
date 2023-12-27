import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      loading: true
    };
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }
}
