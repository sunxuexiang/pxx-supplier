import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      form: {
        videoName: '', // 小视频名字
        state: 'all', //上架状态
        createTimeBegin: '', //发布开始时间
        createTimeEnd: '' //发布结束时间
      },
      // 商品分页数据
      goodsPage: [],
      pageNum: 0,
      pageSize: 10,
      total: 0
    };
  }

  @Action('home:setting')
  setting(state: IMap, data) {
    return state.set('goodsPage', data);
  }

  @Action('company: init: supplier')
  fetchSuppliers(state: IMap, context: any) {
    return state
      .set('pageSize', context.size)
      .set('total', context.totalElements);
  }
  /**
   * 设置当前页面
   * @param state
   * @param currentPage
   */
  @Action('company: currentPage')
  currentPage(state: IMap, currentPage) {
    return state.set('pageNum', currentPage);
  }

  /**
   * 设置列表form请求参数
   * @param state
   * @param param1
   */
  @Action('company: form: field')
  setField(state: IMap, { field, value }) {
    return state.setIn(['form', field], value);
  }
}
