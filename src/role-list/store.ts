import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { IList, IMap } from 'typings/globalType';
import RoleActor from './actor/role-actor';
import update from 'immutability-helper';
import {
  addEquities,
  deleteEquities,
  dragSort,
  getEquitiesList,
  modifyEquities
} from './webapi';
import { Const } from 'qmkit';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new RoleActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const { res } = (await getEquitiesList()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch(
        'equities: init',
        fromJS(res.context.roleInfoAndMenuInfoVOList)
      );
    } else {
      message.error(message);
    }
  };

  /**
   * 显示添加框
   */
  modal = (isAdd) => {
    this.dispatch('equities: modal', isAdd);
    this.dispatch('setting: context:setNull');
    this.dispatch('setting: cuopon:setNull');
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap, isAdd: boolean) => {
    this.transaction(() => {
      this.dispatch('equities: editFormData', formData);
      this.dispatch('equities: modal', isAdd);
    });
  };

  /**
   * 修改form信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('equities: editFormData', formData);
  };

  /**
   * 修改商品图片
   */
  _editImages = (images: IList) => {
    this.dispatch('equities: editImages', images);
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (dragIndex, hoverIndex) => {
    let couponCateList = this.state()
      .get('equitiesList')
      .toJS();
    //拖拽排序
    const dragRow = couponCateList[dragIndex];
    //拖拽排序后的列表
    let sortList = update(couponCateList, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });
    let rightsIdList = [];
    for (let index in sortList) {
      rightsIdList.push(sortList[index].rightsId);
    }
    const { res } = (await dragSort({ rightsIdList: rightsIdList })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 刷新需要延迟一下
   */
  refresh = () => {
    setTimeout(() => {
      this.init();
    }, 1000);
  };

  doAdd = async () => {
    let result: any;
    const formData = this.state().get('formData');

    let params = { ...formData.toJS() };
    if (this.state().get('isAdd')) {
      result = await addEquities(params);
    } else {
      result = await modifyEquities(params);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      this.modal(false);
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除优惠券分类
   */
  deleteEquities = async (roleInfoId) => {
    let result: any = await deleteEquities(roleInfoId);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };
}
