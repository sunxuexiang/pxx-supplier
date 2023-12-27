/**
 * Created by feitingting on 2017/12/12.
 */

import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
import { cache } from 'qmkit';

export default class FinanceActor extends Actor {
  defaultState() {
    return {
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId,
      dateRange: {
        beginTime: moment(new Date())
          .format('YYYY-MM-DD')
          .toString(),
        endTime: moment(new Date())
          .format('YYYY-MM-DD')
          .toString()
      },
      //支付方式
      payWaysObj: {},
      //收入对账列表
      incomeList: [],
      //退款对账列表
      refundList: [],
      //收入对账汇总
      incomeTotal: [],
      //退款对账汇总
      refundTotal: [],
      tabKey: '1',
      //导出单独的时间参数
      searchTime: {}
    };
  }

  /**
   * 支付方式类型
   * @param state
   * @param res
   */
  @Action('finance:payWays')
  payWays(state, res) {
    return state.set('payWaysObj', fromJS(res));
  }

  /**
   * 收入对账列表
   * @param state
   * @param res
   */
  @Action('finance:income')
  income(state, res) {
    return state.set('incomeList', fromJS(res));
  }

  /**
   * 改变日期范围
   * @param state
   * @param param
   */
  @Action('finance:dateRange')
  dateRange(state: IMap, param) {
    return state.setIn(['dateRange', param['field']], param['value']);
  }

  /**
   * 选项卡切换事件
   * @param state
   * @param key
   * @returns {Map<string, V>}
   */
  @Action('finance:tabkey')
  tabKey(state: IMap, key: string) {
    return state.set('tabKey', key);
  }

  /**
   * 退款对账列表
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('finance:refund')
  refund(state: IMap, res) {
    return state.set('refundList', fromJS(res));
  }

  /**
   * 收入汇总
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('finance:incomeTotal')
  incomeTotal(state: IMap, res) {
    return state.set('incomeTotal', fromJS(res));
  }

  /**
   * 退款汇总
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('finance:refundTotal')
  refundTotal(state: IMap, res) {
    return state.set('refundTotal', fromJS(res));
  }

  /**
   * 各项参数
   * @param state
   * @param params
   * @returns {Map<string, string|string>}
   */
  @Action('finance:params')
  params(state: IMap, kind: string) {
    return state.set('tabKey', kind == 'income' ? '1' : '2');
  }

  @Action('finance:searchTime')
  searchTime(state: IMap, searchTime: IMap) {
    return state.set('searchTime', searchTime);
  }
}
