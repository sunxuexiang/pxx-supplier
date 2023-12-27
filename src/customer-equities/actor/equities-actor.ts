import { Action, Actor, IMap } from 'plume2';
import { IList } from 'typings/globalType';
import { fromJS, Map } from 'immutable';

export default class EquitiesActor extends Actor {
  defaultState() {
    return {
      equitiesList: [],
      modalVisible: false,
      isAdd: true,
      formData: {
        rightsType: null,
        status: 0,
        rightsLogo: ''
      },
      images: []
    };
  }

  /**
   * 初始化
   */
  @Action('equities: init')
  init(state: IMap, equitiesList: IList) {
    return state.set('equitiesList', equitiesList);
  }

  /**
   * 显示弹窗
   */
  @Action('equities: modal')
  show(state: IMap, isAdd: boolean) {
    const visible = !state.get('modalVisible');
    if (!visible) {
      state = state
        .set(
          'formData',
          Map({
            rightsType: null,
            status: 0
          })
        )
        .set('images', fromJS([]));
    }
    state = state.set('isAdd', isAdd);
    return state.set('modalVisible', visible);
  }

  /**
   * 修改表单内容
   */
  @Action('equities: editFormData')
  editCateInfo(state: IMap, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  @Action('equities: editImages')
  editImages(state: IMap, images) {
    return state.set('images', images);
  }
}
