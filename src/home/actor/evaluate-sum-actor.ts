import { Actor, Action, IMap } from 'plume2';



export default class ListActor extends Actor {
  defaultState() {
    return {
        storeEvaluateSum:{},
    };
  }

  @Action('storeEvaluateSum:init')
  storeEvaluateSumInit(state: IMap, res) {
    return state.withMutations(state => {
      state.set('storeEvaluateSum', res);
    });
  }


}
