import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';
import { fromJS } from 'immutable';
import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullGiftActor from './actor/full-gift-actor';
import moment from 'moment';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FullGiftActor()];
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
      this.dispatch('marketing:giftBean', res.context);
      this.dispatch('marketing:giftLevelList',res.context.fullGiftLevelList)
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

   /**
   * 满赠草稿提交，编辑和新增由marketingId是否存在区分
   * isType 1草稿 0否
   * @param giftBean
   * @returns {Promise<void>}
   */
    onDraftFullGift=async(giftBean,isType?)=>{
      let response;
      if (this.state().get('type') && this.state().get('type') == 1) {
        delete giftBean.marketingId;
        giftBean.fullGiftLevelList.forEach(e => {
          delete e.marketingId;
          delete e.giftLevelId;
        });
        giftBean.fullGiftLevelList && giftBean.fullGiftLevelList[0].fullGiftDetailList.forEach(element => {
          delete element.marketingId;
          delete element.giftDetailId;
          delete element.giftLevelId;
          delete element.giftGoodsInfoVO;
        });
        let datas = {
          beginTime: giftBean.beginTime,
          bundleSalesSkuIds: giftBean.bundleSalesSkuIds,
          endTime: giftBean.endTime,
          fullGiftLevelList: giftBean.fullGiftLevelList,
          joinLevel: giftBean.joinLevel,
          marketingName: giftBean.marketingName,
          marketingType: giftBean.marketingType,
          scopeType: giftBean.scopeType,
          isOverlap: giftBean.isOverlap,
          skuIds: giftBean.skuIds,
          subType: giftBean.subType,
          wareId: giftBean.wareId,
          isAddMarketingName:giftBean.isAddMarketingName||0
        }
        response = await webapi.addDraftFullGift(datas);
      } else if(giftBean.marketingId){
        response =await webapi.updateDraftFullGift(giftBean);
      }else{
        response =await webapi.addDraftFullGift(giftBean);
      }
      return response;
    };

  /**
   * 满赠提交，编辑和新增由marketingId是否存在区分
   * @param giftBean
   * @returns {Promise<void>}
   */
  submitFullGift = async (giftBean) => {
    let response;
    if (this.state().get('type') && this.state().get('type') == 1) {
      delete giftBean.marketingId;
      giftBean.fullGiftLevelList.forEach(e => {
        delete e.marketingId;
        delete e.giftLevelId;
      });
      giftBean.fullGiftLevelList && giftBean.fullGiftLevelList[0].fullGiftDetailList.forEach(element => {
        delete element.marketingId;
        delete element.giftDetailId;
        delete element.giftLevelId;
        delete element.giftGoodsInfoVO;
      });
      let datas = {
        beginTime: giftBean.beginTime,
        bundleSalesSkuIds: giftBean.bundleSalesSkuIds,
        endTime: giftBean.endTime,
        fullGiftLevelList: giftBean.fullGiftLevelList,
        joinLevel: giftBean.joinLevel,
        marketingName: giftBean.marketingName,
        marketingType: giftBean.marketingType,
        scopeType: giftBean.scopeType,
        isOverlap: giftBean.isOverlap,
        skuIds: giftBean.skuIds,
        subType: giftBean.subType,
        wareId: giftBean.wareId,
        isAddMarketingName:giftBean.isAddMarketingName||0,
        isDraft:0
      }
      response = await webapi.addFullGift(datas);
    } else if (giftBean.marketingId) {
      response = await webapi.updateFullGift({...giftBean,isDraft:0});
    } else {
      response = await webapi.addFullGift({...giftBean,isDraft:0});
    }
    return response;
  };
}
