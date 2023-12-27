import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class EditorActor extends Actor {
  defaultState() {
    return {
      // 富文本编辑器
      regEditor: {},
      // 富文本内容
      context: ''
    };
  }

  @Action('equities: filed: value')
  fieldValue(state: IMap, { field, value }) {
    return state.set(field, fromJS(value));
  }

  @Action('setting: regEditor')
  regEditor(state, regEditor) {
    return state.set('regEditor', regEditor);
  }

  @Action('setting: context:setNull')
  setNull(state) {
    return state.set('context', '');
  }
}
