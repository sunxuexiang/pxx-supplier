import { IOptions, Store } from 'plume2';
import { message } from 'antd';

import { Const, history } from 'qmkit';

import * as webapi from './webapi';
import * as commonWebapi from './../webapi';
import FullDiscountActor from './actor/full-discount-actor';

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
    if (res.code == 'K-000000') {
      console.log('123', res.context);
      this.dispatch('marketing:discountBean', res.context);
    } else if (res.code == 'K-080016') {
      message.error(res.message);
      history.go(-1);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 满折提交，编辑和新增由marketingId是否存在区分
   * @param discountBean
   * @returns {Promise<void>}
   */
  submitFullDiscount = async (discountBean) => {
    console.log(discountBean, 'discountBeandiscountBean');
    let response;
    if (discountBean.marketingId) {
      response = await webapi.updateFullDiscount(discountBean);
    } else {
      response = await webapi.addFullDiscount(discountBean);
    }
    return response;
  };
}
