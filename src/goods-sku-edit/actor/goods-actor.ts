import { Actor, Action } from 'plume2';
import { IMap } from 'typings/globalType';

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 商品信息
      goods: {
        // 上下架状态
        addedFlag: 1
      },
      // 商品的审核状态/禁用状态
      spu: { goodsId: '' },
      //保存状态loading
      saveLoading: false,
      // 当前处于基础信息tab还是价格tab：main | price
      activeTabKey: 'main',
      singleOrderAssignAreaList: {},
      choseProductSkuId: [],
    };
  }

  @Action('goodsActor: choseProductSkuId')
  choseProductSkuId(state, choseProductSkuId) {
    return state.set('choseProductSkuId', choseProductSkuId);
  }

  /**
   * 修改商品信息
   * @param state
   * @param data
   */
  @Action('goodsActor: editGoods')
  editGoods(state, data: IMap) {
    console.log(data.toJS(),'datadatadata');
    
    return state.update('goods', (goods) => goods.merge(data));
  }

    /**
   * 修改商品信息
   * @param state
   * @param data
   */
     @Action('goodsActor: editGoodsrAssignArea')
     editGoodsrAssignArea(state, data: IMap) {
       return state.update('singleOrderAssignAreaList', (goods) => goods.merge(data));
     }

  /**
   * spu信息
   * @param state
   * @param data
   */
  @Action('goodsActor: spu')
  spu(state, data: IMap) {
    return state.update('spu', (spu) => spu.merge(data));
  }

  /**
   * 修改商品信息
   * @param state
   * @param saveLoading
   */
  @Action('goodsActor: saveLoading')
  saveLoading(state, saveLoading: boolean) {
    return state.set('saveLoading', saveLoading);
  }

  @Action('goodsActor: tabChange')
  tabChange(state, activeKey) {
    return state.set('activeTabKey', activeKey);
  }
}
