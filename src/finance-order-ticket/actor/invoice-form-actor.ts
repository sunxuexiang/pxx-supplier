import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

/**
 * 开票form
 */
export default class InvoiceFormActor extends Actor {
  defaultState() {
    return {
      orderInvoiceForm: {}
    };
  }

  @Action('invoice:property')
  property(state: IMap, { propertyName, propertyValue }) {
    return state.setIn(['orderInvoiceForm', propertyName], propertyValue);
  }

  @Action('invoice:emptyForm')
  emptyForm(state: IMap) {
    return state.set('orderInvoiceForm', fromJS({}));
  }
}
