import { Actor, Action } from 'plume2';
import { List } from 'immutable';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      // 扁平的分类列表信息
      cateAllList: [],
      // 父子结构的分类列表信息
      cateList: [],
      // tree是否展开
      expandedKeys: [],
      // 默认选中
      defaultCheckedKey: ''
    };
  }

  /**
   * 初始化
   */
  @Action('cateActor: init')
  init(state, cateList: IList) {
    return state.set('cateList', cateList);
  }

  /**
   * 设置扁平的分类列表信息
   * @param state
   * @param cateId
   */
  @Action('cateActor: cateAllList')
  cateAllList(state, cateAllList) {
    return state.set('cateAllList', cateAllList);
  }

  /**
   * 设置选中分类
   * @param state
   * @param cateId
   */
  @Action('cateActor: editCateId')
  editCateId(state, cateId) {
    return state.set('defaultCheckedKey', cateId);
  }

  /**
   * 设置需要展开的分类
   */
  @Action('cateActor: editExpandedKeys')
  editExpandedKeys(state, cateIds) {
    return state.set('expandedKeys', cateIds);
  }
}
