import { Store } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Const, history } from 'qmkit';
import { message, Modal } from 'antd';
import * as webapi from './webapi';
import StoreActor from './actor/store-actor';

const info = Modal.info;

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new StoreActor()];
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
    console.log(
      coupons,
      'couponscouponscoupons123123',
      this.state().get('activity').get('coupons').toJS()
    );
    // if(coupons != '删除') {
    //   coupons = coupons.concat(this.state().get('activity').get('coupons').toJS())
    // }
    // const couId = [];
    // coupons.forEach((el) => {
    //   if(couId.indexOf(el.couponId) == -1) {
    //     couId.push(el)
    //   }
    // })
    this.dispatch('choose: coupons', fromJS(coupons));
  };

  /**
   * 删除优惠券
   */
  onDelCoupon = (couponId) => {
    this.dispatch('del: coupon', couponId);
  };

  init = async (activityId) => {
    if (activityId) {
      await this.editInit(activityId);
    }
    const { res } = await webapi.queryActivityEnableTime(2, activityId);
    if (res.code == Const.SUCCESS_CODE) {
      const disableTimeList = res.context;
      this.dispatch('set: disable: time', fromJS(disableTimeList));
    }
  };

  /**
   * 编辑初始化
   */
  editInit = async (activityId) => {
    // 1.查询活动详情32
    const { res } = await webapi.getActivityDetail(activityId);
    if (res.code == Const.SUCCESS_CODE) {
      let activity = {} as any;
      const {
        couponActivity,
        couponActivityConfigList,
        couponInfoList,
        goodsInfoVOS,
        couponActivityLevelVOS
      } = res.context;

      let leveList = [];
      if (couponActivityLevelVOS) {
        // fullGiftLevelList.forEach(element => {
        //   leveList.push(element.fullAmount ? {
        //     fullAmount: element.fullAmount ? element.fullAmount : null,
        //     couponActivityConfigs: []
        //   } : {
        //     fullCount: element.fullCount ? element.fullCount : null,
        //     couponActivityConfigs: []
        //   })
        // });
        couponActivityLevelVOS.forEach((elementa) => {
          let listfull = [];
          elementa.couponActivityConfigs.forEach((elementas) => {
            couponInfoList.forEach((element) => {
              if (elementas.couponId == element.couponId) {
                element.totalCount = elementas.totalCount;
                listfull.push(element);
              }
            });
          });
          leveList.push(
            elementa.fullAmount
              ? {
                  fullAmount: elementa.fullAmount ? elementa.fullAmount : null,
                  fullGiftDetailList: listfull,
                  modalVisible: false,
                  key: this.makeRandom()
                }
              : {
                  fullCount: elementa.fullCount ? elementa.fullCount : null,
                  fullGiftDetailList: listfull,
                  modalVisible: false,
                  key: this.makeRandom()
                }
          );
        });
        console.log(leveList, 'leveListleveListleveList');
      }

      let warePage = JSON.parse(localStorage.getItem('warePage')) || [];
      goodsInfoVOS.forEach((coupon) => {
        warePage.forEach((element) => {
          if (element.wareId == coupon.wareId) {
            coupon.wareName = element.wareName;
          } else if (coupon.wareId == 0 || coupon.wareId == -1) {
            coupon.wareName = '通用';
          }
        });
      });
      console.log(goodsInfoVOS, 'goodsInfoVOSgoodsInfoVOSgoodsInfoVOS');
      activity.fullGiftLevelList = leveList;
      // 2.格式化数据
      // 2.1.基础信息
      activity.goodsInfoVOS = goodsInfoVOS;
      activity.activityId = couponActivity.activityId;
      activity.isOverlap = couponActivity.isOverlap;
      activity.couponActivityFullType = couponActivity.couponActivityFullType;
      activity.activityName = couponActivity.activityName;
      activity.activityTitle = couponActivity.activityTitle;
      activity.activityDesc = couponActivity.activityDesc;
      activity.wareId = couponActivity.wareId + '';
      activity.startTime = couponActivity.startTime;
      activity.endTime = couponActivity.endTime;
      activity.couponActivityType = 9;
      activity.receiveType = 1;
      activity.receiveCount = couponActivity.receiveCount;
      activity.invalidCoupons = [];
      // 2.2.优惠券列表
      activity.coupons = couponActivityConfigList.map((item) => {
        let coupon = {} as any;
        const couponInfo = couponInfoList.find((info) => {
          if (info.couponId == item.couponId) {
            warePage.forEach((element) => {
              if (element.wareId == info.wareId) {
                coupon.wareName = element.wareName;
              } else if (info.wareId == 0 || info.wareId == -1) {
                coupon.wareName = '通用';
              }
            });
          }
          return info.couponId == item.couponId;
        });
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
      console.log(activity.coupons, 'activity.coupons ');

      // 3.设置状态
      this.dispatch('edit: init', fromJS(activity));
    }
  };
  /**
   * 生成随机数，作为key值
   * @returns {string}
   */
  makeRandom = () => {
    return 'key' + (Math.random() as any).toFixed(6) * 1000000;
  };

  /**
   * 新增/编辑优惠券活动
   */
  save = async (fullGiftLevelList) => {
    // 1.从state中获取数据
    let activity = this.state().get('activity').toJS();
    // 2.格式化数据
    let params = {} as any;
    params.goodsInfoIds = activity.skuIds;
    params.couponActivityFullType = activity.couponActivityFullType;
    params.activityName = activity.activityName;
    params.activityTitle = activity.activityTitle;
    params.activityDesc = activity.activityDesc;
    params.wareId = activity.wareId;
    params.startTime = activity.startTime;
    params.endTime = activity.endTime;
    params.couponActivityType = 9; // 店铺赠券
    params.receiveType = 1;
    params.receiveCount = activity.receiveCount;
    params.platformFlag = 1; // 店铺
    params.joinLevel = -1; // 全部客户
    params.isOverlap = activity.isOverlap; // 是否叠加优惠
    if (
      activity.couponActivityFullType == 2 ||
      activity.couponActivityFullType == 3
    ) {
      let leveList = [];
      // fullGiftLevelList.forEach(element => {
      //   leveList.push(element.fullAmount ? {
      //     fullAmount: element.fullAmount ? element.fullAmount : null,
      //     couponActivityConfigs: []
      //   } : {
      //     fullCount: element.fullCount ? element.fullCount : null,
      //     couponActivityConfigs: []
      //   })
      // });
      fullGiftLevelList.forEach((elementa) => {
        let listfull = [];
        elementa.fullGiftDetailList.forEach((elementas) => {
          listfull.push({
            couponId: elementas.couponId,
            totalCount: elementas.totalCount ? elementas.totalCount : 1
          });
        });
        leveList.push(
          elementa.fullAmount
            ? {
                fullAmount: elementa.fullAmount ? elementa.fullAmount : null,
                couponActivityConfigs: listfull
              }
            : {
                fullCount: elementa.fullCount ? elementa.fullCount : null,
                couponActivityConfigs: listfull
              }
        );
      });
      console.log(leveList, 'leveListleveListleveList');

      params.couponActivityLevelVOS = leveList;
    } else {
      params.couponActivityConfigs = activity.coupons.map((item) => {
        return {
          couponId: item.couponId,
          totalCount: item.totalCount
        };
      });
    }
    console.log(params, 'paramsparamsparamsparams');
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
}
