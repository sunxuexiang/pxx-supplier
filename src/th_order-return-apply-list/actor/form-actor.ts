import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {}
    };
  }

  @Action('formActor:formFieldChange')
  formFieldChange(state: IMap, params) {
    return state.set('form', fromJS({})).update('form', form => form.mergeDeep(params));
  }
}
