import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class SelectedActor extends Actor {
  defaultState() {
    return {
      selected: [],
      departmentIds:[],
      //接手业务员的ID
      targetEmployeeId:'',
      //自动补全文本框里面的内容
      searchText:''
    };
  }

  @Action('select:init')
  init(state: IMap, list) {
    return state.set('selected', fromJS(list));
  }

  @Action('employee:setTargetDeparts')
  setTargetDeparts(state,ids){
    return state.set('departmentIds',ids)
  }

  @Action('employee:targetEmployeeId')
  targetEmployeeId(state,id){
    return state.set('targetEmployeeId',id);
  }

  @Action('employee:searchText')
  searchText(state,value){
    return state.set('searchText',value)
  }
}
