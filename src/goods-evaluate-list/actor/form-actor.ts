import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
          //是否展示
          isShow:'-1',
          //是否晒单
          isUpload:'-1',
          //评分
          evaluateScore:'-1',
          isEdit:'-1'
      }
    };
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }
}
