import { IOptions, Store } from 'plume2';
import { Const } from 'qmkit';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import FormActor from './actor/form-actor';
import SelectedActor from './actor/selected-customer-actor';
import EmployeeActor from './actor/employee-actor';
import { fromJS } from 'immutable';
import { message } from 'antd';
import EditActor from './actor/edit-actor';
import CustomerLevelActor from './actor/customer-level-actor';
import VisibleActor from './actor/visible-actor';
import RelaterActor from './actor/related-actor';
import SelfListActor from "./actor/self-list-actor";
import SelfFormActor from "./actor/self-form-actor";

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [
      new ListActor(),
      new SelfListActor(),
      new LoadingActor(),
      new FormActor(),
      new SelfFormActor(),
      new SelectedActor(),
      new EmployeeActor(),
      new CustomerLevelActor(),
      new EditActor(),
      new VisibleActor(),
      new RelaterActor()
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    const query = this.state()
      .get('form')
      .toJS();
    if (query.customerType === '-1') {
      query.customerType = null;
    }

    const { res } = await webapi.fetchCustomerList({
      ...query,
      pageNum,
      pageSize
    });
    const levelResult = await webapi.fetchAllCustomerLevel();

    const { res: resEmployee } = await webapi.fetchAllEmployee();

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context);
        this.dispatch('list:currentPage', pageNum && pageNum + 1);
        this.dispatch('customerLevel:init', fromJS(levelResult.res.context.storeLevelVOList));
        this.dispatch('select:init', []);
        this.dispatch('employee:init', fromJS(resEmployee));
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }

    // webapi.fetchAllEmployee().then(({ res }) => {
    //   this.dispatch('employee:init', fromJS(res))
    // })
    // webapi.fetchAllCustomerLevel().then(({ res }) => {
    //   this.dispatch('customerLevel:init', fromJS(res))
    // })
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('form:customerType', index);
    this.init();
  };

  onFormChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('form:field', {
            field: v,
            value: value[index]
          });
        });
      });
      return;
    }
    this.dispatch('form:field', { field, value });
  };

  onSearch = () => {
    this.init({ pageNum: 0, pageSize: 10 });
  };

  initForSelf = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    this.dispatch('loading:start');
    const query = this.state()
      .get('selfForm')
      .toJS();
    if (query.checkState === '-1') {
      query.checkState = '';
    }
    const { res } = await webapi.fetchBossCustomerList({
      ...query,
      pageNum,
      pageSize
    });

    const levelResult = await webapi.fetchAllBossCustomerLevel();
    const { res: resEmployee } = await webapi.fetchAllBossEmployee();

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('self-list:init', res.context);
        this.dispatch('self-list:currentPage', pageNum && pageNum + 1);
        this.dispatch('employee:init', fromJS(resEmployee));
        this.dispatch('customerLevel:init', fromJS(levelResult.res.context.customerLevelVOList));
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  //tab-list 切换
  onSelfTabChange = (index: number) => {
    this.dispatch('self-form:checkState', index);
    this.initForSelf();
  };

  onSelfFormChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('self-form:field', {
            field: v,
            value: value[index]
          });
        });
      });
      return;
    }
    this.dispatch('self-form:field', { field, value });
  };

  onSelfSearch = () => {
    this.initForSelf({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 根据客户Id查询所属商家名称
   *
   * @param customerId
   * @returns {Promise<void>}
   */
  getSupplierNameByCustomerId = async (customerId) => {
    const { res } = await webapi.getSupplierNameByCustomerId(customerId);
    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('self-list:supplierNameMap', {
        customerId: customerId,
        supplierName: res.context
      });
    } else {
      message.error(res.message);
    }
  };

  onSelect = (list) => {
    this.dispatch('select:init', list);
  };

  /**
   * 新增
   */
  onAdd = async () => {
    // FIXME 权限这块暂时屏蔽，完成功能
    // const {res} = await webapi.checkFunctionAuth('/customer', 'POST')
    // if (!res.context){
    //   message.error('此功能您没有权限访问')
    //   return
    // }
    this.dispatch('modal:show');
  };

  //取消
  onCancel = () => {
    this.transaction(() => {
      this.dispatch('edit', false);
      this.dispatch('modal:hide');
    });
  };

  onSave = async (customerForm) => {
    if (this.state().get('onSubmit')) {
      this.dispatch('modal:submit', false);
      //保存
      const { res } = await webapi.saveCustomer(customerForm);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('操作成功');
        this.dispatch('modal:hide');
        this.init();
      } else {
        this.dispatch('modal:submit', true);
        message.error(res.message);
      }
    }
  };

  deleteRelated = async (customerId) => {
    const { res } = await webapi.deletePlatformCustomerRelated(customerId);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.init();
  };

  addPlatformRelated = async (customerId, customerLevelId, modalClose) => {
    const { res } = await webapi.addPlatformRelated(
      customerId,
      customerLevelId
    );
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.onShowAddRelatedModal(false);
      this.init();
      modalClose();
    } else {
      message.error(res.message);
    }
  };

  onShowAddRelatedModal = (visible: boolean) => {
    this.dispatch('addRelated:visible', visible);
  };

  updatePlatformRelated = async (customerId, customerLevelId, employeeId) => {
    const { res } = await webapi.updateCustomerLevel(
      customerId,
      customerLevelId,
      employeeId
    );
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.onShowUpdateRelatedModal(false, null);
    } else {
      message.error(res.message);
    }
    this.init();
  };

  onShowUpdateRelatedModal = (visible: boolean, customerInfo) => {
    this.dispatch('updateRelated:visible', visible);
    this.dispatch('updateRelated:setCustomerInfo', customerInfo);
  };
}
