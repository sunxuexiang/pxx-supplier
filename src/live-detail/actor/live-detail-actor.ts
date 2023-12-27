import { Actor, Action } from 'plume2';

interface IPageResponse {
  content: Array<any>;
  size: number;
  totalElements: number;
}

export default class InfoActor extends Actor {
  defaultState() {
    return {
      detail: {},
      liveGoodsList: [],
      goodsInfoList: [],
      storeName: '-'
    };
  }

  /**
   * 初始化详情页
   */
  @Action('init:detail')
  init(state, params) {
    return state.set('detail', params);
  }
  //商品列表
  @Action('init:liveGoodsList')
  setliveGoodsList(state, params) {
    return state.set('liveGoodsList', params);
  }

  @Action('info:setGoodsInfoList')
  setGoodsInfoList(state, value) {
    return state.set('goodsInfoList', value);
  }

  @Action('info:setStoreName')
  setStoreName(state, value) {
    return state.set('storeName', value);
  }
}
