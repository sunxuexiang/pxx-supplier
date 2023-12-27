import { Actor, Action, IMap } from 'plume2';

export default class SelfFormActor extends Actor {
  defaultState() {
    return {
      selfForm: {
        //客户名称
        customerName: '',
        // 省
        provinceId: '',
        //市
        cityId: '',
        //区
        areaId: '',
        //0：启用中  1：禁用中
        customerStatus: null,
        //审核状态，0：待审核 1：已审核 2：审核未通过
        checkState: '-1',
        //负责业务员
        employeeId: '',
        //等级
        customerLevelId: '',
        //账号
        customerAccount: ''
      }
    };
  }

  @Action('self-form:checkState')
  checkState(state: IMap, index: string) {
    return state.setIn(['selfForm', 'checkState'], index);
  }

  @Action('self-form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['selfForm', field], value);
  }
}
