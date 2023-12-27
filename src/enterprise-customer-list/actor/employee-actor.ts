import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class EmployeeActor extends Actor {
  defaultState() {
    return {
      employee: fromJS([])
    };
  }

  @Action('enterprise: employee:init')
  init(state: IMap, res) {
    return state.set('employee', res);
  }
}
