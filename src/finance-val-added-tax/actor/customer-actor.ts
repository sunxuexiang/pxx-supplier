import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CustomerActor extends Actor {
  defaultState() {
    return {
      customers: [],
      customerSelected: null,
      tempCustomers: []
    };
  }

  @Action('tax:customers')
  customers(state: IMap, customers) {
    return state.set('customers', fromJS(customers));
  }

  @Action('tax:tempCustomers')
  tempCustomers(state: IMap, customers) {
    return state.set('tempCustomers', customers);
  }

  @Action('tax:customerSelected')
  customerSelected(state: IMap, customer) {
    return state.set('customerSelected', customer);
  }
}
