import { Actor, Action, IMap } from 'plume2';

export default class EditActor extends Actor {
  //数据源
  defaultState() {
    return {
      customerForm: {
        //客户名称
        customerName: '',
        //省
        provinceId: '',
        //市
        cityId: '',
        //区
        areaId: '',
        //详细地址
        customerAddress: '',
        //联系人姓名
        contactName: '',
        //联系方式
        contactPhone: '',
        //账户名
        customerAccount: '',
        //会员等级
        customerLevelId: '',
        //负责业务员
        employeeId: ''
      },
      edit: false
    };
  }

  constructor() {
    super();
  }

  @Action('edit:init')
  init(state: IMap, customer) {
    return state.mergeIn(['customerForm'], customer);
  }

  @Action('edit')
  edit(state: IMap, isEdit) {
    return state.set('edit', isEdit);
  }
}
