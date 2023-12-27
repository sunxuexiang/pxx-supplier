import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './webapi';
import StockActivityActor from './actor/stock-activity-actor';
import moment from 'moment';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new StockActivityActor()];
  }

  init = async (marketingId) => {
    const { res } = await commonWebapi.pileActivityDis(marketingId);
    if (res.code == Const.SUCCESS_CODE) {
      const tiemasgsendtiem = commonWebapi.gettiem();
      const currentTiem = moment(tiemasgsendtiem, 'YYYY-MM-DD hh:mm').valueOf() / 1000;
      const avtiveendTime = moment(res.context.pileActivity.endTime, 'YYYY-MM-DD hh:mm').valueOf() / 1000;
      // 活动结束时间小于当前时间置空起止时间
      if (currentTiem > avtiveendTime) {
        res.context.pileActivity.startTime = null;
        res.context.pileActivity.endTime = null;
      }else{
        if((moment(res.context.pileActivity.startTime, 'YYYY-MM-DD hh:mm').valueOf())<=moment(new Date()).valueOf()){
          res.context.pileActivity.state=1;//进行中
        }else{
          res.context.pileActivity.state=0;//其他状态
        }
      }
      console.log(res.context.pileActivity.startTime)
      // console.log(res.context,'数据',currentTiem > avtiveendTime);
      this.dispatch('marketing:reductionBean', res.context.pileActivity);
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
   * 满减提交，编辑和新增由marketingId是否存在区分
   * 
   * @param reductionBean
   * @returns {Promise<void>}
   */
   submit = async (marketingBean) => {
    let response;
    if (this.state().get('type') && this.state().get('type') == 1) {//复制
      marketingBean.fullReductionLevelList && marketingBean.fullReductionLevelList.forEach(element => {
        delete element.marketingId;
        delete element.reductionLevelId;
      });
      let datas = {
        beginTime: marketingBean.beginTime,
        bundleSalesSkuIds: marketingBean.bundleSalesSkuIds,
        endTime: marketingBean.endTime,
        fullReductionLevelList: marketingBean.fullReductionLevelList,
        joinLevel: marketingBean.joinLevel,
        marketingName: marketingBean.marketingName,
        marketingType:marketingBean.marketingType,
        isOverlap: marketingBean.isOverlap,
        scopeType: marketingBean.scopeType,
        skuIds: marketingBean.skuIds,
        subType: marketingBean.subType,
        wareId: marketingBean.wareId
      }
      // return
      response =await webapi.pileActivityAdd(datas);
    } else if (marketingBean.activityId) {
      response =await webapi.pileActivityModify(marketingBean);
    } else {
      response =await webapi.pileActivityAdd(marketingBean);
    }
    return response;
  };
}
