import { Actor, Action, IMap } from 'plume2';
import { Map, fromJS } from 'immutable';
import { IList } from 'typings/globalType';

export default class DepartmentActor extends Actor {
  defaultState() {
    return {
      // 部门集合
      departments: [],
      // 全部部门集合
      allDepartments: [],
      // 弹框是否显示
      modalVisible: false,
      leaderModalVisible: false,
      // 表单内容
      formData: {
        departmentId: '',
        departmentName: '',
        departmentParentName: '',
        parentDepartmentId: '',
        departmentGrade: null
      },
      isAdd: true,
      filterCustomerData: fromJS([]),
      inviteSearchText: '',
      oldEmployeeId: '',
      newEmployeeId: ''
    };
  }

  /**
   * 初始化
   */
  @Action('cate: init')
  init(state: IMap, data) {
    return state
      .set('departments', data.get('departmentVOList'))
      .set('allDepartments', data.get('departmentVOS'));
  }

  /**
   * 修改表单内容
   */
  @Action('cate: editFormData')
  editCateInfo(state: IMap, data: IMap) {
    return state.update('formData', (formData) => formData.merge(data));
  }

  /**
   * 显示弹窗
   */
  @Action('cate: modal')
  show(state: IMap, isAdd) {
    const visible = !state.get('modalVisible');

    state = state.set('isAdd', isAdd);

    return state.set('modalVisible', visible);
  }

  /**
   * 显示弹窗
   */
  @Action('cate: leaderModal')
  showLeaderModal(state: IMap) {
    const visible = !state.get('leaderModalVisible');

    return state.set('leaderModalVisible', visible);
  }

  @Action('invite:new:customerFilterValue')
  customerFilterValue(state, value) {
    return state.set('inviteSearchText', value);
  }

  @Action('invite:new:filterCustomer')
  filterCustomers(state, res) {
    const filterCustomerData = res.map((v) => {
      return {
        key: v.employeeId,
        value: v.employeeName + '  ' + this._hideAccount(v.employeeMobile)
      };
    });
    return state.set('filterCustomerData', fromJS(filterCustomerData));
  }

  /**
   * 填充搜索字段
   * @param state
   * @param param1
   */
  @Action('invite:new:searchParams')
  searchParams(state, value) {
    return state.set('newEmployeeId', value);
  }

  _hideAccount = (account) => {
    return account && account.length > 0
      ? account.substring(0, 3) + '****' + account.substring(7, account.length)
      : '';
  };

  @Action('department:init:formData')
  initFormData(state: IMap) {
    return state.set('formData', Map({}));
  }

  @Action('init:new:filterCustomer')
  initFilterCustomers(state) {
    return state.set('filterCustomerData', fromJS([]));
  }
}
