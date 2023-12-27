import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class InvoiceViewActor extends Actor {
  defaultState() {
    return {
      invoiceView: {}
    };
  }

  @Action('invoice:invoiceView')
  invoiceView(state: IMap, invoiceView) {
    return state.set('invoiceView', fromJS(invoiceView));
  }
}
