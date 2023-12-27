import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface ICustomerResponse {
  content: Array<any>;
  totalElements: number;
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
      selected: [],
      // 当前页数，从1开始
      currentPage: 1,
      // 导出对话框 modal状态
      exportModalData: {},
      // 订单是否需要审核
      needAudit: false
    };
  }

  @Action('list:init')
  init(state: IMap, res: ICustomerResponse) {
    const { content, totalElements } = res;

    return state.withMutations((state) => {
      state
        .set('total', totalElements || 0)
        .set('dataList', fromJS(content || {}))
        .set('selected', fromJS([]));
    });
  }

  @Action('list:checkedAll')
  checkedAll(state: IMap, checked: boolean) {
    state = state.update('dataList', (dataList) => {
      return dataList.map((v) => v.set('checked', checked));
    });

    // 更新已选中的id
    state.get('dataList').forEach((value) => {
      let foundIndex = state
        .get('selected')
        .findIndex((v) => v === value.get('id'));
      if (checked) {
        if (foundIndex === -1) {
          state = state.set(
            'selected',
            state.get('selected').push(value.get('id'))
          );
        }
      } else {
        if (foundIndex > -1) {
          state = state.set(
            'selected',
            state.get('selected').delete(foundIndex)
          );
        }
      }
    });

    return state;
  }

  @Action('list:check')
  check(state: IMap, { index, checked }) {
    // 设置选中
    state = state.setIn(['dataList', index, 'checked'], checked);

    // 更新已选中的id
    let value = state.getIn(['dataList', index]);
    let selected = state.get('selected');
    let foundIndex = selected.findIndex((v) => v === value.get('id'));
    if (checked) {
      if (foundIndex === -1) {
        selected = selected.push(value.get('id'));
        state = state.set('selected', selected);
      }
    } else {
      if (foundIndex > -1) {
        selected = selected.delete(foundIndex);
        state = state.set('selected', selected);
      }
    }

    return state;
  }

  @Action('list:page')
  page(state: IMap, page: IMap) {
    return state.set('currentPage', page.get('currentPage'));
  }

  @Action('list:export-modal:hide')
  exportModalHide(state: IMap) {
    return state.setIn(['exportModalData', 'visible'], false);
  }

  @Action('list:setNeedAudit')
  setNeedAudit(state: IMap, need) {
    return state.set('needAudit', need);
  }

  @Action('list:export-modal:change')
  exportModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['exportModalData', 'visible'], modalStatus.get('visible'))
      .setIn(
        ['exportModalData', 'exportByParams'],
        modalStatus.get('exportByParams')
      )
      .setIn(
        ['exportModalData', 'byParamsTitle'],
        modalStatus.get('byParamsTitle')
      )
      .setIn(['exportModalData', 'byIdsTitle'], modalStatus.get('byIdsTitle'))
      .setIn(
        ['exportModalData', 'exportByIds'],
        modalStatus.get('exportByIds')
      );
  }
}
