import { Action, Actor } from 'plume2';

export default class CouponActivityDetailActor extends Actor {
  defaultState() {
    return {
      activityInfo: {
        couponActivity: {},
        couponActivityConfigList: [],
        couponInfoList: [],
        customerLevelList: [],
        customerDetailVOS: [],
        couponActivityLevelVOSasd: []
      },
      tab: '0'
    };
  }

  @Action('init')
  init(state, data) {
    return state.set('activityInfo', data);
  }

  @Action('tab: change')
  changeTab(state, key) {
    return state.set('tab', key);
  }
}
