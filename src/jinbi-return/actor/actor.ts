import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class InfoActor extends Actor {
  defaultState() {
    return {
      // 优惠券活动信息
      activity: {
        // 活动名称
        activityName: '',
        // 仓库id
        wareId: '1',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 是否叠加优惠
        isOverlap: 1,
        coinActivityFullType: '0',
        // 返还力度
        coinNum: '',
        // 目标客户
        targetCustomers: 0,
        goodsInfoVOS: [],
        skuIds: [],
        joinLevel: '-1'
      },
      // 不可用时间列表
      disableTimeList: []
    };
  }

  /**
   * 修改表单信息
   */
  @Action('change: form: field')
  changeFormField(state, params) {
    console.log(params.toJS(), 'activity下的活动');

    return state.update('activity', (activity) => activity.merge(params));
  }
}
