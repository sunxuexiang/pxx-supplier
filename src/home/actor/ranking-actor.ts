/**
 * Created by chenpeng on 2017/10/20.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class RankingActor extends Actor {
  defaultState() {
    return {
      skuRanking: {}, //商品销售排行TOP10
      customerRanking: [], //客户定货排行TOP10
      employeeRanking: [] //业务员业绩排行TOP10
    };
  }

  /**
   * 设置商品销售排行TOP10
   */
  @Action('ranking-actor:setSkuRanking')
  setSkuRanking(state: IMap, res) {
    return state.set('skuRanking', fromJS(res));
  }

  /**
   * 设置客户订货排行TOP10
   */
  @Action('ranking-actor:setCustomerRanking')
  setCustomerRanking(state: IMap, res) {
    return state.set('customerRanking', fromJS(res));
  }

  /**
   * 设置业务员业绩排行TOP10
   */
  @Action('ranking-actor:setEmployeeRanking')
  setEmployeeRanking(state: IMap, res) {
    return state.set('employeeRanking', fromJS(res));
  }
}
