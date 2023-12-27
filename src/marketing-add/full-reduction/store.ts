import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullReductionActor from './actor/full-reduction-actor';
import moment from 'moment';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new FullReductionActor()];
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
      this.dispatch('marketing:reductionBean', res.context);
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
   * 满减草稿提交，编辑和新增由marketingId是否存在区分
   * isType 1草稿 0否
   * @param reductionBean
   * @returns {Promise<void>}
   */
  onDraftFullReduction=async(reductionBean,isType?)=>{
    let response;
    if (this.state().get('type') && this.state().get('type') == 1) {
      
      reductionBean.fullReductionLevelList && reductionBean.fullReductionLevelList.forEach(element => {
        delete element.marketingId;
        delete element.reductionLevelId;
      });
      let datas = {
        beginTime: reductionBean.beginTime,
        bundleSalesSkuIds: reductionBean.bundleSalesSkuIds,
        endTime: reductionBean.endTime,
        fullReductionLevelList: reductionBean.fullReductionLevelList,
        joinLevel: reductionBean.joinLevel,
        marketingName: reductionBean.marketingName,
        marketingType:reductionBean.marketingType,
        isOverlap: reductionBean.isOverlap,
        scopeType: reductionBean.scopeType,
        skuIds: reductionBean.skuIds,
        subType: reductionBean.subType,
        wareId: reductionBean.wareId,
        isAddMarketingName:reductionBean.isAddMarketingName||0,
      }
      // return
      response = await webapi.addDrafFullReduction(datas);
    } else if(reductionBean.marketingId){
      response =await webapi.updateDrafFullReduction(reductionBean);
    }else{
      response =await webapi.addDrafFullReduction(reductionBean);
    }
    return response;
  };
  /**
   * 满减提交，编辑和新增由marketingId是否存在区分
   * isType 1草稿 0否
   * @param reductionBean
   * @returns {Promise<void>}
   */
  submitFullReduction = async (reductionBean,isType?) => {
    let response;
    if (this.state().get('type') && this.state().get('type') == 1) {
      console.log(reductionBean,'reductionBean')
      reductionBean.fullReductionLevelList && reductionBean.fullReductionLevelList.forEach(element => {
        delete element.marketingId;
        delete element.reductionLevelId;
      });
      let datas = {
        beginTime: reductionBean.beginTime,
        bundleSalesSkuIds: reductionBean.bundleSalesSkuIds,
        endTime: reductionBean.endTime,
        fullReductionLevelList: reductionBean.fullReductionLevelList,
        joinLevel: reductionBean.joinLevel,
        marketingName: reductionBean.marketingName,
        marketingType:reductionBean.marketingType,
        isOverlap: reductionBean.isOverlap,
        scopeType: reductionBean.scopeType,
        skuIds: reductionBean.skuIds,
        subType: reductionBean.subType,
        wareId: reductionBean.wareId,
        isAddMarketingName:reductionBean.isAddMarketingName||0,//null情况默认为0
        isDraft:0
      }
      response =!isType? await webapi.addFullReduction(datas):'';
    } else if (reductionBean.marketingId) {
      response =!isType? await webapi.updateFullReduction({...reductionBean,isDraft:0}):'';
    } else {
      response =!isType? await webapi.addFullReduction({...reductionBean,isDraft:0}):'';
    }
    return response;
  };
}
