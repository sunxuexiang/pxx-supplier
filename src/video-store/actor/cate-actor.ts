import { Actor, Action } from 'plume2';
import { List } from 'immutable';
import { IMap } from 'typings/globalType';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      // 扁平的分类列表信息
      cateAllList: [],
      // 父子结构的分类列表信息
      cateList: [],
      // 添加分类弹框是否显示
      visible: false,
      // 添加分类-分类表单内容
      formData: {},
      // tree是否展开
      expandedKeys: [],
      // 默认选中
      defaultCheckedKeys: []
    };
  }

  /**
   * 初始化
   */
  @Action('cateActor: init')
  init(state, cateList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = cateList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = cateList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = cateList.filter(
              (item) => item.get('cateParentId') == childrenData.get('cateId')
            );
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });

    return state.set('cateList', newDataList).set('cateAllList', cateList);
  }

  /**
   * 显示/关闭弹窗
   */
  @Action('cateActor: showCateModal')
  show(state, needClear: boolean) {
    return state.set('visible', needClear);
  }

  /**
   * 修改表单内容
   */
  @Action('cateActor: editFormData')
  editFormData(state, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 设置选中分类
   * @param state
   * @param cateId
   */
  @Action('cateActor: editCateId')
  editCateId(state, cateId) {
    return state.set('defaultCheckedKeys', cateId);
  }

  /**
   * 设置需要展开的分类
   */
  @Action('cateActor: editExpandedKeys')
  editExpandedKeys(state, cateIds) {
    return state.set('expandedKeys', cateIds);
  }
}
