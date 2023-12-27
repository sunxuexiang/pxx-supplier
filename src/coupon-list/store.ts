import { IOptions, Store } from 'plume2';

import { fromJS } from 'immutable';
import { Const } from 'qmkit';
import { message } from 'antd';
import moment from 'moment';
import * as webapi from './webapi';
import CouponListActor from './actor/coupon-list-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new CouponListActor()];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state().get('form').toJS();
    const couponStatus = this.state().get('queryTab');
    if (query.scopeType == -1) {
      query.scopeType = null;
    }
    if (query.couponStatus == 0) {
      query.couponStatus = null;
    }
    const { res } = await webapi.couponList({
      ...query,
      couponStatus,
      pageNum,
      pageSize
    });
    const warePage = JSON.parse(localStorage.getItem('warePage')) || [];

    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    let couponList = null;
    if (res.context.couponInfos) {
      couponList = res.context.couponInfos.content;
      couponList = couponList.map((coupon) => {
        warePage.forEach((element) => {
          if (element.wareId == coupon.wareId) {
            coupon.wareName = element.wareName;
          } else if (coupon.wareId == 0 || coupon.wareId == -1) {
            coupon.wareName = '通用';
          }
        });
        // 3.1.面值
        if (coupon.fullBuyType == 0) {
          //无门槛
          coupon.denominationStr = `满0减${coupon.denomination}`;
        } else {
          coupon.denominationStr = `满${coupon.fullBuyPrice}减${coupon.denomination}`;
        }
        // 3.2.有效期
        if (coupon.rangeDayType == 0) {
          // 按起止时间
          let startTime = moment(coupon.startTime)
            .format(Const.DAY_FORMAT)
            .toString();
          let endTime = moment(coupon.endTime)
            .format(Const.DAY_FORMAT)
            .toString();
          coupon.startTime = coupon.validity = `${startTime}至${endTime}`;
        } else {
          // 按N天有效
          coupon.validity = `领取当天${coupon.effectiveDays}日内有效`;
        }
        // 3.3.优惠券分类
        coupon.cateNamesStr =
          coupon.cateNames.length == 0
            ? '其他'
            : coupon.cateNames.reduce((a, b) => `${a},${b}`, '').substr(1);
        // 3.4.使用范围
        if ([0, 4].indexOf(coupon.scopeType) != -1) {
          coupon.scopeNamesStr =
            Const.couponScopeType[coupon.scopeType] +
            coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1);
        } else {
          coupon.scopeNamesStr =
            Const.couponScopeType[coupon.scopeType] +
            ':' +
            (coupon.scopeNames.length != 0
              ? coupon.scopeNames.reduce((a, b) => `${a},${b}`, '').substr(1)
              : '-');
        }
        // 3.5.优惠券状态
        coupon.couponStatusStr = Const.couponStatus[coupon.couponStatus];
        //3.6 使用范围
        if (coupon.scopeType == 0) {
          coupon.scopeNamesStr = '全部商品';
        } else if (coupon.scopeType == 4) {
          coupon.scopeNamesStr = '部分商品';
        }
        return coupon;
      });
      console.log(couponList, 'couponListcouponList');
      this.dispatch('init', {
        couponList: fromJS(couponList),
        total: res.context.couponInfos.totalElements,
        pageNum: pageNum + 1
      });
    }
  };

  onTabChange = (key) => {
    this.dispatch('tab: change', key);
    this.init();
  };

  search = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  onFormFieldChange = (key, value) => {
    this.dispatch('form: field', { key, value });
  };

  /**
   * 删除优惠券
   */
  deleteCoupon = async (id) => {
    const { res } = await webapi.deleteCoupon(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('删除成功');
    //刷新页面
    this.init();
  };
  /**
   * 复制优惠券
   */
  copyCoupon = async (id) => {
    const { res } = await webapi.copyCoupon(id);
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    message.success('复制成功');
    //刷新页面
    this.init();
  };
}
