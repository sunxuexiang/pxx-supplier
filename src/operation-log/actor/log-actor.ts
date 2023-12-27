import { Action, Actor, IMap } from 'plume2';
import { fromJS, Map } from 'immutable';
import moment from 'moment';

interface ICustomerResponse {
  content: Array<any>;
  total: number;
}

export default class LogActor extends Actor {
  defaultState() {
    return {
      loading: true,
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 15,
      //当前的客户列表
      dataList: [],
      selected: [],
      // 当前页数，从1开始
      currentPage: 1,
      // 导出对话框 modal状态
      exportModalData: {},
      form: {
        beginTime: moment().subtract(3, 'months'),
        endTime: moment()
      }
    };
  }

  @Action('loading:start')
  start(state: IMap) {
    return state.set('loading', true);
  }

  @Action('loading:end')
  end(state: IMap) {
    return state.set('loading', false);
  }

  @Action('list:init')
  init(state: IMap, res: ICustomerResponse) {
    const { content, total } = res;

    return state.withMutations((state) => {
      state
        .set('total', total || 0)
        .set('dataList', fromJS(content || {}))
        .set('selected', fromJS([]));
    });
  }

  @Action('list:page')
  page(state: IMap, page: IMap) {
    return state
      .set('currentPage', page.get('currentPage'))
      .set('pageSize', page.get('pageSize'));
  }

  @Action('form:field')
  formFieldChange(state: IMap, params) {
    return state.update('form', (form) => form.mergeDeep(params));
  }

  @Action('form:clear')
  formFieldClear(state: IMap) {
    return state.set('form', Map());
  }
}
