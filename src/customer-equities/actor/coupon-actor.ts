import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class AllPresentActor extends Actor {
  defaultState() {
    return {
      // 优惠券活动信息
      activity: {
        // 领取类型(默认为不限)
        receiveType: 0,
        // 每人限领次数
        receiveCount: null,
        // 选择的优惠券
        coupons: [],
        // 无效的优惠券
        invalidCoupons: []
      }
    };
  }

  /**
   *  编辑时的初始化
   */
  @Action('edit: init')
  editInit(state, activity) {
    return state.set('activity', activity);
  }
  @Action('setting: cuopon:setNull')
  cuoponSetNull(state) {
    return state.set(
      'activity',
      fromJS({
        receiveType: 0,
        receiveCount: null,
        coupons: [],
        invalidCoupons: []
      })
    );
  }

  /**
   * 修改表单信息
   */
  @Action('change: form: field')
  changeFormField(state, params) {
    return state.update('activity', (activity) => activity.merge(params));
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
}
