import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullDiscountActor from './actor/full-discount-actor';
import moment from 'moment';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FullDiscountActor()];
  }

  init = async (marketingId) => {
    const { res } = await commonWebapi.getMarketingInfo(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      const tiemasgsendtiem = commonWebapi.gettiem();
      const currentTiem = moment(tiemasgsendtiem, 'YYYY-MM-DD hh:mm').valueOf() / 1000;
      const avtiveendTime = moment(res.context.endTime, 'YYYY-MM-DD hh:mm').valueOf() / 1000;
      // console.log(currentTiem ,avtiveendTime,'tiemasgsendtiem');
      // 活动结束时间小于当前时间置空起止时间
      if (currentTiem > avtiveendTime) {
        res.context.beginTime = null;
        res.context.endTime = null;
      }
      // console.log(res.context,'数据',currentTiem > avtiveendTime);
      this.dispatch('marketing:discountBean', res.context);
    } else if (res.code == 'K-080016') {
      message.error(res.message);
      history.go(-1);
    } else {
      message.error(res.message);
    }
  };

  // 吧type存起来保存的时候调新增的接口
  setType = (type) => {
    this.dispatch('set:setType', type)
  }

  onDraftFullDiscount=async(discountBean,isType?)=>{
    let response;
    if (this.state().get('type') && this.state().get('type') == 1) {
      delete discountBean.marketingId
      discountBean.fullDiscountLevelList && discountBean.fullDiscountLevelList.forEach(element => {
        delete element.marketingId
        delete element.discountLevelId
      });
      let datas = {
        beginTime: discountBean.beginTime,
        bundleSalesSkuIds: discountBean.bundleSalesSkuIds,
        endTime: discountBean.endTime,
        fullDiscountLevelList: discountBean.fullDiscountLevelList,
        isOverlap: discountBean.isOverlap,
        joinLevel: discountBean.joinLevel,
        marketingName: discountBean.marketingName,
        marketingType: discountBean.marketingType,
        scopeType: discountBean.scopeType,
        skuIds: discountBean.skuIds,
        subType: discountBean.subType,
        isAddMarketingName:discountBean.isAddMarketingName||0,
        wareId: discountBean.wareId,
      }
      response =await webapi.addDraftFullDiscount(datas);
    } else if(discountBean.marketingId){
      response =await webapi.updateDraftFullDiscount(discountBean);
    }else{
      response =await webapi.addDraftFullDiscount(discountBean);
    }
    return response;
  };

  /**
   * 满折提交，编辑和新增由marketingId是否存在区分
   * @param discountBean
   * @returns {Promise<void>}
   */
  submitFullDiscount = async (discountBean,isType?) => {
    let response;
    if (this.state().get('type') && this.state().get('type') == 1) {
      delete discountBean.marketingId
      discountBean.fullDiscountLevelList && discountBean.fullDiscountLevelList.forEach(element => {
        delete element.marketingId
        delete element.discountLevelId
      });
      let datas = {
        beginTime: discountBean.beginTime,
        bundleSalesSkuIds: discountBean.bundleSalesSkuIds,
        endTime: discountBean.endTime,
        fullDiscountLevelList: discountBean.fullDiscountLevelList,
        isOverlap: discountBean.isOverlap,
        joinLevel: discountBean.joinLevel,
        marketingName: discountBean.marketingName,
        marketingType: discountBean.marketingType,
        scopeType: discountBean.scopeType,
        skuIds: discountBean.skuIds,
        subType: discountBean.subType,
        wareId: discountBean.wareId,
        isAddMarketingName:discountBean.isAddMarketingName||0,

        isDraft:0,
      }
      response =!isType? await webapi.addFullDiscount(datas):null;
    } else if (discountBean.marketingId) {
      response =!isType? await webapi.updateFullDiscount({...discountBean,isDraft:0}):null;
    } else {
      response =!isType? await webapi.addFullDiscount({...discountBean,isDraft:0}):null;
    }
    return response;
  };
}
