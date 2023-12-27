import { Actor, Action } from 'plume2';
import { Map, fromJS } from 'immutable';
import { IMap, IList } from 'typings/globalType';

export default class CateActor extends Actor {
  defaultState() {
    return {
      videoCateIds: [],
      videoCateId: [],
      // 弹框是否显示
      modalCateVisible: false,
      // 扁平的分类列表信息
      resCateAllList: [],
      // 父子结构的分类列表信息
      resCateList: [],
      // 表单内容
      cateData: {},
      childFlag: false,
      cateImages: [],
      // tree是否展开
      expandedKeys: []
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

    return state
      .set('resCateList', newDataList)
      .set('resCateAllList', cateList);
  }

  /**
   * 修改表单内容
   */
  @Action('cateActor: editFormData')
  editCateInfo(state, data: IMap) {
    return state.update('cateData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('cateActor: showModal')
  show(state) {
    return state.set('modalCateVisible', true);
  }

  /**
   * 关闭弹窗
   */
  @Action('cateActor: closeModal')
  close(state) {
    return state
      .set('modalCateVisible', false)
      .set('formData', Map())
      .set('cateImages', fromJS([]));
  }

  /**
   * 检测图片
   */
  @Action('cateActor: editImages')
  editImages(state, images) {
    return state.set('cateImages', images);
  }

  /**
   * 设置需要展开的分类
   */
  @Action('cateActor: editExpandedKeys')
  editExpandedKeys(state, cateIds) {
    return state.set('expandedKeys', cateIds);
  }

  /**
   * 素材分类选中
   * @param state
   * @param cateIds
   */
  @Action('cateActor: cateIds')
  editCateIds(state, cateIds) {
    return state.set('videoCateIds', cateIds);
  }

  /**
   * 素材分类选择
   * @param state
   * @param cateId
   */
  @Action('cateActor: cateId')
  editCateId(state, cateId) {
    return state.set('videoCateId', cateId);
  }
}
