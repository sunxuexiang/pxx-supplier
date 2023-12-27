import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        //活动名称
        marketingName: '',
        //活动类型
        marketingSubType: '-1',
        //市
        startTime: null,
        //区
        endTime: null,
        //目标客户
        targetLevelId: null,
        // 仓库id
        wareId: null,
        //查询类型
        queryTab: '0',
        //未删除
        delFlag: 0
      }
    };
  }

  @Action('form:field')
  changeField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }
}
