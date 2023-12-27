import { Actor, IMap, Action } from 'plume2';
import { fromJS } from 'immutable';

/**
 * 查询数据中心
 */
export default class SearchActor extends Actor {
  defaultState() {
    return {
      searchForm: {
        returnOrderCode: '',
        refundBillCode: '',
        refundStatus: null,
        accountId: ''
      },
      offlineAccounts: []
    };
  }

  /**
   * 修改搜索框
   * @param state
   * @param field
   * @param value
   * @returns {Map<K, V>}
   */
  @Action('change:searchForm')
  searchForm(state: IMap, { field, value }) {
    return state.setIn(['searchForm', field], value);
  }

  @Action('offlineAccounts')
  offlineAccounts(state: IMap, offlineAccounts) {
    return state.set('offlineAccounts', fromJS(offlineAccounts));
  }
}
