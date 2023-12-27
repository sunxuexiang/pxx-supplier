import { IOptions, Store } from 'plume2';
import LoadingActor from './actor/loading-actor';
import ListActor from './actor/list-actor';
import SelectedActor from './actor/selected-actor';
import RoleActor from './actor/search-actor';
import * as webapi from './webapi';

import { fromJS, List } from 'immutable';

import { message } from 'antd';
import EditActor from './actor/edit-actor';
import VisibleActor from './actor/visible-actor';
import ModalActor from './actor/modal-actor';
import { Const, cache } from 'qmkit';
import { prependListener } from 'cluster';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new LoadingActor(),
      new ListActor(),
      new SelectedActor(),
      new RoleActor(),
      new EditActor(),
      new VisibleActor(),
      new ModalActor()
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const param = this.state()
      .get('searchForm')
      .toJS();
    this.dispatch('loading:start');
    const { res } = await webapi.fetchEmployList({
      ...param,
      pageNum,
      pageSize
    });
    const { res: roleRes } = await webapi.fetchAllRoles();
    //部门树
    await this.departTree();
    //没有部门的人数
    await this.countNum();
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('list:init', res.context);
        this.dispatch('employee:initRoles', fromJS(roleRes));
        this.dispatch('current', pageNum && pageNum + 1);
        this.dispatch('select:init', List());
        this.dispatch('loading:end');
      });
    } else {
      message.error(res.message);
      if (res.code === 'K-110001') {
        this.dispatch('loading:end');
      }
    }
  };

  departTree = async () => {
    const { res } = await webapi.getDepartTree();
    if (res.code == Const.SUCCESS_CODE) {
      const departmentVOS = fromJS(res.context.departmentVOS);
      const departmentVOList = fromJS(res.context.departmentVOList);
      const manageDepartmentIdList = fromJS(res.context.manageDepartmentIdList);
      const isMaster = fromJS(res.context.isMaster);
      //存储树形结构
      this.dispatch('employee:departTree', departmentVOList);
      //存储未经处理的一维数组结构
      this.dispatch('employee:departList', departmentVOS);
      //当前用户管理的部门id集合
      this.dispatch('employee:manageDepartmentIdList', { ids: manageDepartmentIdList, isMaster: isMaster });
      const parentId = departmentVOList.get(0) ?
        departmentVOList
          .get(0)
          .get('departmentId')
          .toString() : '';
      //默认展开第一个父部门极其下面的子部门
      if (parentId) {
        const defaultExpandedKeys = this._findParentAndChildrenIds(
          parentId,
          departmentVOS
        );
        this.dispatch('employee:defaultExpandedKeys', defaultExpandedKeys);
      }
    } else {
      message.error(res.message);
    }
  };

  countNum = async () => {
    const { res } = await webapi.countNum();
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('employee:countNum', res.context.num);
    }
  }

  //传入父部门ID，返回父+子的all部门ID集合
  _findParentAndChildrenIds = (parentId, list) => {
    const ids = [];
    ids.push(parentId);
    //筛选出目标的子部门
    const target = list.filter((vo) =>
      vo
        .get('parentDepartmentIds')
        .split('|')
        .includes(parentId)
    );
    if (target.size > 0) {
      return target.reduce((pre, current) => {
        pre.push(current.get('departmentId'));
        return pre;
      }, ids);
    } else {
      return ids;
    }
  };

  onFormChange = async (searchParam) => {
    this.dispatch('change:searchForm', searchParam);
    //如果是选中部门的，直接出发搜索
    if (searchParam.field == 'departmentIds' || searchParam.field == 'isHiddenDimission') {
      this.onSearch();
    }
  };

  /**
   * 查询
   * @returns {Promise<void>}
   */
  onSearch = async () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 删除客户
   * @returns {Promise<void>}
   */
  onDelete = async (employeeId: string) => {
    let employeeIds = [];
    employeeIds.push(employeeId);
    await webapi.deleteEmployeeByIds(employeeIds);
    this.init();
  };

  /**
   * 批量设为离职
   */
  onBatchDissmiss = async () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    const { res } = await webapi.batchDimissionEmployees(selected.toJS());
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 批量设为业务员
   */
  onBatchSetEmployee = async () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    const { res } = await webapi.batchSetEmployee(selected.toJS());
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 批量删除
   * @param employeeIds
   * @returns {Promise<void>}
   */
  onBatchDelete = async () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.warn('请选择要操作的行');
      return;
    }
    const { res } = await webapi.deleteEmployeeByIds(selected.toJS());
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onBatchEnable = async () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    const { res } = await webapi.enableEmployee(selected.toJS());
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onEnable = async (id: string) => {
    let ids = [];
    ids.push(id);
    const { res } = await webapi.enableEmployee(ids);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 显示/关闭 弹窗
   */
  switchModal = (employeeId) => {
    this.dispatch('modal: switch', employeeId);
  };

  /**
   * 输入原因
   */
  enterReason = (reason) => {
    this.dispatch('modal: reason', reason);
  };

  /**
   * 禁用员工
   * @returns {Promise<void>}
   */
  onDisable = async () => {
    let employeeId = this.state().get('employeeId');
    let accountDisableReason = this.state().get('reason');
    let accountState = 1;
    const { res } = await webapi.disableEmployee(
      employeeId,
      accountDisableReason,
      accountState
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchModal('');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onBatchDisable = async () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    let accountDisableReason = this.state().get('reason');
    let accountState = 1;
    const { res } = await webapi.batchDisableEmployee(
      selected.toJS(),
      accountDisableReason,
      accountState
    );
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchModal('');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  onAdd = () => {
    this.dispatch('modal:show');
  };

  //取消
  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };

  onEdit = (id: string) => {
    const employee = this.state()
      .get('dataList')
      .find((employee) => employee.get('employeeId') == id);
    const manageDepartmentIdList = this.state().get('manageDepartmentIdList').toJS();
    if (employee.get('departmentIds')) {
      //非当前用户能看到及操作的部门ID结合
      this.dispatch('edit:restDepartmentIds',
        employee.get('departmentIds').split(',').filter(v => !manageDepartmentIdList.includes(v)));
    }
    this.transaction(() => {
      this.dispatch('edit', true);
      //离职员工，弹框里的表单控件均不可编辑
      this.dispatch('edit:editDisable', employee.get('accountState') == 2);
      this.dispatch('edit:init', employee);
      this.dispatch('modal:show');
    });
  };

  onSave = async (employeeForm) => {
    //更新
    // if (employeeForm.roleName != null) {
    //   employeeForm.roleId = null;
    // }

    if (employeeForm.birthday) {
      employeeForm.birthday = employeeForm.birthday.format(Const.DAY_FORMAT);
    }

    if (this.state().get('edit')) {
      //如果非主账号，部门ID,需要拼接
      if (this.state().get('isMaster') == 0) {
        employeeForm.departmentIdList = employeeForm.departmentIdList.concat(this.state().get('restDepartmentIds'))
      }
      employeeForm.employeeId = this.state().getIn([
        'employeeForm',
        'employeeId'
      ]);
      const { res } = await webapi.updateEmployee(employeeForm);
      //取消编辑状态

      if (res.code === Const.SUCCESS_CODE) {
        message.success('操作成功');
        this.transaction(() => {
          this.dispatch('edit', false);
          this.dispatch('modal:hide');
        });
        this.init();
      } else {
        this.dispatch('edit', true);
        message.error(res.message);
      }
      return;
    }
    //保存
    const { res } = await webapi.saveEmployee(employeeForm);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.dispatch('modal:hide');
      this.init();
    } else {
      message.error(res.message);
    }
  };

  toggleAdjustModal = () => {
    this.dispatch('modal:toggleAdjustModal');
  };

  toggleConnectModal = () => {
    this.dispatch('modal:toggleConnectModal');
  };

  //业务员交接，根据姓名模糊查询5条业务员记录
  searchEmployees = async (keyWords) => {
    if (keyWords != undefined) {
      this.dispatch('employee:searchText', keyWords);
      const { res } = await webapi.searchEmployees({
        name: keyWords
      });
      if (res.code == Const.SUCCESS_CODE) {
        this.dispatch('modal:connectEmployeeList', res.context.employeeNames);
        //数据清除
        this.dispatch('employee:searchText', null);
      }
    } else {
      //清除操作
      this.dispatch('employee:searchText', null);
      this.dispatch('employee:targetEmployeeId', '');
    }
  };

  saveConnectEmployee = (value) => {
    const filterEmployeeData = this.state().get('filterEmployeeData');
    const employeeId = filterEmployeeData
      .filter((v) => v.get('value') == value)
      .get(0)
      .get('key');
    //文本框内容
    this.dispatch('employee:searchText', value);
    //接手业务员的ID
    this.dispatch('employee:targetEmployeeId', employeeId);
  };

  setTargetDeparts = (departIds) => {
    this.dispatch('employee:setTargetDeparts', departIds);
  };

  //调整部门
  ajustDepart = async () => {
    const selected = this.state().get('selected');
    const departmentIds = this.state().get('departmentIds');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    if (departmentIds.length == 0) {
      message.error('请选择部门');
      return;
    }
    const { res } = await webapi.adjustDepartment({
      employeeIds: selected,
      departmentIds: departmentIds
    });
    if (res.code == Const.SUCCESS_CODE) {
      //弹框消失
      message.success('操作成功！');
      this.toggleAdjustModal();
      this.init();
    } else {
      message.error(res.message);
    }
  };

  //切换离职员工的隐藏显示
  toggleHide = (value) => {
    //this.dispatch('employee:toggleHide')
    localStorage.setItem(cache.HIDE_EMPLOYEE_SETTING, value)
  }

  //业务员交接
  connectEmployee = async () => {
    const selected = this.state().get('selected');
    const targetEmployeeId = this.state().get('targetEmployeeId');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    if (targetEmployeeId.length == 0) {
      message.error('请选择业务员');
      return;
    }
    //交接
    const { res } = await webapi.connectEmployee({
      employeeIds: selected,
      newEmployeeId: targetEmployeeId
    });
    if (res.code == Const.SUCCESS_CODE) {
      //弹框消失
      message.success('操作成功！');
      this.toggleConnectModal();
      this.init();
    } else {
      message.error(res.message);
    }
  };

  //业务员激活
  onBatchActivateAccount = async () => {
    const selected = this.state().get('selected');
    if (selected.isEmpty()) {
      message.error('请选择要操作的行');
      return;
    }
    //交接
    const { res } = await webapi.activateAccount({
      employeeIds: selected,
    });
    if (res.code == Const.SUCCESS_CODE) {
      //弹框消失
      message.success('操作成功！');
      //this.toggleConnectModal();
      this.init();
    } else {
      message.error(res.message);
    }
  };

  lastDepartmentIds = (ids) => {
    this.dispatch('employee:lastDepartmentIds', ids)
  }

  toggleClick = () => {
    this.dispatch('employee:toggleClick')
  }
}
