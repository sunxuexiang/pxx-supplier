import { Actor, Action } from 'plume2';

export default class RegisteredActor extends Actor {
  defaultState() {
    return {
      // 优惠券活动信息
      activity: {
        advertisingId: '',
        // 活动名称
        advertisingName: '',
        // 序号
        sortNum: '',
        // 跳转链接
        jumpLink: {},
        selectedRows: [],
        imageUrl: '',
        advertisingType: '',
        advertisingConfigList: []
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
    return state.update('activity', (activity) => activity.merge(params));
  }

  /**
   * 修改优惠券总张数
   * @param index 修改的优惠券的索引位置
   * @param totalCount 优惠券总张数
   */
  @Action('change: coupon: total: count')
  changeCouponTotalCount(state, { index, totalCount }) {
    return state.setIn(
      ['activity', 'coupons', index, 'totalCount'],
      totalCount
    );
  }

  /**
   * 删除优惠券
   */
  @Action('del: coupon')
  onDelCoupon(state, couponId) {
    return state.updateIn(['activity', 'coupons'], (coupons) =>
      coupons.filter((coupon) => coupon.get('couponId') != couponId)
    );
  }

  /**
   * 设置无效的优惠券
   */
  @Action('set: invalid: coupons')
  setInvalidCoupons(state, invalidCoupons) {
    return state.setIn(['activity', 'invalidCoupons'], invalidCoupons);
  }

  /**
   * 选择优惠券
   */
  @Action('choose: coupons')
  onChosenCoupons(state, coupons) {
    coupons = coupons.map((coupon) => {
      if (!coupon.get('totalCount')) coupon = coupon.set('totalCount', 1);
      return coupon;
    });
    return state.setIn(['activity', 'coupons'], coupons);
  }

  /**
   *  编辑时的初始化
   */
  @Action('edit: init')
  editInit(state, activity) {
    return state.set('activity', activity);
  }

  /**
   *  设置不可用时间
   */
  @Action('set: disable: time')
  setDisableTime(state, list) {
    return state.set('disableTimeList', list);
  }
}
