import { Action, Actor, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 搜索条件
      form: {
        returnFlowState: ''
      },
      //审核
      refundVisible:false,
      refundAuditForm:{
        actualReturnPrice:0,
        balancePrice:0,
      }
    };
  }

  // 搜索条件
  @Action('order-return-list:form:field')
  formFieldChange(state: IMap, params) {
    return state.update('form', form => form.mergeDeep(params));
  }

  // 审核
  @Action('order-return-list:form:audit:field')
  setAuditFormFieldChange(state: IMap, {key,value}) {
    return state.setIn(['refundAuditForm',key], value);
  }

  @Action('order-return-list:form:audit')
  setAuditFormChange(state: IMap, value) {
    return state.set('refundAuditForm',value);
  }


  @Action('order-return-list:actor')
  setActorChange(state: IMap, {key,value}) {
    return state.set(key,value);
  }


}
