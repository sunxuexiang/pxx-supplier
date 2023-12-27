import { IOptions, Store } from 'plume2';
import { fromJS } from 'immutable';
import { IMap } from 'typings/globalType';
import { message } from 'antd';
import DepartmentActor from './actor/department-actor';

import {
  addDepartment,
  deleteDepartment,
  modifyDepartmentName,
  dragSort,
  getDepartmentList,
  filterEmployee,
  modifyLeader
} from './webapi';
import { Const } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new DepartmentActor()];
  }

  /**
   * 初始化
   */
  init = async () => {
    const { res } = (await getDepartmentList()) as any;
    this.transaction(() => {
      this.dispatch('cate: init', fromJS(res.context));
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
  modal = (isAdd) => {
    this.dispatch('cate: modal', isAdd);
  };

  /**
   * 显示添加框
   */
  leaderModal = () => {
    this.dispatch('cate: leaderModal');
  };

  searchEmployee = async (value) => {
    //autoComplete文本框值改变
    this.dispatch('invite:new:customerFilterValue', value);
    //空值不查询(不直接判boolean行，防止是0)
    if (value) {
      const formData = this.state().get('formData');
      //const nodeDepartmentIds = formData.get('nodeDepartmentIds');
      const departmentId = formData.get('departmentId');
      // const departmentIds = nodeDepartmentIds.map((v) => v.get('departmentId'));
      const { res } = await filterEmployee({
        keywords: value,
        isHiddenDimission: 1,
        departmentIds: [departmentId],
        pageNum: 0,
        pageSize: 5
      });
      if (res.code == Const.SUCCESS_CODE) {
        this.dispatch('invite:new:filterCustomer', res.context.content);
      }
    } else {
      //为空时候，要将受邀人Id清掉
      this.dispatch('invite:new:searchParams', value);
      this.dispatch('init:new:filterCustomer');
    }
  };

  saveCustomerFilter = (value) => {
    const filterCustomerData = this.state().get('filterCustomerData');
    const customerId = filterCustomerData
      .filter((v) => v.get('value') == value)
      .get(0)
      .get('key');
    //存放最终检错所需的参数
    this.dispatch('invite:new:searchParams', customerId);
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap, isAdd: boolean) => {
    this.transaction(() => {
      this.dispatch('department:init:formData');
      this.dispatch('cate: editFormData', formData);
      this.dispatch('cate: modal', isAdd);
    });
  };

  /**
   * 显示修改弹窗
   */
  showLeaderModal = (formData: IMap) => {
    this.transaction(() => {
      this.dispatch('init:new:filterCustomer');
      this.dispatch('cate: editFormData', formData);
      this.dispatch('cate: leaderModal');
    });
  };

  /**
   * 修改form信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('cate: editFormData', formData);
  };

  /**
   * 添加部门
   */
  doAdd = async () => {
    const formData = this.state().get('formData');
    let result: any;
    if (formData.get('departmentId')) {
      result = await modifyDepartmentName(formData);
    } else {
      result = await addDepartment(formData);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      // 关闭弹框
      this.modal(false);
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除品牌
   */
  doDelete = async (departmentId: number) => {
    let result: any = await deleteDepartment(departmentId);
    if (result.res.code === Const.SUCCESS_CODE) {
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  modifyLeader = async () => {
    const formData = this.state().get('formData');
    const oldEmployeeId = formData.get('oldEmployeeId');
    const departmentId = formData.get('departmentId');
    const newEmployeeId = this.state().get('newEmployeeId');
    let result: any = await modifyLeader(
      departmentId,
      oldEmployeeId,
      newEmployeeId
    );
    if (result.res.code === Const.SUCCESS_CODE) {
      // 刷新
      this.refresh();
      this.leaderModal();
    } else {
      message.error(result.res.message);
      this.leaderModal();
    }
  };

  /**
   * 拖拽排序
   * @param catePath 分类树形结构的父级路径
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (parentDepartmentIds, sourceIndex, targetIndex) => {
    let allDepartments = this.state().get('allDepartments');

    let sortList = allDepartments
      .filter((v) => v.get('parentDepartmentIds') == parentDepartmentIds)
      .toJS();

    const { res } = (await dragSort(sortList, sourceIndex, targetIndex)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };
}
