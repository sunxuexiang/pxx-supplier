import { Actor, Action } from 'plume2';
import { List, Map } from 'immutable';
import { IMap } from 'typings/globalType';

declare type IList = List<any>;

export default class TabActor extends Actor {
  defaultState() {
    return {
      dataList: [],
      // 弹框是否显示
      modalVisible: false,
      // 表单内容
      formData: {}
    };
  }

  /**
   * 初始化
   */
  @Action('tabActor: init')
  init(state, dataList: IList) {
    // 改变数据形态，变为层级结构
    return state.set('dataList', dataList);
  }

  /**
   * 修改表单内容
   */
  @Action('tabActor: editFormData')
  editCateInfo(state, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('tabActor: showModal')
  show(state, needClear: boolean) {
    if (needClear) {
      state = state.set('formData', Map());
    }
    return state.set('modalVisible', true);
  }

  /**
   * 关闭弹窗
   */
  @Action('tabActor: closeModal')
  close(state) {
    return state.set('modalVisible', false).set('formData', Map());
  }
}
