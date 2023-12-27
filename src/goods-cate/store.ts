import { Store, IOptions } from 'plume2';
import { fromJS, Map } from 'immutable';
import { message } from 'antd';
import update from 'immutability-helper';
import { IMap } from 'typings/globalType';
import { Const } from 'qmkit';
import CateActor from './actor/cate-actor';

import {
  getCateList,
  addCate,
  deleteCate,
  editCate,
  chkChild,
  chkGoods,
  dragSort
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
    const result: any = await getCateList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(result.res.context));
      this.dispatch('cateActor: closeModal');
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
    this.dispatch('cateActor: showModal', true);
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap) => {
    this.transaction(() => {
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
   * 添加品牌
   */
  doAdd = async () => {
    const formData = this.state().get('formData');
    let result: any;
    const parmas = {
      ...formData.toJS(),
      autoInitLeaf:
        !formData.get('storeCateId') || formData.get('sameLevel') ? true : false // 新增时自动初始化叶子分类 || 编辑时sameLevel为true默认修改二级分类
    };
    if (formData.get('storeCateId')) {
      result = await editCate(parmas);
    } else {
      result = await addCate(parmas);
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
   * 删除品牌
   */
  doDelete = async (storeCateId: string) => {
    let result: any = await deleteCate(storeCateId);
    if (result.res.code === Const.SUCCESS_CODE) {
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 检测商品分类是否有子类
   */
  validChild = async (storeCateId: string) => {
    const result: any = await chkChild(Map({ storeCateId: storeCateId }));
    if (result.res.context == 0) {
      this.dispatch('cateActor: child', false);
    } else if (result.res.context == 1) {
      this.dispatch('cateActor: child', true);
    }
  };

  /**
   * 检测商品分类是否有子类商品
   */
  validGoods = async (storeCateId: string) => {
    const result: any = await chkGoods(Map({ storeCateId: storeCateId }));
    if (result.res.context == 0) {
      this.dispatch('cateActor: goods', false);
    } else if (result.res.context == 1) {
      this.dispatch('cateActor: goods', true);
    }
  };

  /**
   * 拖拽排序
   * @param catePath 分类树形结构的父级路径
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (catePath, dragIndex, hoverIndex) => {
    let cates = this.state()
      .get('dataList')
      .toJS();
    //cateIds: 0|245|246|
    let cateIds = catePath.split('|');
    //拖拽排序后的列表
    let sortList: any;

    //二级分类的拖拽排序
    if (cateIds.length == 3) {
      //二级分类集合
      let secondLevel: any;
      for (let i = 0; i < cates.length; i++) {
        if (cates[i].storeCateId == cateIds[1]) {
          secondLevel = cates[i].children;
        }
      }
      const dragRow = secondLevel[dragIndex];
      sortList = update(secondLevel, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow]
        ]
      });
    } else if (cateIds.length == 2) {
      //一级分类的拖拽排序
      const dragRow = cates[dragIndex];
      sortList = update(cates, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow]
        ]
      });
    }

    let paramList = [];
    for (let index in sortList) {
      paramList.push({
        storeCateId: sortList[index].storeCateId,
        cateSort: Number(index) + 1
      });
    }
    const { res } = (await dragSort(paramList)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };
}
