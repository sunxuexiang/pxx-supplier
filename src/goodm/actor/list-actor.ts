import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface MarketingResponse {
  content: Array<any>;
  totalElements: number;
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
      //当前页
      currentPage: 1
    };
  }

  @Action('listActor:init')
  init(state: IMap, res: MarketingResponse) {
    const { content, totalElements } = res;

    return state.withMutations((state) => {
      state.set('total', totalElements).set('dataList', fromJS(content));
    });
  }

  @Action('list:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }
}
