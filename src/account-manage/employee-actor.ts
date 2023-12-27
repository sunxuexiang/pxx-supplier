import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class EmployeeActor extends Actor {
  defaultState() {
    return {
      employee: {}
    };
  }

  @Action('accountManager:employee')
  employeeAccount(state: IMap, employee) {
    return state.set('employee', fromJS(employee));
  }
}
