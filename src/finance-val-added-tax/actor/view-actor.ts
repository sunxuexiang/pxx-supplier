import { Actor, Action, IMap } from 'plume2';

/**
 * 增专票信息
 */
export default class InvoiceActor extends Actor {
  defaultState() {
    return {
      invoice: {}
    };
  }

  @Action('invoice')
  invoice(state: IMap, invoice) {
    return state.set('invoice', invoice);
  }
}
