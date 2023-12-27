import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface IRefundOrderPageResponse {
  content: Array<any>;
  size: number;
  total: number;
  pageNum: Number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      activityId: '',
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的客户列表
      couponList: [],
      current: 1,
      form: {
        customerAccount: '',
        orderNo: ''
      }
    };
  }

  /**
   * 数据初始化
   * @param state
   * @param res
   * @returns {Map<K, V>}
   */
  @Action('list:inits')
  inits(state: IMap, res: IRefundOrderPageResponse) {
    const { content, size, total, pageNum } = res;

    return state.withMutations((state) => {
      state
        .set('total', total)
        .set('pageSize', size)
        .set('pageNum', pageNum)
        .set('couponList', fromJS(content));
    });
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  @Action('activityId')
  setActivityId(state: IMap, activityId: string) {
    return state.set('activityId', activityId);
  }

  @Action('current')
  current(state: IMap, current: number) {
    return state.set('current', current);
  }
}
