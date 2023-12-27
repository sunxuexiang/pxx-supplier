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

  setStoreId = async () => {
    let storeId = localStorage.getItem('supplierStoreId');
    if (!storeId) {
      const result = await webapi.getStore();
      if (result.code == Const.SUCCESS_CODE) {
        storeId = result.context.storeId;
        localStorage.setItem('supplierStoreId', storeId);
      }
    }
  };

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const query = this.state()
      .get('form')
      .toJS();
    const { res } = await webapi.couponList({
      pageNum,
      pageSize
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
    }
    let couponList = null;
    if (res.context.advertisingPage) {
      couponList = res.context.advertisingPage.content;
      this.dispatch('init', {
        couponList: fromJS(couponList),
        total: res.context.advertisingPage.total,
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
   * 删除推荐位
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
}
