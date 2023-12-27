import { Actor, Action } from 'plume2';
import { List, Map } from 'immutable';
import { IMap } from 'typings/globalType';

declare type IList = List<any>;

export default class CateActor extends Actor {
  defaultState() {
    return {
      dataList: [],
      allDataList: [],
      // 弹框是否显示
      modalVisible: false,
      // 表单内容
      formData: {},
      childFlag: false,
      goodsFlag: false
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
        const children = dataList.filter(
          (item) => item.get('cateParentId') == data.get('storeCateId')
        );
        if (!children.isEmpty() && !(data.get('sameLevel') === true)) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('dataList', newDataList).set('allDataList', dataList);
  }

  /**
   * 修改表单内容
   */
  @Action('cateActor: editFormData')
  editCateInfo(state, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('cateActor: showModal')
  show(state, needClear: boolean) {
    if (needClear) {
      state = state.set('formData', Map());
    }
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
   * 检测子类
   */
  @Action('cateActor: child')
  child(state, flag: boolean) {
    return state.set('childFlag', flag);
  }

  /**
   * 检测商品关联
   */
  @Action('cateActor: goods')
  image(state, flag: boolean) {
    return state.set('goodsFlag', flag);
  }
}
