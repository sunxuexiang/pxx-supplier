/**
 * Created by chenpeng on 2017/10/23.
 */
import { Action, Actor, IMap } from 'plume2';

export default class ReportActor extends Actor {
  defaultState() {
    return {
      tradeData: [], //交易报表
      flowData: [], //流量报表
      customerData: [] //客户增长报表
    };
  }

  /**
   * merge 报表数据
   */
  @Action('report-actor:mergeReport')
  mergeReport(state: IMap, res: IMap) {
    return state.merge(res);
  }
}
