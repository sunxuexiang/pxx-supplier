/**
 * Created by feitingting on 2017/10/21.
 */
import { Actor, Action } from 'plume2';

export default class ClientActor extends Actor {
  //数据源
  defaultState() {
    return {
      //页码
      clientPageNum: 1,
      //每页几条数据
      clientPageSize: 10,
      //总数
      clientTotal: 0,
      //当前页
      clientCurrent: 1,
      //业务员获客报表
      clientViewList: '',
      //时间枚举类型
      dateType: 0,
      //搜索关键词
      clientEmployeeName: '',
      clientSort: 'TOTAL_DESC',
      newlySort: 'NEWLY_DESC',
      clientVisible: false //获客报表弹框
    };
  }

  /**
   * 日期枚举（0，1，2，3）
   * @param state
   * @param type
   */
  @Action('client:dateType')
  dateType(state, type) {
    return state.set('dateType', type);
  }

  /**
   * 业务员获客报表
   * @param state
   * @param context
   */
  @Action('client:table')
  clientTable(state, context: any) {
    //生成序号
    if (context.length > 0) {
      context.map((v, i) => {
        v.index =
          (state.get('clientCurrent') - 1) * state.get('clientPageSize') +
          i +
          1;
      });
    }
    return state.set('clientViewList', context);
  }

  /**
   * 每次请求的总数
   * @param state
   * @param total
   */
  @Action('client:total')
  clientTotal(state, total: number) {
    return state.set('clientTotal', total);
  }

  /**
   * 报表当前显示的页
   * @param state
   * @param current
   */
  @Action('client:current')
  current(state, current: number) {
    return state.set('clientCurrent', current);
  }

  @Action('client:employeeName')
  employeeName(state, name: string) {
    return state.set('clientEmployeeName', name);
  }

  /**
   * 清空关键字
   * @param state
   * @param name
   */
  @Action('client:emptyName')
  emptyName(state) {
    return state.set('clientEmployeeName', '');
  }

  /**
   * 获客报表pageSize
   * @param state
   * @param pageSize
   */
  @Action('client:pageSize')
  pageSize(state, pageSize) {
    return state.set('clientPageSize', pageSize);
  }

  @Action('client:sort')
  clientSort(state, sort) {
    return state.set('clientSort', sort);
  }

  @Action('clientNewly:sort')
  clientNewly(state, sort) {
    return state.set('newlySort', sort);
  }

  @Action('client:hide')
  clientHide(state) {
    return state.set('clientVisible', false);
  }

  @Action('client:show')
  clientShow(state) {
    return state.set('clientVisible', true);
  }
}
