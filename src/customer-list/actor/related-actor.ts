import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class RelaterActor extends Actor {
  defaultState() {
    return {
      addRelatedModalShow: false,
      updateRelatedModalShow: false,
      updateCustomerInfo: {}
    };
  }

  @Action('addRelated:visible')
  addRelatedShowModal(state: IMap, content) {
    return state.set('addRelatedModalShow', content);
  }

  @Action('updateRelated:visible')
  updateRelatedShowModal(state: IMap, content) {
    return state.set('updateRelatedModalShow', content);
  }

  @Action('updateRelated:setCustomerInfo')
  setCustomerId(state: IMap, content) {
    return state.set('updateCustomerInfo', fromJS(content));
  }
}
