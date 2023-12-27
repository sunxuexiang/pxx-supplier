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
        refundStatus: 2,
        accountId: '',
        beginTime: '',
        endTime: ''
      },
      offlineAccounts: [],
      //退款渠道
      channelItems: [],
      sumReturnPrice: 0
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

  /**
   * 退款渠道
   * @param state
   * @param channelItems
   * @returns {Map<string, V>}
   */
  @Action('channelItem')
  channelItem(state: IMap, channelItem) {
    return state.set('channelItems', channelItem);
  }

  @Action('sumReturnPrice')
  sumReturnPrice(state: IMap, sumReturnPrice: number) {
    return state.set('sumReturnPrice', sumReturnPrice);
  }
}
