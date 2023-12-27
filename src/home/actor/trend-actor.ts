/**
 * Created by chenpeng on 2017/10/23.
 */
import { Action, Actor, IMap } from 'plume2';

export default class TrendActor extends Actor {
  defaultState() {
    return {
      tradeTrendData: [], //交易趋势 近10日
      flowTrendData: [], //流量趋势 近10日
      customerGrowTrendData: [] //客户增长趋势 近10日
    };
  }

  /**
   * merge 报表数据
   */
  @Action('trend-actor:mergeTrend')
  mergeTrend(state: IMap, res) {
    return state.merge(res);
  }
}
