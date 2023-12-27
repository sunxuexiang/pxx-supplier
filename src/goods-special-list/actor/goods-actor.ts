import { Actor, Action, IMap } from 'plume2';
import { List, fromJS } from 'immutable';

declare type IList = List<any>;

export default class GoodsActor extends Actor {
  defaultState() {
    return {
      // 商品分页数据
      goodsInfoList: [],
      // 选中的商品
      selectedSkuKeys: [],
      // 分销商品总数
      totalCount: 0,
      // 当前的分页条数
      pageSize: 10,
      // 当前页
      pageNum: 0,
      // 商家信息
      companyInfoList: [],
      // 商品SKU的规格值全部数据
      goodsInfoSpecDetails: [],
      // 分类列表
      goodsCateList: [],
      // 品牌列表
      goodsBrandList: [],
      // 品牌
      brandList: [],
      // 商品分类
      cateList: [],

      // 驳回 或 禁止分销理由弹出框是否显示
      modalVisible: false,
      // 驳回 或 禁止分销商品标识
      forbidGoodsInfoId: '',
      // 驳回 或 禁止分销原因
      forbidReason: '',
      // 驳回 或 禁止分销 0 驳回 1 禁止分销
      refuseFlag: 0,
      // 批量导出弹框 modal状态
      exportModalData: {}
    };
  }

  /**
   * 初始化分销商品列表
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
      .set('companyInfoList', fromJS(data.companyInfoList))
      .set('goodsCateList', fromJS(data.cates))
      .set('goodsBrandList', fromJS(data.brands))
      .set('pageNum', pageNum)
      .set('selectedSkuKeys', List());
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
    return state.set('cateList', cateList);
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
        .set('goodsDiscount', '')
        .set('goodsInfoId', '')
        .set('marketPrice', '');
    }
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
}
