import { Actor, Action, IMap } from 'plume2';
import { fromJS, List } from 'immutable';

export default class ListActor extends Actor {
  defaultState() {
    return {
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 当前页数，从1开始
      currentPage: 1,
      //当前的退单列表
      dataList: [],
      selected: [],
      //驳回／拒绝收货 modal状态
      rejectModalData: {},
      //填写物流 modal状态
      deliverModalData: {},
      //线下退款 modal状态
      refundModalData: {},
      // 导出对话框 modal状态
      exportModalData: {},
      //在线退款状态
      onlineRefundModalData: {
        refund: 0
      }
    };
  }

  @Action('order-return-list:init')
  init(state: IMap, res: any) {
    const { content, totalElements, flushSelected } = res;

    // 已勾选内容
    let selected;

    let list = fromJS(content);

    // 是否需要清空已选中内容
    if (flushSelected) {
      selected = List();
    } else {
      // 保留选中状态
      selected = state.get('selected');
      list.forEach((v, index) => {
        let findIndex = selected.findIndex(id => v.get('id') == id);
        if (findIndex > -1) {
          list = list.setIn([index, 'checked'], true);
        }
      });
    }

    return state.withMutations(state => {
      state
        .set('total', totalElements)
        .set('dataList', list)
        .set('selected', selected);
    });
  }

  @Action('order-return-list:page')
  page(state: IMap, page: IMap) {
    return state.set('currentPage', page.get('currentPage')).set('pageSize',page.get('pageSize'));
  }

  @Action('order-return-list:reject-modal:change')
  rejectModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['rejectModalData', 'visible'], modalStatus.get('visible'))
      .setIn(['rejectModalData', 'type'], modalStatus.get('type'))
      .setIn(['rejectModalData', 'onOk'], modalStatus.get('onOk'))
      .setIn(['rejectModalData', 'rid'], modalStatus.get('rid'));
  }

  @Action('order-return-detail:refund-online-modal:change')
  refundOnlineModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['onlineRefundModalData', 'visible'], modalStatus.get('visible'))
      .setIn(['onlineRefundModalData', 'onOk'], modalStatus.get('onOk'))
      .setIn(['onlineRefundModalData', 'rid'], modalStatus.get('rid'))
      .setIn(
        ['onlineRefundModalData', 'refundAmount'],
        modalStatus.get('refundAmount')
      )
      .setIn(
        ['onlineRefundModalData', 'customerId'],
        modalStatus.get('customerId')
      )
      .setIn(['onlineRefundModalData', 'applyPoints'],
        modalStatus.get('applyPoints'));
  }

  @Action('order-return-list:reject-modal:hide')
  rejectModalHide(state: IMap) {
    return state.setIn(['rejectModalData', 'visible'], false);
  }

  @Action('order-return-list:deliver-modal:change')
  deliverModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['deliverModalData', 'visible'], modalStatus.get('visible'))
      .setIn(['deliverModalData', 'onOk'], modalStatus.get('onOk'))
      .setIn(['deliverModalData', 'rid'], modalStatus.get('rid'));
  }

  @Action('order-return-list:deliver-modal:hide')
  deliverModalHide(state: IMap) {
    return state.setIn(['deliverModalData', 'visible'], false);
  }

  @Action('order-return-list:refund-modal:change')
  refundModalChange(state: IMap, modalStatus: IMap) {
    return state
      .setIn(['refundModalData', 'visible'], modalStatus.get('visible'))
      .setIn(['refundModalData', 'onOk'], modalStatus.get('onOk'))
      .setIn(['refundModalData', 'rid'], modalStatus.get('rid'))
      .setIn(
        ['refundModalData', 'refundAmount'],
        modalStatus.get('refundAmount')
      )
      .setIn(['refundModalData', 'customerId'], modalStatus.get('customerId'))
      .setIn(['refundModalData', 'applyPoints'], modalStatus.get('applyPoints'));
  }

  @Action('order-return-list:refund-modal:hide')
  refundModalHide(state: IMap) {
    return state.setIn(['refundModalData', 'visible'], false);
  }

  @Action('order-return-list:export-modal:change')
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

  @Action('order-return-list:export-modal:hide')
  exportModalHide(state: IMap) {
    return state.setIn(['exportModalData', 'visible'], false);
  }

  @Action('order-return-list:checkAll')
  checkAll(state: IMap, checked: boolean) {
    state = state.update('dataList', dataList => {
      return dataList.map(v => v.set('checked', checked));
    });

    // 更新已选中的id
    state.get('dataList').forEach(value => {
      let foundIndex = state
        .get('selected')
        .findIndex(v => v === value.get('id'));
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

  @Action('order-return-list:check')
  check(state: IMap, { index, checked }) {
    // 设置选中
    state = state.setIn(['dataList', index, 'checked'], checked);

    // 更新已选中的id
    let value = state.getIn(['dataList', index]);
    let selected = state.get('selected');
    let foundIndex = selected.findIndex(v => v === value.get('id'));
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

  /**
   * 隐藏线上支付退款
   * @param state
   */
  @Action('order-return-detail:hide')
  onlineRefundModalHide(state: IMap) {
    return state.setIn(['onlineRefundModalData', 'visible'], false);
  }

  /**
   * 显示线上支付退款
   * @param state
   */
  @Action('order-return-detail:show')
  onlineRefundModalshow(state: IMap) {
    return state.setIn(['onlineRefundModalData', 'visible'], true);
  }
}
