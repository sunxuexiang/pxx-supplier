import { Actor, Action, IMap } from 'plume2';

export default class FreightActor extends Actor {
  defaultState() {
    return {
      tab: 0, // tab页 0: 店铺   1: 单品
      fMode: '', // 运费计算模式 0:店铺运费 1:单品运费
      storeFreight: {
        // 总数
        totalElements: 0,
        // 每页展示数量
        size: 2,
        // 当前页
        number: 0,
        // 店铺运费模板
        content: []
      },
      goodsFreights: [], // 单品运费模板
      pageType: 0 //0: 运费模版，1：同城配送运费模板
    };
  }

  @Action('info:setPageType')
  setPageType(state: IMap, res: number) {
    return state.set('pageType', res);
  }

  /**
   * 键值存储
   * @param state
   * @param param1
   */
  @Action('freight: field: save')
  fieldSave(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  /**
   * 单品运费模板初始化
   * @param state
   * @param param1
   */
  @Action('freight: goods: init')
  goodsInit(state: IMap, goodsFreights) {
    return state.set('goodsFreights', goodsFreights);
  }

  /**
   * 店铺运费模板初始化
   * @param state
   * @param param1
   */
  @Action('freight: store: init')
  init(state: IMap, storeFreight) {
    return state
      .setIn(
        ['storeFreight', 'totalElements'],
        storeFreight.get('totalElements')
      )
      .setIn(['storeFreight', 'size'], storeFreight.get('size'))
      .setIn(['storeFreight', 'number'], storeFreight.get('number') + 1)
      .setIn(['storeFreight', 'content'], storeFreight.get('content'));
  }
}
