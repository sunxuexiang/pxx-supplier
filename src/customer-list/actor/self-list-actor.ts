import { Actor, Action, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';

interface ICustomerResponse {
  detailResponseList: Array<any>;
  total: number;
}

export default class SelfListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      selfTotal: 0,
      //当前的分页条数
      selfPageSize: 10,
      //当前的客户列表
      selfDataList: [],
      //当前页
      selfCurrentPage: 1,
      //客户商家对应关系
      supplierNameMap: Map()
    };
  }

  @Action('self-list:init')
  init(state: IMap, res: ICustomerResponse) {
    const { detailResponseList, total } = res;

    return state.withMutations((state) => {
      state.set('selfTotal', total).set('selfDataList', fromJS(detailResponseList));
    });
  }

  @Action('self-list:currentPage')
  currentPage(state: IMap, current) {
    return state.set('selfCurrentPage', current);
  }

  @Action('self-list:supplierNameMap')
  supplierNameMap(state: IMap, content) {
    // let supplierNameMap = state.get('supplierNameMap');
    // supplierNameMap.set(content['customerId'], content['supplierName']);
    return state.setIn(
      ['supplierNameMap', content['customerId']],
      content['supplierName']
    );
  }
}
