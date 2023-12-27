import { Actor, Action, IMap } from 'plume2';
import { List, fromJS } from 'immutable';
import { QMFloat } from 'qmkit';

declare type IList = List<any>;

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 商品分页数据
      goodsInfoList: [],
      // 企业购商品总数
      totalCount: 0,
      // 当前的分页条数
      pageSize: 10,
      // 当前页
      pageNum: 0,
      // 商品SKU的规格值全部数据
      goodsInfoSpecDetails: [],
      // 品牌
      brandList: [],
      // 层级结构的店铺分类列表
      cateList: [],
      // 扁平的分类列表
      allCateList: [],

      /**编辑企业购商品*/
      // 编辑企业购商品佣金弹出框是否显示
      modalVisible: false,
      // 编辑企业购商品佣金skuID
      editGoodsInfoId: '',
      // 企业购商品审核状态 1:待审核 2:已审核通过 3:审核不通过
      enterPriseAuditState: '1',

      // 该条编辑sku数据的企业价
      enterPrisePrice: '0.00',

      /**添加企业购商品*/
      // 选中的商品skuId
      selectedSkuKeys: [],
      // 选择sku弹框显隐
      goodsModalVisible: false,
      // 选中的sku行
      selectedSkuRows: [],

      // 选中的商品编辑佣金弹窗
      choseGoodsModalVisible: false,

      // 商家企业购设置开关
      settingOpenFlag: 1,

      // 添加企业购商品时不符合条件的skuID
      invalidGoodsInfoIds: [],
      //企业购详情
      iepInfo: {}
    };
  }

  /**
   * 初始化企业购商品列表
   * @param {IMap} state
   * @param data
   * @returns {Map<string, any>}
   */
  @Action('init')
  init(state: IMap, { data, pageNum }) {
    return state
      .set('goodsInfoList', fromJS(data.goodsInfoPage.content))
      .set('totalCount', data.goodsInfoPage.total)
      .set('goodsInfoSpecDetails', fromJS(data.goodsInfoSpecDetails))
      .set('pageNum', pageNum)
      .set('selectedSkuKeys', List())
      .set('selectedSkuRows', List());
  }

  /**
   * 页面初始化加载品牌列表
   * @param state
   * @param {IList} brandList
   * @returns {any}
   */
  @Action('brandActor: init')
  initBrand(state, brandList: IList) {
    return state.set('brandList', brandList);
  }

  /**
   * 页面初始化加载分类列表
   * @param state
   * @param {IList} cateList
   * @returns {any}
   */
  @Action('cateActor: init')
  initCate(state, cateList: IList) {
    // 改变数据形态，变为层级结构(目前最多2层)
    const newDataList = cateList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = cateList.filter(
          (item) => item.get('cateParentId') == data.get('storeCateId')
        );
        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('cateList', newDataList).set('allCateList', cateList);
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
    if (flag) {
      return state.set('modalVisible', flag);
    } else {
      return state
        .set('modalVisible', flag)
        .set('editGoodsInfoId', '')
        .set('enterPrisePrice', '');
    }
  }

  /**
   * 多选选中的skuId
   * @param {IMap} state
   * @param {IList} selectedKeys
   * @returns {Map<string, any>}
   */
  @Action('goods: sku: checked')
  onSelectChange(state: IMap, selectedKeys: IList) {
    return state.set('selectedSkuKeys', selectedKeys);
  }

  /**
   * 设置选中sku的企业价
   * @param {IMap} state
   * @param {IList} selectedKeys
   * @returns {Map<string, any>}
   */
  @Action('goods: chose: edit: enterprisePrice')
  onEditChoseSkuCommission(state: IMap, { field, value }) {
    const skuRows = state.get('selectedSkuRows');
    //计算预估佣金
    let skuRowData = skuRows.map((sku) => {
      if (sku.get('goodsInfoId') == field) {
        sku = sku.set('enterPrisePrice', value);
      }
      return sku;
    });
    return state.set('selectedSkuRows', skuRowData);
  }

  /**
   * 删除选中的sku
   * @param {IMap} state
   * @param {IList} selectedKeys
   * @returns {Map<string, any>}
   */
  @Action('goods: chose: delete')
  onDelChoseSku(state: IMap, goodsInfoId) {
    let skuRows = state.get('selectedSkuRows');
    skuRows = skuRows.delete(
      skuRows.findIndex((row) => row.get('goodsInfoId') == goodsInfoId)
    );
    return state.set('selectedSkuRows', skuRows);
  }

  /**
   * enter键搜索时，参数错误调用此方法，默认查不到数据
   * @param {IMap} state
   * @returns {Map<string, any>}
   */
  @Action('wrong:search')
  setDataSourceEmpty(state: IMap) {
    return state
      .set('goodsInfoList', fromJS([]))
      .set('totalCount', 0)
      .set('goodsInfoSpecDetails', fromJS([]))
      .set('pageNum', 0)
      .set('selectedSkuKeys', List())
      .set('selectedSkuRows', List());
  }

  /**
   * 设置企业配置信息
   */
  @Action('iep: iepInfo')
  setIepInfo(state: IMap, iepInfo: IMap) {
    return state.set('iepInfo', iepInfo);
  }
}
