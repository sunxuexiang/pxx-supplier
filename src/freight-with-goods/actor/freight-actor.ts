import { Actor, Action, IMap } from 'plume2';
import { IList } from 'typings/globalType';
import { List } from 'immutable';

export default class FreightActor extends Actor {
  defaultState() {
    return {
      feightVisible: false,
      selectedRowKeys: [],
      freightWithGoods: {},
      freightTemp: {},
      freightList: [],
      freightTempId: '',
      goodsId: '',
      selectTemp: {},
      selectTempExpress: {},
      isBatch: null,
      pageType: 0
    };
  }

  @Action('freight:setPageType')
  setPageType(state: IMap, res: number) {
    return state.set('pageType', res);
  }

  @Action('freight:feightVisible')
  setFeightVisible(state: IMap, feightVisible: boolean) {
    return state.set('feightVisible', feightVisible);
  }

  @Action('freight:freightWithGoods')
  setFreightWithGoods(state: IMap, freightWithGoods: IMap) {
    return state.set('freightWithGoods', freightWithGoods);
  }

  @Action('freight:selectedRowKeys')
  setSelectedRowKeys(state: IMap, selectedRowKeys: IList) {
    return state.set('selectedRowKeys', selectedRowKeys);
  }

  @Action('freight:clearSelectedSpuKeys')
  clearSelectedSpuKeys(state: IMap) {
    return state.set('selectedRowKeys', List());
  }

  @Action('freight:freightTemp')
  setFreightTemp(state: IMap, freightTemp: IMap) {
    return state.set('freightTemp', freightTemp);
  }

  @Action('freight:freightList')
  setFreightList(state: IMap, freightList: IList) {
    return state.set('freightList', freightList);
  }

  @Action('freight:freightTempId')
  setFreightTempId(state: IMap, freightTempId: number) {
    return state.set('freightTempId', freightTempId);
  }

  @Action('freight:goodsId')
  setGoodsId(state: IMap, goodsId: string) {
    return state.set('goodsId', goodsId);
  }

  @Action('freight:selectTemp')
  setSelectTemp(state: IMap, selectTemp: IMap) {
    return state.set('selectTemp', selectTemp);
  }

  @Action('freight:selectTempExpress')
  setSelectTempExpress(state: IMap, selectTempExpress: IMap) {
    return state.set('selectTempExpress', selectTempExpress);
  }

  @Action('freight:isBatch')
  setIsBatch(state: IMap, isBatch: boolean) {
    return state.set('isBatch', isBatch);
  }
}
