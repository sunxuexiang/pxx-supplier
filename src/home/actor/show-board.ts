/**
 * Created by chenpeng on 2017/10/11.
 */
import { Action, Actor, IMap } from 'plume2';

export default class ShowBoardActor extends Actor {
  defaultState() {
    return {
      trafficOview: false, //显示流量概况
      tradeOview: false, //显示交易概况
      skuOview: false, //显示商品概况
      customerOview: false, //显示客户概况
      trafficReport: false, //显示流量报表
      tradeReport: false, //显示交易报表
      customerGrowthReport: false, //显示客户增长报表
      trafficTrends: false, //显示流量趋势
      tradeTrends: false, //显示交易趋势
      customerGrowthTrends: false, //显示客户增长趋势
      skuSaleRanking: false, //显示商品销量排行
      customerOrderRanking: false, //显示客户订单排行
      employeeAchieve: false //显示业务员业绩排行
    };
  }

  /**
   * 切换看板是否显示
   */
  @Action('show-board-actor:switchBoard')
  switchBoard(state: IMap, board: string) {
    return state.set(board, !state.get(board));
  }

  /**
   * 看板是否显示数据merge操作
   */
  @Action('show-board-actor:mergeBoards')
  mergeBoards(state: IMap, defBoards) {
    return state.merge(defBoards);
  }
}
