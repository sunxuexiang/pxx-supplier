import { Store } from 'plume2';
import AllPresentActor from './actor/all-present-actor';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Const, history, util } from 'qmkit';
import { message, Modal } from 'antd';
import * as webapi from './webapi';
const info = Modal.info;

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new AllPresentActor()];
  }

  /**
   * 修改表单信息
   */
  changeFormField = (params) => {
    this.dispatch('change: form: field', fromJS(params));
  };

  /**
   * 修改优惠券总张数
   * @param index 修改的优惠券的索引位置
   * @param totalCount 优惠券总张数
   */
  changeCouponTotalCount = (index, totalCount) => {
    this.dispatch('change: coupon: total: count', { index, totalCount });
  };

  /**
   * 批量选择优惠券
   */
  onChosenCoupons = (coupons) => {
    this.dispatch('choose: coupons', fromJS(coupons));
  };

  /**
   * 删除优惠券
   */
  onDelCoupon = (couonId) => {
    this.dispatch('del: coupon', couonId);
  };

  /**
   * 初始化
   */
  init = async (activityId) => {
    // 1.查询自营/非自营客户等级
    let levelList = [];
    if (util.isThirdStore()) {
      const levRes = await webapi.getUserLevelList();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        message.error(levRes.res.message);
        return;
      }
      levelList = levRes.res.context.storeLevelVOList;
      // 店铺等级转成平台等级格式,方便后面的业务逻辑公用
      levelList.forEach((level) => {
        level.customerLevelId = level.storeLevelId;
        level.customerLevelName = level.levelName;
      });
    }
    this.dispatch('set: level: list', fromJS(levelList));
    if (!activityId) {
      return;
    }
    // 2.查询活动详情
    const { res } = await webapi.getActivityDetail(activityId);
    if (res.code == Const.SUCCESS_CODE) {
      let activity = {} as any;
      const {
        couponActivity,
        couponActivityConfigList,
        couponInfoList
      } = res.context;
      // 2.格式化数据
      // 2.1.基础信息
      activity.activityId = couponActivity.activityId;
      activity.activityName = couponActivity.activityName;
      activity.startTime = couponActivity.startTime;
      activity.endTime = couponActivity.endTime;
      activity.receiveType = couponActivity.receiveType;
      activity.receiveCount = couponActivity.receiveCount;
      activity.sendType = couponActivity.sendType;
      activity.joinLevel = couponActivity.joinLevel;
      activity.invalidCoupons = [];
      // 2.2.优惠券列表
      activity.coupons = couponActivityConfigList.map((item) => {
        let coupon = {} as any;
        const couponInfo = couponInfoList.find(
          (info) => info.couponId == item.couponId
        );
        // 2.2.1.优惠券基础信息
        coupon.couponId = item.couponId;
        coupon.totalCount = item.totalCount;
        coupon.couponName = couponInfo.couponName;
        // 2.2.2.面值
        coupon.denominationStr =
          couponInfo.fullBuyType == 0
            ? `满0减${couponInfo.denomination}`
            : `满${couponInfo.fullBuyPrice}减${couponInfo.denomination}`;
        // 2.2.3.有效期
        if (couponInfo.rangeDayType == 0) {
          // 按起止时间
          let startTime = moment(couponInfo.startTime)
            .format(Const.DAY_FORMAT)
            .toString();
          let endTime = moment(couponInfo.endTime)
            .format(Const.DAY_FORMAT)
            .toString();
          coupon.validity = `${startTime}至${endTime}`;
        } else {
          // 按N天有效
          coupon.validity = `领取当天${couponInfo.effectiveDays}日内有效`;
        }
        return coupon;
      });
      // 3.设置状态
      this.dispatch('edit: init', fromJS(activity));
    }
  };

  /**
   * 新增/编辑优惠券
   */
  save = async (joinLevel) => {
    if (!joinLevel) {
      message.error('请选择目标客户');
      return;
    }
    // 1.从state中获取数据
    let activity = this.state()
      .get('activity')
      .toJS();
    // 2.格式化数据
    let params = {} as any;
    params.activityName = activity.activityName;
    params.startTime = activity.startTime;
    params.endTime = activity.endTime;
    params.couponActivityType = 0; // 全场赠券
    params.receiveType = activity.receiveType;
    params.receiveCount = activity.receiveCount;
    params.sendType = activity.sendType;
    params.joinLevel = joinLevel;
    params.couponActivityConfigs = activity.coupons.map((item) => {
      return {
        couponId: item.couponId,
        totalCount: item.totalCount
      };
    });
    // 3.提交
    let res = null;
    if (activity.activityId) {
      params.activityId = activity.activityId;
      res = await webapi.modifyCouponActivity(params);
    } else {
      res = await webapi.addCouponActivity(params);
    }
    res = res.res;
    if (res.code == Const.SUCCESS_CODE) {
      message.success(activity.activityId ? '修改成功' : '保存成功');
      history.push({
        pathname: '/coupon-activity-list'
      });
    } else if (res.code == 'K-080106') {
      this.dispatch('set: invalid: coupons', fromJS(res.errorData));
      info({
        content: `${res.errorData.length}张优惠券结束时间早于活动结束时间，请删除后再保存或是修改活动时间。`,
        okText: '好的'
      });
    } else if (res.code == 'K-080104') {
      this.dispatch('set: invalid: coupons', fromJS(res.errorData));
      info({
        content: `${res.errorData.length}张优惠券不存在，请删除后保存。`,
        okText: '好的'
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 设置客户等级
   */
  setJoinLevel = (checked, id) => {
    let levelList = this.state().get('levelList');
    levelList.filter((item) => {
      if (item.get('customerLevelId') == id) {
        item = item.set('isChecked', checked);
      }
      return item;
    });
    this.dispatch('set: level: list', levelList);
  };
}
