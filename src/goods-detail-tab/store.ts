import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { IMap } from 'typings/globalType';
import { Const } from 'qmkit';
import TabActor from './actor/tab-actor';

import {
  addTab,
  deleteTabById,
  editTab,
  getStoreGoodsTabList,
  setSort
} from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new TabActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const result: any = await getStoreGoodsTabList();
    this.transaction(() => {
      this.dispatch('tabActor: init', fromJS(result.res.context));
      this.dispatch('tabActor: closeModal');
    });
  };

  /**
   * 刷新需要延迟一下
   */
  refresh = () => {
    setTimeout(() => {
      this.init();
    }, 1000);
  };

  /**
   * 显示添加框
   */
  showAddModal = () => {
    this.dispatch('tabActor: showModal', true);
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap) => {
    this.transaction(() => {
      this.dispatch('tabActor: editFormData', formData);
      this.dispatch('tabActor: showModal');
    });
  };

  /**
   * 关闭弹窗
   */
  closeModal = () => {
    this.dispatch('tabActor: closeModal');
  };

  /**
   * 修改form信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('tabActor: editFormData', formData);
  };

  /**
   * 添加详情模板
   */
  doAdd = async () => {
    const formData = this.state().get('formData');
    let result: any;
    if (formData.get('tabId')) {
      result = await editTab(formData);
    } else {
      result = await addTab(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除详情模板
   */
  doDelete = async (tabId: string) => {
    let result: any = await deleteTabById(tabId);
    if (result.res.code === Const.SUCCESS_CODE) {
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 拖拽排序
   */
  propSort = async (sortList) => {
    let tabSortRequest = {} as any;
    for (let index in sortList) {
      sortList[index].sort = Number(index);
    }
    tabSortRequest.storeGoodsTabList = sortList.filter(
      (row) => row.isDefault != 1
    );
    const { res } = (await setSort(tabSortRequest)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('tabActor: init', fromJS(sortList));
    } else {
      message.error(res.message);
    }
  };
}
