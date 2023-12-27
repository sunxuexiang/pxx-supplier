import { Store, IOptions } from 'plume2';
import { fromJS, Map } from 'immutable';
import CateActor from './actor/cate-actor';
import { IMap } from 'typings/globalType';
import { message } from 'antd';
import { Const } from 'qmkit';
import {
  getCateList,
  addCate,
  deleteCate,
  editCate,
  getResource,
  getChild
} from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new CateActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const cateList: any = await getCateList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cateList.res));
      this.dispatch('cateActor: closeModal');
    });
  };

  /**
   * 显示添加框
   */
  showAddModal = () => {
    this.transaction(() => {
      this.dispatch('cateActor: updateEditFlag', false);
      this.dispatch('cateActor: showModal');
    });
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap, editFlag: boolean) => {
    this.transaction(() => {
      this.dispatch('cateActor: updateEditFlag', editFlag);
      this.dispatch('cateActor: editFormData', formData);
      this.dispatch('cateActor: showModal');
    });
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('cateActor: closeModal');
  };

  /**
   * 修改form信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('cateActor: editFormData', formData);
  };

  /**
   * 添加分类
   */
  doAdd = async () => {
    const formData = this.state().get('formData');

    let result: any;

    let msgStr = '操作成功!';
    if (formData.get('cateId')) {
      result = await editCate(formData);
      msgStr = '编辑成功!';
    } else {
      result = await addCate(formData);
      msgStr = '新增成功!';
    }

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success(msgStr);
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除商品分类
   */
  doDelete = async (cateId: string) => {
    let result: any = await deleteCate(cateId);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('删除成功!');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 检测素材分类是否有子类
   */
  validChild = async (cateId: string) => {
    const result: any = await getChild(Map({ cateId: cateId }));
    if (result.res.context == 0) {
      this.dispatch('cateActor: child', false);
    }
    if (result.res.context == 1) {
      this.dispatch('cateActor: child', true);
    }
  };

  /**
   * 检测素材分类是否有子类素材
   */
  validResource = async (cateId: string) => {
    const result: any = await getResource(Map({ cateId: cateId }));
    if (result.res.context == 0) {
      this.dispatch('cateActor: resource', false);
    }
    if (result.res.context == 1) {
      this.dispatch('cateActor: resource', true);
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
}
