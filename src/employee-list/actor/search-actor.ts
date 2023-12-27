import { Actor, Action, IMap } from 'plume2';
import { cache } from 'qmkit';
import { fromJS } from 'immutable';
export default class RoleActor extends Actor {
  //数据源
  defaultState() {
    return {
      roles: [],
      //员工查询form
      searchForm: {
        userName: '',
        userPhone: '',
        accountName: '',
        isEmployee: null,        
        //部门id集合    
        departmentIds:[],   
        //角色集合
        roleIds:[],
        //是否隐藏离职员工，默认不
        isHiddenDimission:localStorage.getItem(cache.HIDE_EMPLOYEE_SETTING)=='1'?1:0
      },
      //部门树
      departTree:fromJS([]),
      //未经处理的部门list
      departList:fromJS([]),
      //左侧树形默认展开的key集合
      defaultExpandedKeys:[],
      //当前员工所管理的部门ID集合
      manageDepartmentIdList:fromJS([]),
      //是否为管理员或者是否为主账号
      isMaster:0,      
      lastDepartmentIds:[]
    };
  }

  constructor() {
    super();
  }

  @Action('employee:initRoles')
  initRoles(state: IMap, roles) {
    return state.set('roles', roles);
  }

  /**
   * 修改搜索框
   * @param state
   * @param field
   * @param value
   * @returns {Map<K, V>}
   */
  @Action('change:searchForm')
  searchForm(state: IMap, { field, value }) {    
    return state.setIn(['searchForm', field], value);
  }

  @Action('employee:departTree')
  departTree(state,departTree){
    return state.set('departTree',departTree)
  }

  @Action('employee:departList')
  departList(state,departList){
    return state.set('departList',departList)
  }

  @Action('employee:defaultExpandedKeys')
  defaultExpandedKeys(state,defaultExpandedKeys){
    return state.set('defaultExpandedKeys',defaultExpandedKeys)
  }

  @Action('employee:manageDepartmentIdList')
  manageDepartmentIdList(state,{ids:ids,isMaster:isMaster}){
    return state.set('manageDepartmentIdList',ids)
    .set('isMaster',isMaster)
  }

  @Action('employee:lastDepartmentIds')
  lastDepartmentIds(state,lastDepartmentIds){
    return state.set('lastDepartmentIds',lastDepartmentIds)
  }
}
