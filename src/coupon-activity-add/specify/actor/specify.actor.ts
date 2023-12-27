import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class SpecifyActor extends Actor {
  defaultState() {
    return {
      levelList: [],

      // 优惠券活动信息
      activity: {
        // 活动名称
        activityName: '',
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 领取类型(默认为不限)
        receiveType: 0,
        // 每人限领次数
        receiveCount: null,
        // 选择的优惠券
        coupons: [],
        // 无效的优惠券
        invalidCoupons: [],
        // 目标客户
        joinLevel: '-2',
        //选择的客户ids
        chooseCustomerIds: [],
        //选择的客户
        chooseCustomerList: [],
        // 仓库id
        wareId: null,
        sendNow: 0
      }
    };
  }

  /**
   * 修改发放时间
   */
  @Action('change: tiemChange')
  changetiemChange(state, params) {
    return state.set('tiemChange', params);
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
   *  设置等级
   * @param state
   * @param data
   * @returns {any}
   */
  @Action('set: level: list')
  initLevelList(state, data) {
    return state.set('levelList', data);
  }

  /**
   *  批量添加客户
   */
  @Action('choose: customer')
  chooseCustomer(state, { customerIds, rows }) {
    return state
      .setIn(['activity', 'chooseCustomerList'], fromJS(rows))
      .setIn(['activity', 'chooseCustomerIds'], fromJS(customerIds));
  }

  /**
   * 删除已选择的客户
   */
  @Action('del: customer')
  delCustomer(state, customerId) {
    state = state.updateIn(['activity', 'chooseCustomerIds'], (customerIds) =>
      customerIds.filter((id) => id != customerId)
    );
    state = state.updateIn(['activity', 'chooseCustomerList'], (list) =>
      list.filter((customer) => customer.get('customerId') != customerId)
    );
    return state;
  }
}
