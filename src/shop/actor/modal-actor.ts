import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

import { IList } from 'typings/globalType';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      //品牌弹框是否显示
      brandVisible: false,
      //类目弹框是否显示
      sortsVisible: false,
      //批发市场/商城分类是否显示
      checkboxVisible: false,
      //弹框类型
      modalType: 0,
      // 弹框中签约分类集合
      cates: [],
      // 已签约分类数量
      cateSize: 0,
      // 平台全部分类
      allCates: [],
      // 被删除的分类Id集合(已签约的)
      delCateIds: [],
      // 签约分类弹框确定延迟
      sortModalLoading: false,
      //已选中的批发市场/商城分类
      checkBoxDefaultVal: [],
      checkBoxLoading: false
    };
  }

  /**
   * 品牌弹框
   */
  @Action('modalActor: brandModal')
  clickBrand(state) {
    return state.set('brandVisible', !state.get('brandVisible'));
  }

  /**
   * 显示类目弹框
   */
  @Action('modalActor: sortModal')
  clickSorts(state) {
    return state.set('sortsVisible', !state.get('sortsVisible'));
  }

  /**
   * 批发市场/商城分类弹框
   */
  @Action('modalActor: checkboxModal')
  clickCheckbox(state) {
    return state.set('checkboxVisible', !state.get('checkboxVisible'));
  }

  /**
   * 批发市场/商城分类弹框类型
   */
  @Action('modalActor: modalType')
  modalType(state, modalType: boolean) {
    return state.set('modalType', modalType);
  }

  /**
   * 签约分类
   * @param state
   * @param cates
   */
  @Action('modal: cates')
  modalCates(state: IMap, cates: IList) {
    return state.set('cates', cates).set('cateSize', cates.count());
  }

  /**
   * 平台全部分类
   * @param state
   * @param cates
   */
  @Action('modal: AllCates')
  allCates(state: IMap, cates: IList) {
    return state.set('allCates', cates);
  }

  /**
   * 删除分类
   * @param state
   * @param cateIds
   */
  @Action('modal: cate: delete')
  delCate(state: IMap, cateIds: IList) {
    return state.set('delCateIds', cateIds);
  }

  /**
   * 分类弹框确定等待
   * @param state
   */
  @Action('modal: cate: loading')
  loadingModal(state: IMap) {
    return state.set('sortModalLoading', true);
  }

  /**
   * 分类弹框确定等待结束
   * @param state
   */
  @Action('modal: cate: loading: over')
  loadingModalOver(state: IMap) {
    return state.set('sortModalLoading', false);
  }

  /**
   * 已选中的批发市场/商城分类
   * @param state
   * @param brandList
   */
  @Action('modal: updateDefaultVal')
  updateDefaultVal(state: IMap, defaultVal: IList) {
    return state.set('checkBoxDefaultVal', fromJS(defaultVal));
  }

  @Action('modal: checkBoxLoading')
  checkBoxLoading(state: IMap, flag: boolean) {
    return state.set('checkBoxLoading', flag);
  }
}
