import { Action, Actor } from 'plume2';

export default class CouponDetailActor extends Actor {
  defaultState() {
    return {
      form: {
        likeCouponName: '',
        couponStatus: null,
        scopeType: null,
        beginTime: null,
        endTime: null,
        wareId: '1'
      },
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前页
      pageNum: 1,
      couponList: []
    };
  }

  @Action('start-set')
  startChange(state, { key, value }) {
    return state.set(key, value);
  }

  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['form', key], value);
  }

  @Action('init')
  init(state, { couponList, total, pageNum }) {
    return state
      .set('couponList', couponList)
      .set('total', total)
      .set('pageNum', pageNum);
  }
}
