import { Actor, IMap, Action } from 'plume2';
import { fromJS } from 'immutable';

/**
 * 查询数据中心
 */
export default class SearchActor extends Actor {
  defaultState() {
    return {
      searchForm: {
        customerName: '',
        orderNo: '',
        payBillNo: '',
        accountId: null,
        //开始时间
        startTime: '',
        //结束时间
        endTime: '',
        dateRange: [],
        //支付方式 0线上 1线下
        payType: null,
        //支付渠道id
        payChannelId: null
      },
      offlineAccounts: [],
      //支付渠道
      channelItems: [],
      //求和价格
      sumPrice: null
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

  /**
   * 线下账号
   * @param state
   * @param offlineAccounts
   * @returns {Map<string, V>}
   */
  @Action('offlineAccounts')
  offlineAccounts(state: IMap, offlineAccounts) {
    return state.set('offlineAccounts', fromJS(offlineAccounts));
  }

  /**
   * 支付渠道
   * @param state
   * @param channelItems
   * @returns {Map<string, V>}
   */
  @Action('channelItem')
  channelItem(state: IMap, channelItem) {
    return state.set('channelItems', channelItem);
  }

  /**
   * 金额求和
   *
   * @param state
   * @param sumPrice
   * @returns {Map<string, V>}
   */
  @Action('sumPrice')
  sumPrice(state: IMap, sumPrice) {
    return state.set('sumPrice', sumPrice);
  }
}
