/**
 * Created by feitingting on 2017/6/20.
 */
import { Action, Actor, IMap } from 'plume2';

export default class JinbiActor extends Actor {
  defaultState() {
    return {
      activityName: '',
      startTime: '',
      endTime: '',
      isOverlap: '',
      coinNum: '',
      joinLevel: '',
      coinActivityFullType: '',
      customerLevels: [],
      coinActivityGoodsVoList: [],
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

  @Action('jinbiActor:init')
  init(state: IMap, data) {
    return state.merge(data);
  }

  @Action('jinbiActor:level')
  level(state: IMap, res) {
    return state.set('customerLevels', res);
  }
}
