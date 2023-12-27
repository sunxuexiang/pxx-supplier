import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class InvoiceProjectActor extends Actor {
  defaultState() {
    return {
      invoiceProjects: []
    };
  }

  /**
   * 开
   * @param state
   * @param invoiceProjects
   * @returns {Map<string, V>}
   */
  @Action('invoice:invoiceProject')
  invoiceProject(state: IMap, invoiceProjects) {
    return state.set('invoiceProjects', fromJS(invoiceProjects));
  }
}
