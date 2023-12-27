import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 商品分页数据
      goodsPage: {
        content: []
      },
      // 商品SKU全部数据
      goodsInfoList: [],
      // 商品SKU的规格值全部数据
      goodsInfoSpecDetails: [],
      // 分类列表
      goodsCateList: [],
      // 品牌列表
      goodsBrandList: [],
      // 选中的商品
      selectedSpuKeys: [],
      // 展开显示的spuIdList
      expandedRowKeys: [],
      // 模糊条件-SKU编码(搜索出来直接展开显示这个sku对应的spu)
      likeGoodsInfoNo1: ''
    };
  }

  @Action('goodsActor: init')
  init(state: IMap, data) {
    let exp = List();
    if (
      state.get('likeGoodsInfoNo1') != '' &&
      data
        .get('goodsPage')
        .get('content')
        .count() > 0
    ) {
      exp = data
        .get('goodsPage')
        .get('content')
        .map(value => value.get('goodsId'));
    }
    return state.merge(data).set('expandedRowKeys', exp);
  }

  @Action('goodsActor: onSelectChange')
  onSelectChange(state: IMap, selectedKeys: IList) {
    return state.set('selectedSpuKeys', selectedKeys);
  }

  @Action('goodsActor:clearSelectedSpuKeys')
  clearSelectedSpuKeys(state: IMap) {
    return state.set('selectedSpuKeys', List());
  }

  @Action('goodsActor:editLikeGoodsInfoNo1')
  editLikeGoodsInfoNo1(state: IMap, value) {
    return state.set('likeGoodsInfoNo1', value);
  }

  @Action('goodsActor:editExpandedRowKeys')
  editExpandedRowKeys(state: IMap, expandedRowKeys: IList) {
    return state.set('expandedRowKeys', expandedRowKeys);
  }
}
