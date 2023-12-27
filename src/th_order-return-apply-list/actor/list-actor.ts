import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 当前页数，从1开始
      currentPage: 1,
      // 可申请订单列表
      orderList: fromJS([])
    };
  }

  @Action('list:orderList')
  orderList(state: IMap, res) {
    const { content, totalElements } = res;

    return state.withMutations(state => {
      state.set('total', totalElements).set('orderList', fromJS(content));
    });
  }

  @Action('list:page')
  page(state: IMap, page: IMap) {
    return state.set('currentPage', page.get('currentPage'));
  }
}
