import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';

export default class SettleActor extends Actor {
  //数据源
  defaultState() {
    return {
      queryParams: {
        startTime: moment(new Date()).subtract(3, 'months'),
        endTime: moment(new Date()),
        storeId: null,
        settleStatus: 0
      },
      settlePage: {},
      storeMap: {},
      checkedSettleIds: [],
      accountDay: '',
      settleQueryParams: {}
    };
  }

  constructor() {
    super();
  }

  @Action('settleStore:accountDay')
  accountDay(state: IMap, accountDay) {
    return state.set('accountDay', accountDay);
  }

  @Action('settleStore:settleQueryParams')
  settleQueryParams(state: IMap, settleQueryParams: IMap) {
    return state.set('settleQueryParams', settleQueryParams);
  }

  @Action('settle:list')
  list(state: IMap, settlePage) {
    return state.set('settlePage', fromJS(settlePage));
  }

  @Action('settle:queryParams')
  queryParams(state: IMap, paramMap) {
    return state.setIn(['queryParams', paramMap['key']], paramMap['value']);
  }

  @Action('settle:storeMap')
  storeMap(state: IMap, storeMap) {
    return state.set('storeMap', fromJS(storeMap));
  }

  @Action('settle:setCheckedSettleIds')
  setCheckedSettleIds(state: IMap, checkedIds) {
    return state.set('checkedSettleIds', fromJS(checkedIds));
  }
}
