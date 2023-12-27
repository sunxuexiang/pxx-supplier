/**
 * Created by feitingting on 2017/6/20.
 */
import { Action, Actor, IMap } from 'plume2';

export default class MarketingActor extends Actor {
  defaultState() {
    return {
      marketingName: '',
      beginTime: '',
      endTime: '',
      marketingType: '',
      subType: '',
      isOverlap: '',
      joinLevel: '',
      isAddMarketingName:'',
      customerLevels: [],
      marketingScopeList: [],
      fullReductionLevelList: [],
      fullDiscountLevelList: [],
      goodsList: {
        // 商品分页数据
        goodsInfoPage: {
          content: []
        },
        goodses: {},
        brands: {},
        cates: {}
      }
    };
  }

  constructor() {
    super();
  }

  @Action('marketingActor:init')
  init(state: IMap, data) {
    return state.merge(data);
  }

  @Action('marketingActor:level')
  level(state: IMap, res) {
    return state.set('customerLevels', res);
  }
}
