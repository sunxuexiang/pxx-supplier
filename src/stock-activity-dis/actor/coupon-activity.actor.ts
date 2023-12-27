import { Action, Actor } from 'plume2';

export default class CouponActivityDetailActor extends Actor {
  defaultState() {
    return {
      // activityInfo: {
      //   couponActivity: {},
      //   couponActivityConfigList: [],
      //   couponInfoList: [],
      //   customerLevelList: [],
      //   customerDetailVOS: [],
      //   couponActivityLevelVOSasd: []
      // },
      activityInfo: {},
      wareId: null,
      marketingId:null
    };
  }

  @Action('init')
  init(state, data) {
    return state.set('activityInfo', data);
  }

  @Action('tab: change')
  changeTab(state, key) {
    return state.set('wareId', key);
  }
  @Action('action: change')
  changeAction(state, {key,value}) {
    return state.set(key, value);
  }
}
