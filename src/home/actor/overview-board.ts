import { Action, Actor, IMap } from 'plume2';
/**
 * Created by chenpeng on 2017/10/19.
 */

export default class OverViewBoardActor extends Actor {
  defaultState() {
    return {
      trafficNum: {}, //流量概况
      tradeNum: {}, //交易概况
      skuNum: {}, //商品概况
      customerNum: {} //客户概况
    };
  }

  /**
   * 概况数据merge操作
   */
  @Action('overview-board-actor:mergeBoards')
  mergeOViewBoards(state: IMap, res) {
    return state.merge(res);
  }
}
