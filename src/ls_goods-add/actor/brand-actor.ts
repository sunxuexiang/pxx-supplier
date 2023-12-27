import { Actor, Action } from 'plume2';
import { Map } from 'immutable';
import { IMap } from 'typings/globalType';

export default class BrandActor extends Actor {
  defaultState() {
    return {
      // 弹框是否显示
      modalBrandVisible: false,
      // 表单内容
      brandData: {}
    };
  }

  /**
   * 修改表单内容
   */
  @Action('brandActor: editBrandInfo')
  editBrandInfo(state, data: IMap) {
    return state.set('brandData', data);
  }

  /**
   * 显示弹窗
   */
  @Action('brandActor: showModal')
  show(state, needClear: boolean) {
    if (needClear) {
      state = state.set('brandData', Map());
    }
    return state.set('modalBrandVisible', true);
  }

  /**
   * 关闭弹窗
   */
  @Action('brandActor: closeModal')
  close(state) {
    return state.set('modalBrandVisible', false).set('brandData', Map());
  }
}
