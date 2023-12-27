import { Store } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Const, history, util } from 'qmkit';
import { message, Modal } from 'antd';
import * as webapi from './webapi';
import SpecifyActor from './actor/specify.actor';
import LoadingActor from './actor/loading-actor';

const info = Modal.info;

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new LoadingActor(), new SpecifyActor()];
  }
  changetiemChange = (value) => {
    this.dispatch('change: tiemChange', value);
  };

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
      const levRes = await webapi.allStoreCustomerLevel();
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
    } else {
      const levRes = await webapi.allCustomerLevel();
      if (levRes.res.code != Const.SUCCESS_CODE) {
        message.error(levRes.res.message);
        return;
      }
      levelList = levRes.res.context.customerLevelVOList;
    }
    this.dispatch('set: level: list', fromJS(levelList));
    this.dispatch('loading:end');
    if (activityId) {
      this.dispatch('loading:start');
      // 2.查询活动详情
      const { res } = await webapi.getActivityDetail(activityId);
      if (res.code == Const.SUCCESS_CODE) {
        let activity = {} as any;
        const {
          couponActivity,
          couponActivityConfigList,
          couponInfoList,
          couponMarketingCustomerScope,
          customerDetailVOS
        } = res.context;
        // 2.格式化数据
        // 2.1.基础信息
        activity.activityId = couponActivity.activityId;
        activity.activityName = couponActivity.activityName;
        activity.startTime = couponActivity.startTime;
        activity.sendNow = couponActivity.sendNow ? couponActivity.sendNow : 0;
        activity.endTime = couponActivity.startTime;
        activity.receiveType = couponActivity.receiveType;
        activity.receiveCount = couponActivity.receiveCount;
        activity.wareId = couponActivity.wareId;

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
        if (activity.joinLevel == -2 && customerDetailVOS) {
          // 指定活动用户范围
          activity.chooseCustomerList = customerDetailVOS.map((item) => {
            let customer = {} as any;
            customer.customerId = item.customerId;
            // 用户名
            customer.customerName = item.customerAccount;
            // 账号
            customer.customerAccount = item.customerAccount;
            return customer;
          });
          activity.chooseCustomerIds = customerDetailVOS.map((item) => {
            return item.customerId;
          });
        }
        this.dispatch('loading:end');
        // 3.设置状态
        this.dispatch('edit: init', fromJS(activity));
      }
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
    let activity = this.state().get('activity').toJS();

    console.log(activity, 'activityactivityactivityactivity');
    // 1.从state中获取数据
    // let sendNow = this.state().get('sendNow');
    // 2.格式化数据
    let params = {} as any;
    params.activityName = activity.activityName;
    params.sendNow = activity.sendNow;

    if (activity.sendNow == 1) {
      let d = new Date(),
        str = '';
      str += d.getHours() <= 9 ? '0' + d.getHours() + ':' : d.getHours() + ':';
      str +=
        d.getMinutes() <= 9 ? '0' + d.getMinutes() + ':' : d.getMinutes() + ':';
      str += d.getSeconds() <= 9 ? '0' + d.getSeconds() : d.getSeconds();
      // console.log(str, 's')
      let itmes = {
        n: d.getFullYear() + '-',
        y:
          d.getMonth() + 1 <= 9
            ? '0' + (d.getMonth() + 1) + '-'
            : d.getMonth() + 1 + '-',
        d: d.getDate() <= 9 ? '0' + d.getDate()+' ' : d.getDate() + ' '
      };
      params.startTime = itmes.n + '' + itmes.y + '' + itmes.d + str;
      params.endTime = itmes.n + '' + itmes.y + '' + itmes.d + str;
    } else {
      params.startTime = activity.startTime;
      params.endTime = activity.startTime;
    }
    console.log(params.startTime, 'itmesitmes');
    params.couponActivityType = 1; // 指定赠券
    params.receiveType = 1;
    params.receiveCount = 1;
    params.platformFlag = 1; // 店铺
    params.joinLevel = joinLevel;
    // 指定客户
    if (joinLevel == -2) {
      params.customerScopeIds = activity.chooseCustomerIds;
    }
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

  //批量添加客户数据
  chooseCustomerBackFun = (customerIds, rows) => {
    rows = rows.map((item) => {
      let customer = {} as any;
      customer.customerId = item.customerId;
      // 用户名
      customer.customerName = item.customerName;
      // 账号
      customer.customerAccount = item.customerAccount;
      return customer;
    });
    this.dispatch('choose: customer', { customerIds, rows });
  };

  //删除已选择的客户
  onDelCustomer = (customerId) => {
    this.dispatch('del: customer', customerId);
  };
}
