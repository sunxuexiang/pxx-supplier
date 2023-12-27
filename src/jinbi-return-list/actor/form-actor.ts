import { Actor, Action, IMap } from 'plume2';

export default class FormActor extends Actor {
  defaultState() {
    return {
      form: {
        //活动名称
        activityName: '',
        //开始时间
        startTime: null,
        //结束时间
        endTime: null,
        //目标客户
        targetLevelId: null,
        // 仓库id
        wareId: null,
        // ERP编码
        erpGoodsInfoNo: '',
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
