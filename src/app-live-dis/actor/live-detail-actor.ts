import { Actor, Action } from 'plume2';
import { IMap } from 'typings/globalType';

export default class InfoActor extends Actor {
  defaultState() {
    return {
      detail: {},
      //商品列表
      liveGoodsList: [],
      //优惠券列表
      liveVouchersList: [],
      liveVouchersInfoList: [],
      isModalVisible: false,
      goodsInfoList: [],
      liveBagList: [],
      currentLiveListTab: '1',
      // 搜索项信息
      searchBagData: {
        bagName: '',
        bagStatus: ''
      }
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

  //福袋列表
  @Action('init:liveBagList')
  setliveBagList(state, params) {
    return state.set('liveBagList', params);
  }

  @Action('info:setGoodsInfoList')
  setGoodsInfoList(state, value) {
    return state.set('goodsInfoList', value);
  }

  @Action('info:setLiveTab')
  setLiveTab(state, value) {
    return state.set('currentLiveListTab', value);
  }

  @Action('info:actor:form')
  setLiveActor(state, { key, value }) {
    console.log(value, 'value');
    return state.set(key, value);
  }
  /**
   * 修改搜索项信息
   */
  @Action('info:setSearchData')
  setSearchData(state: IMap, searchData) {
    return state.set('searchBagData', searchData);
  }
  @Action('form: field')
  formFiledChange(state, { key, value }) {
    return state.setIn(['searchBagData', key], value);
  }
}
