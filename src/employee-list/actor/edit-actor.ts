import { Actor, Action, IMap } from 'plume2';

export default class EditActor extends Actor {
  //数据源
  defaultState() {
    return {
      employeeForm: {
        //员工名称
        employeeName: '',
        //员工手机
        employeeMobile: '',
        //角色id,逗号分隔
        roleIds: '',
        //账户名
        accountName: '',
        //账户手机
        accountPassword: '',
        //是否是业务员
        isEmployee: null,
        //邮箱
        email: null,
        //工号
        jobNo: '',
        //职位
        position:null,
        //性别，默认0，保密
        sex:0,
        //归属部门，逗号分隔
        departmentIds:'',
        //生日
        birthday:null
      },
      edit: false,
      //编辑弹框各项控件是否禁用
      editDisable:false,
      //非当前用户能看到及操作的部门ID结合
      restDepartmentIds:[]
    };
  }

  constructor() {
    super();
  }

  @Action('edit:init')
  init(state: IMap, employee) {
    return state.mergeIn(['employeeForm'], employee);
  }

  @Action('edit')
  edit(state: IMap, isEdit) {
    return state.set('edit', isEdit);
  }

  @Action('edit:editDisable')
  editDisable(state,value){
    return state.set('editDisable',value)
  }

  @Action('edit:restDepartmentIds')
  restDepartmentIds(state,ids){
    return state.set('restDepartmentIds',ids)
  }
}
