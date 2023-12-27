import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IPayOrderPageResponse {
  payOrderResponses: Array<any>;
  pageSize: number;
  total: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的客户列表
      dataList: [],
      current: 1
    };
  }

  /**
   * 数据初始化
   * @param state
   * @param res
   * @returns {Map<K, V>}
   */
  @Action('list:init')
  init(state: IMap, res: IPayOrderPageResponse) {
    const { payOrderResponses, pageSize, total } = res;

    return state.withMutations(state => {
      state
        .set('total', total)
        .set('pageSize', pageSize)
        .set('dataList', fromJS(payOrderResponses));
    });
  }

  @Action('current')
  current(state: IMap, current: number) {
    return state.set('current', current);
  }
}
