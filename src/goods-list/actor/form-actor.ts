import { Actor, Action, IMap } from 'plume2';
import { util } from 'qmkit';

export default class FormActor extends Actor {
  defaultState() {
    return {
      // 已审核状态的商品列表
      auditStatus: 1,
      // 模糊条件-商品名称
      likeGoodsName: '',
      // 模糊条件-SKU编码
      likeGoodsInfoNo: '',
      // 模糊查询—erp的编码
      likeErpNo: '',
      // 模糊条件-SPU编码
      likeGoodsNo: '',
      // 商品店铺分类
      storeCateId: '-1',
      // 品牌编号
      brandId: '-1',
      // 上下架状态-也是tab页的下标
      addedFlag: '-1',
      // 销售类别 批发or零售
      saleType: '-1',
      // goodsSeqFlag: '',
      pageNum: 0,
      pageSize: util.isThirdStore() ? 100 : 10,
      //商品类型
      goodsType: '',
      // 仓库id
      wareId: null,
      // 是否排序
      storeGoodsSeqFlag: '',
      //价格区间
      specialPriceFirst: null,
      specialPriceLast: null,

      //搜索条件，为了更好的缓存
      searchForm: {},
      // 添加商品的状态
      isAddGoodsLoading: false
    };
  }

  @Action('form:field')
  formFieldChange(state: IMap, { key, value }) {
    return state.set(key, value);
  }

  @Action('form:addGoodsLoading')
  addGoodsLoading(state: IMap, isAddGoodsLoading: boolean) {
    return state.set('isAddGoodsLoading', isAddGoodsLoading);
  }
}
