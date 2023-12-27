import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

interface MarketingResponse {
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
      //当前页
      currentPage: 1,
      // 批量导出弹框 modal状态
      exportModalData: {},
      // 设置勾选的id
      checkedIds: []
    };
  }

  @Action('listActor:init')
  init(state: IMap, res: MarketingResponse) {
    const { content, totalElements } = res;

    return state.withMutations((state) => {
      state.set('total', totalElements).set('dataList', fromJS(content));
    });
  }

  @Action('list:currentPage')
  currentPage(state: IMap, page) {
    return state
      .set('currentPage', page.pageNum)
      .set('pageSize', page.pageSize);
  }

  /**
   * 设置勾选的id
   */
  @Action('info:setCheckedData')
  setCheckedData(state: IMap, ids) {
    return state.set('checkedIds', ids);
  }

  /**
   * 打开导出弹框 并设置 modal状态
   */
  @Action('info:exportModalShow')
  exportModalShow(state: IMap, exportModalData: IMap) {
    return state.set('exportModalData', exportModalData);
  }

  /**
   * 关闭导出弹框
   */
  @Action('info:exportModalHide')
  exportModalHide(state: IMap) {
    return state.setIn(['exportModalData', 'visible'], false);
  }
}
