import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'plume2/es5/typings';

export default class FlashSaleGoodsActor extends Actor {
  defaultState() {
    return {
      // 选择的商品ids
      chooseSkuIds: [],
      // 选择的具体商品信息
      goodsRows: [],
      // 分类列表
      cateList: [],
      // 活动日期
      activityDate: '',
      // 活动时间
      activityTime: ''
    };
  }

  /**
   * 初始化所有分类列表
   * @param state
   * @param res
   * @returns {Map<string, V>}
   */
  @Action('new:cate:init')
  init(state: IMap, res) {
    return state.set('cateList', res);
  }

  /**
   * 键值设置
   * @param state
   * @param param1
   */
  @Action('goods: info: field: value')
  fieldsValue(state, { field, value }) {
    state = state.set(field, fromJS(value));
    return state;
  }

  @Action('modalActor: change:goods')
  changePointsGoods(state: IMap, { goodsInfoId, field, value }) {
    return state.update('goodsRows', (rows) =>
      rows.map((goodsInfo) => {
        if (goodsInfo.get('goodsInfoId') == goodsInfoId) {
          return goodsInfo.set(field, value);
        }
        return goodsInfo;
      })
    );
  }

  @Action('delete: selected: sku')
  deleteSelectSku(state, skuId) {
    let goodsRows = state.get('goodsRows');
    let chooseSkuIds = state.get('chooseSkuIds');
    chooseSkuIds = chooseSkuIds.splice(
      chooseSkuIds.findIndex((item) => item == skuId),
      1
    );
    goodsRows = goodsRows.delete(
      goodsRows.findIndex((row) => row.get('goodsInfoId') == skuId)
    );
    return state.set('goodsRows', goodsRows).set('chooseSkuIds', chooseSkuIds);
  }

  /**
   * 设置活动日期
   */
  @Action('info: setActivityDate')
  setActivityDate(state: IMap, activityDate) {
    return state.set('activityDate', activityDate);
  }

  /**
   * 设置活动时间
   */
  @Action('info: setActivityTime')
  setActivityTime(state: IMap, activityTime) {
    return state.set('activityTime', activityTime);
  }
}
