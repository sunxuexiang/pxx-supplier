import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface ICustomerResponse {
  content: Array<any>;
  size: number;
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
      current: 1,    
      //全部部门的人数
      countNum:0,
      //是否选中全部部门
      click:false     
    };
  }

  @Action('list:init')
  init(state: IMap, res: ICustomerResponse) {
    const { content, size, totalElements } = res;
    return state.withMutations((state) => {
      state
        .set('total', totalElements)
        .set('pageSize', size)
        .set('dataList', fromJS(content));
    });
  }

  @Action('current')
  current(state: IMap, current) {
    return state.set('current', current);
  }

  
  @Action('employee:countNum')
  restNum(state,num){
    return state.set('countNum',num);
  }

  @Action('employee:toggleClick')
  toggleClick(state){
    return state.set('click',!state.get('click'))
  }
}
