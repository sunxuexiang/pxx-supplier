import { Actor, Action } from 'plume2';
import { IList } from 'typings/globalType';
import { fromJS } from 'immutable';

export default class GoodsSpecActor extends Actor {
  defaultState() {
    return {
      // 规格列表
      goodsSpecs: [
        {
          specId: this._getRandom(),
          specName: '',
          specValues: []
        }
      ],
      goodsList: [{ id: this._getRandom(), index: 1 }],
      selectList: [{ id: this._getRandom(), index: 1, qrCodeImages: '2' }]
    };
  }

  /**
   *  初始化规格及商品
   */
  @Action('goodsSpecActor: init')
  init(
    state,
    { goodsSpecs, goodsList }: { goodsSpecs: IList; goodsList: IList }
  ) {
    if (!goodsSpecs.isEmpty()) {
      state = state.set('goodsSpecs', goodsSpecs);
    }
    return state.set('goodsList', goodsList);
  }

  @Action('goodsSpecActor: gPack')
  gPack(state, { id, key, value }: { id: string; key: string; value: any }) {
    console.log(id);
    console.info('gPack' + value);
    //  ;
    //  state = state.update('selectList', fromJS([{id,value}]));
    //  let selectList = state.get('selectList');
    console.log(state.toJS(), '111111111111');
    return state.update('selectList', (selectList) => {
      return selectList.update(0, (item) => item.set('qrCodeImages', '1'));
    });
  }

  /**
   * 修改商品包装类型
   */
  @Action('goodsSpecActor: editGoodsItem')
  editGoodsItem(
    state,
    { id, key, value }: { id: string; key: string; value: any }
  ) {
    return state.update('goodsList', (goodsList) => {
      const index = goodsList.findIndex((item) => item.get('id') == id);
      return goodsList.update(index, (item) => item.set(key, value));
    });
    // let goodsList = state.get('goodsList');
    // const index = goodsList.findIndex((item) => item.get('id') == id);
    // goodsList = goodsList.update(index, (item) =>
    //   item.set(key, value)
    // );
    // console.log(goodsList.toJS(),'111111111111')
    // return state.update('goodsList', goodsList);

    //return state.set("selectList",{id,value});
  }
  /**
   * 修改商品属性
   */
  @Action('goodsSpecActor: editGoodsStock')
  editGoodsStock(
    state,
    {
      id,
      key,
      value,
      storeWareId
    }: { id: string; key: string; value: string; storeWareId: number }
  ) {
    return state.update('goodsList', (goodsList) => {
      const index = goodsList.findIndex((item) => item.get('id') == id);
      return goodsList.update(index, (item) => {
        return item.setIn(
          [
            'goodsWareStocks',
            item
              .get('goodsWareStocks')
              .findIndex((item) => storeWareId == item.get('id')),
            'stock'
          ],
          value
        );
      });
    });
  }
  /**
   *  获取整数随机数
   */
  _getRandom = () => {
    return parseInt(Math.random().toString().substring(2, 18));
  };

  /**
   * 移除sku图片
   * @param state
   * @param skuId
   */
  @Action('goodsSpecActor: removeImg')
  removeImg(state, skuId: string) {
    return state.update('goodsList', (goodsList) => {
      const index = goodsList.findIndex((item) => item.get('id') == skuId);
      return goodsList.update(index, (item) => item.set('images', fromJS([])));
    });
  }

  /**
   * 移除sku二维码
   * @param state
   * @param skuId
   */
  @Action('goodsQrSpecActor: removeQrImg')
  removeQrImg(state, skuId: string) {
    return state.update('goodsList', (goodsList) => {
      const index = goodsList.findIndex((item) => item.get('id') == skuId);
      return goodsList.update(index, (item) =>
        item.set('qrCodeImages', fromJS([]))
      );
    });
  }
}
