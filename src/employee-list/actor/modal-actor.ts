import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      // 停用弹框是否显示
      modalVisible: false,
      //交接弹框是否显示
      connectmodalVisible:false,
      //调整部门弹框是否显示
      adjustmodalVisible:false,
      //禁用员工id
      employeeId: '',
      // 原因
      reason: '',
      filterEmployeeData:fromJS([])
    };
  }

  /**
   * 显示/关闭 弹窗
   */
  @Action('modal: switch')
  switch(state: IMap, employeeId) {
    const flag = !state.get('modalVisible');
    return state.withMutations((state) => {
      state
        .set('modalVisible', flag)
        .set('reason', '')
        .set('employeeId', employeeId);
    });
  }

  /**
   * 输入原因
   */
  @Action('modal: reason')
  enterReason(state: IMap, reason) {
    return state.set('reason', reason);
  }

  @Action('modal:toggleAdjustModal')
  toggleAdjustModal(state){
    return state.set('adjustmodalVisible',!state.get('adjustmodalVisible'))
  }

  @Action('modal:toggleConnectModal')
  toggleConnectModal(state){
    return state.set('connectmodalVisible',!state.get('connectmodalVisible'))
  }

  @Action('modal:connectEmployeeList')
  connectEmployeeList(state,list){
     const filterEmployeeData = list.map(v=>{
      return {
        key: v.employeeId,
        value: v.employeeName + '  ' + v.employeeMobile
      };
     })
     return state.set('filterEmployeeData',fromJS(filterEmployeeData))
  }
}
