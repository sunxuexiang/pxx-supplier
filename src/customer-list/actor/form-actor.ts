import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        //客户名称
        customerName: '',
        // 省
        provinceId: '',
        //市
        cityId: '',
        //区
        areaId: '',
        //等级
        customerLevelId: '',
        //账号
        customerAccount: '',
        //客户类型
        customerType: '-1'
      }
    };
  }

  @Action('form:customerType')
  checkState(state: IMap, index: string) {
    return state.setIn(['form', 'customerType'], index);
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }
}
