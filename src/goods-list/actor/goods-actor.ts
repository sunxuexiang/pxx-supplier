import { Actor, Action, IMap } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 商品分页数据
      goodsPages: {
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
      likeGoodsInfoNo1: '',
      modalVisible: false,
      modalVisible2: false,
      goodsSeqNum: null,
      goodsInfo: null, //选中的修改排序商品
      isBrandLinksort: null, //关联商品是否有排序
      // 批量导出弹框 modal状态
      exportModalData: {},
      modalText: '',
      // 商品列表加载
      listLoading: false
    };
  }

  @Action('goodsActor: init')
  init(state: IMap, data) {
    let exp = List();
    if (
      state.get('likeGoodsInfoNo1') != '' &&
      data
        .get('goodsPages')
        .get('content')
        .count() > 0
    ) {
      exp = data
        .get('goodsPages')
        .get('content')
        .map((value) => value.get('goodsId'));
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
    console.warn(expandedRowKeys.toJS(), '7777');

    return state.set('expandedRowKeys', expandedRowKeys);
  }
  /**
   * 数值变化
   * @param state
   * @param param1
   */
  @Action('goods: field: change')
  onFieldChange(state: IMap, { field, value }) {
    return state.set(field, value);
  }
  /**
   * 显示/关闭弹窗
   */
  @Action('goodsActor: switchShowModal')
  switchShow(state, flag: boolean) {
    return state.set('modalVisible', flag);
  }
  /**
   * 显示/关闭弹窗
   */
  @Action('goodsActor: switchShowModalText')
  switchShowModalText(state, text: string) {
    return state.set('modalText', text);
  }
  /**
   * 打开导出弹框 并设置 modal状态
   */
  @Action('info:exportModalShow')
  exportModalShow(state: IMap, exportModalData: IMap) {
    return state.set('exportModalData', exportModalData);
  }

  /**
   * 关闭导出弹框
   */
  @Action('info:exportModalHide')
  exportModalHide(state: IMap) {
    return state.setIn(['exportModalData', 'visible'], false);
  }
  /**
   * 商品列表加载
   */
  @Action('info:setListLoading')
  setListLoading(state: IMap, value) {
    return state.set('listLoading', value);
  }

  /**
   * 显示/关闭弹窗
   */
  @Action('goodsActor: switchShowModal2')
  switchShow2(state, flag: boolean) {
    return state.set('modalVisible2', flag);
  }
}
