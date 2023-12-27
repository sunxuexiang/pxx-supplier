import { Actor, Action } from 'plume2';
import { List, Map } from 'immutable';
import { IMap } from 'typings/globalType';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      dataList: [],
      // 弹框是否显示
      modalVisible: false,
      // 表单内容
      formData: {},
      childFlag: false,
      resourceFlag: false,
      editFlag: false //当前是否处于编辑状态,默认处于新增状态
    };
  }

  /**
   * 初始化
   */
  @Action('cateActor: init')
  init(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    const newDataList = dataList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = dataList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = dataList.filter(
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

    return state.set('dataList', newDataList);
  }

  /**
   * 修改表单内容
   */
  @Action('cateActor: editFormData')
  editCateInfo(state, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 变更当前是编辑状态还是新增状态
   */
  @Action('cateActor: updateEditFlag')
  updateEditFlag(state, editFlag: boolean) {
    return state.set('editFlag', editFlag);
  }

  /**
   * 显示弹窗
   */
  @Action('cateActor: showModal')
  show(state) {
    return state.set('modalVisible', true);
  }

  /**
   * 关闭弹窗
   */
  @Action('cateActor: closeModal')
  close(state) {
    return state.set('modalVisible', false).set('formData', Map());
  }

  /**
   * 关闭弹窗
   */
  @Action('cateActor: child')
  child(state, flag: boolean) {
    return state.set('childFlag', flag).set('formData', Map());
  }

  /**
   * 关闭弹窗
   */
  @Action('cateActor: resource')
  resource(state, flag: boolean) {
    return state.set('resourceFlag', flag).set('formData', Map());
  }
}
