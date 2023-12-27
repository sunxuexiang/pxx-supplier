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
        //0：启用中  1：禁用中
        customerStatus: null,
        //审核状态，1：待审核 2：已审核 3：审核未通过
        enterpriseCheckState: '-1',
        //负责业务员
        employeeId: '',
        //等级
        customerLevelId: '',
        //账号
        customerAccount: '',
        //公司名称
        enterpriseName: '',
        //公司性质
        businessNatureType: ''
      }
    };
  }

  @Action('form:enterpriseCheckState')
  checkState(state: IMap, index: string) {
    return state.setIn(['form', 'enterpriseCheckState'], index);
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }
}
