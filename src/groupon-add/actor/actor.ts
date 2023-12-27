import { Actor, Action } from 'plume2';

export default class GrouponActor extends Actor {
  defaultState() {
    return {
      // 是否编辑状态
      isEdit: false,
      // 是否正在加载
      loading: true,

      // 拼团活动id
      grouponActivityId: null,
      // 拼团人数
      grouponNum: null,
      // 开始时间
      startTime: null,
      // 结束时间
      endTime: null,
      // 拼团分类id
      grouponCateId: null,
      // 是否自动成团
      autoGroupon: false,
      // 是否包邮
      freeDelivery: false,
      // spu商品名称
      goodsName: null,
      // 店铺名称
      storeName: null,
      // 拼团活动商品列表
      selectedSkus: [],

      // 弹出框可见性
      modalVisible: false,
      // 店铺分类列表
      cates: [],
      // 品牌列表
      brands: [],
      // 拼团分类列表
      grouponCates: [],
      // 拼团商品审核状态
      goodsAuditFlag: null
    };
  }

  /**
   * 初始化
   */
  @Action('groupon:init')
  init(state, { cates, brands, grouponCates, goodsAuditFlag }) {
    return state
      .set('cates', cates)
      .set('brands', brands)
      .set('grouponCates', grouponCates)
      .set('goodsAuditFlag', goodsAuditFlag);
  }

  /**
   * 编辑初始化
   */
  @Action('groupon:edit:init')
  editInit(state, params) {
    return state.merge(params).set('isEdit', true);
  }

  /**
   * 修改表单值
   */
  @Action('groupon:change:field')
  changeFormField(state, { key, value }) {
    return state.set(key, value);
  }

  /**
   * 修改选择的单品的字段
   */
  @Action('groupon:change:sku:info')
  changeSelectSkuInfo(state, { skuId, key, value }) {
    return state.update('selectedSkus', (skus) => {
      return skus.map((sku) => {
        if (sku.get('goodsInfoId') == skuId) {
          return sku.set(key, value);
        } else {
          return sku;
        }
      });
    });
  }

  /**
   * 删除一个sku
   */
  @Action('groupon:del:sku')
  deleteSelectedSku(state, skuId) {
    return state.update('selectedSkus', (skus) =>
      skus.filter((sku) => sku.get('goodsInfoId') != skuId)
    );
  }

  /**
   * 选择拼团商品
   * @param state
   * @param newGoodsList
   * @returns {any}
   */
  @Action('groupon:choose:sku')
  onChooseGoods(state, newGoodsList) {
    let chooseList = newGoodsList;
    // 已选的sku列表
    let oldGoodsList = state.get('selectedSkus');
    if (oldGoodsList.size > 0) {
      // 上次已选的sku id集合
      let oldGoodsIds = oldGoodsList.map((oldGoodsList) =>
        oldGoodsList.get('goodsInfoId')
      );

      // 此次选中的sku id集合
      let newGoodsIds =
        newGoodsList &&
        newGoodsList.map((newGoodsList) => newGoodsList.get('goodsInfoId'));

      // 从上一次已选中的列表中过滤出此次依然存在的sku
      let oldPartList = oldGoodsList.filter((oldGoodsList) =>
        newGoodsIds.contains(oldGoodsList.get('goodsInfoId'))
      );

      // 从此次选中的sku列表中过滤掉上次选中的
      let newPartList =
        newGoodsList &&
        newGoodsList.filter(
          (newGoodsList) =>
            !oldGoodsIds.contains(newGoodsList.get('goodsInfoId'))
        );

      // 两部分结合在一起
      chooseList =
        oldPartList && newPartList ? oldPartList.concat(newPartList) : [];
    }

    return state.set('selectedSkus', chooseList);
  }
}
