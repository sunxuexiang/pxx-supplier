import { IOptions, Store } from 'plume2';
import GoodsMatterActor from './actor/goods-matter-actor';
import * as webApi from './webapi';
import { Const } from 'qmkit';
import { message } from 'antd';
import { fromJS } from 'immutable';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new GoodsMatterActor()];
  }

  //初始化页面
  init = async ({ pageNum, pageSize, headInfo }) => {
    const query = this.state()
      .get('form')
      .toJS();
    if (headInfo && headInfo != '' && headInfo.goodsInfoId) {
      this.dispatch('init: head', fromJS(headInfo));
      query.goodsInfoId = headInfo.goodsInfoId;
    }
    if (query.recommendNumMin != null && query.recommendNumMax != null) {
      if (query.recommendNumMin > query.recommendNumMax) {
        query.recommendNumMin = query.recommendNumMin + query.recommendNumMax;
        query.recommendNumMax = query.recommendNumMin - query.recommendNumMax;
        query.recommendNumMin = query.recommendNumMin - query.recommendNumMax;
      }
    }
    const { res } = await webApi.fetchGoodsMatterPage({
      ...query,
      pageNum,
      pageSize
    });
    if (res.code != Const.SUCCESS_CODE) {
      message.error(res.message);
      return;
    }
    const goodsMatterList = res.context.distributionGoodsMatterPage.content;
    this.dispatch('init', {
      goodsMatterList: fromJS(goodsMatterList),
      total: res.context.distributionGoodsMatterPage.totalElements,
      pageNum: pageNum + 1
    });
    this.onFormFieldChange({
      key: 'recommendNumMin',
      value: query.recommendNumMin
    });
    this.onFormFieldChange({
      key: 'recommendNumMax',
      value: query.recommendNumMax
    });
  };

  dataSearch = (sort) => {
    this.dispatch('sort: set', sort);
    this.init({ pageNum: 0, pageSize: 10, headInfo: null });
  };

  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form: field', { key, value });
  };

  /**
   * 查看大图
   */
  clickImg = (url) => {
    this.dispatch('show: image', url);
  };
}
