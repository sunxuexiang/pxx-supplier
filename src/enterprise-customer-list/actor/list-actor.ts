import { Actor, Action, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';

interface ICustomerResponse {
  detailResponseList: Array<any>;
  total: number;
}

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      //当前的客户列表
      dataList: [],
      //当前页
      currentPage: 1,
      //客户商家对应关系
      supplierNameMap: Map(),
      //用户是否拥有crm权限
      crmFlag: false
    };
  }

  @Action('listActor:init')
  init(state: IMap, res: ICustomerResponse) {
    const { detailResponseList, total } = res;

    return state.withMutations((state) => {
      state.set('total', total).set('dataList', fromJS(detailResponseList));
    });
  }

  @Action('list:currentPage')
  currentPage(state: IMap, current) {
    return state.set('currentPage', current);
  }

  @Action('list:supplierNameMap')
  supplierNameMap(state: IMap, content) {
    // let supplierNameMap = state.get('supplierNameMap');
    // supplierNameMap.set(content['customerId'], content['supplierName']);
    return state.setIn(
      ['supplierNameMap', content['customerId']],
      content['supplierName']
    );
  }

  @Action('setCRMFlag')
  setCrmFlag(state, flag) {
    return state.set('crmFlag', flag);
  }
}
