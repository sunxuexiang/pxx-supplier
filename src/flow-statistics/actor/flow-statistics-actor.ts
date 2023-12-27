/**
 * Created by feitingting on 2017/10/16.
 */
import { Actor, Action, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';

export default class FlowStatisticsActor extends Actor {
  defaultState() {
    return {
      flowData: {},
      pageData: {},
      dateRange: {},
      pageSize: 10,
      weekly: false,
      sortedInfo: Map({ order: 'descend', columnKey: 'date' })
    };
  }

  @Action('flow:getFlowData')
  getFlowData(state: IMap, data) {
    return state.set('flowData', fromJS(data));
  }

  @Action('flow:setDateRange')
  setDateRange(state: IMap, data) {
    return state.set('dateRange', fromJS(data));
  }

  @Action('flow:getPageData')
  getPageData(state: IMap, data) {
    return state.set('pageData', fromJS(data));
  }

  @Action('flow:setPageSize')
  setPageSize(state: IMap, data) {
    return state.set('pageSize', fromJS(data));
  }

  @Action('flow:setChartWeekly')
  setChartWeekly(state: IMap, data) {
    return state.set('weekly', fromJS(data));
  }

  @Action('flow:setSortedInfo')
  setSortedInfo(state: IMap, data) {
    let sortedInfo = data;
    if (!sortedInfo.columnKey) {
      sortedInfo = { columnKey: 'date', order: 'descend' };
    }
    return state.set('sortedInfo', fromJS(sortedInfo));
  }
}
