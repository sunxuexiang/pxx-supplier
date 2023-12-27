import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import ListActor from './actor/list-actor';
import LoadingActor from './actor/loading-actor';
import EmployeeActor from './actor/employee-actor';
import FormActor from './actor/form-actor';
import { fromJS, List } from 'immutable';
import { message } from 'antd';
import CustomerLevelActor from './actor/customer-level-actor';
import { Const, QMMethod, VASConst } from 'qmkit';

type TList = List<any>;

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
      new LoadingActor(),
      new FormActor(),
      new CustomerLevelActor(),
      new EmployeeActor()
    ];
  }

  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const checkIEP = await QMMethod.fetchVASStatus(VASConst.IEP);
    if (!checkIEP) {
      return null;
    }

    this.dispatch('loading:start');
    const query = this.state()
      .get('form')
      .toJS();
    if (query.enterpriseCheckState === '-1') {
      query.enterpriseCheckState = null;
    }
    const { res } = await webapi.fetchCustomerList({
      ...query,
      pageNum,
      pageSize
    });
    const { res: resLevel } = await webapi.fetchAllCustomerLevel();

    const { res: resEmployee } = await webapi.fetchAllEmployee();

    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('loading:end');
        this.dispatch('listActor:init', res.context);
        this.dispatch('list:currentPage', pageNum && pageNum + 1);
        this.dispatch('enterprise: employee:init', fromJS(resEmployee));
        this.dispatch(
          'customerLevel:init',
          fromJS(resLevel.context.customerLevelVOList)
        );
        this.dispatch('select:init', []);
      });
    } else {
      this.dispatch('loading:end');
      message.error(res.message);
    }
  };

  //tab-list 切换
  onTabChange = (index: number) => {
    this.dispatch('form:enterpriseCheckState', index);
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
}
