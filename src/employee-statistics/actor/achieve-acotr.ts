/**
 * Created by feitingting on 2017/10/27.
 */
import { Actor, Action } from 'plume2';

export default class AchieveActor extends Actor {
  //数据源
  defaultState() {
    return {
      //页码
      achievePageNum: 1,
      //每页几条数据
      achievePageSize: 10,
      //总数
      achieveTotal: 0,
      //当前页
      achieveCurrent: 1,
      //业务员业绩报表
      achieveViewList: '',
      //业绩报表展示的指标
      achieveColumns: '',
      //搜索关键词
      achieveEmployeeName: '',
      achieveSortName: 'amount',
      achieveSortType: 'descend',
      achieveVisible: false
    };
  }

  /**
   * 业务员业绩报表
   * @param state
   * @param context
   */
  @Action('achieve:table')
  achieveTable(state, context: any) {
    //生成序号
    if (context.length > 0) {
      context.map((v, i) => {
        v.index =
          (state.get('achieveCurrent') - 1) * state.get('achievePageSize') +
          i +
          1;
        //金额处理(下单金额)
        v.amount = '￥' + parseFloat(v.amount).toFixed(2);
        //付款金额
        v.payAmount = '￥' + parseFloat(v.payAmount).toFixed(2);
        //退单金额
        v.returnAmount = '￥' + parseFloat(v.returnAmount).toFixed(2);
        //笔单价
        v.orderUnitPrice = '￥' + parseFloat(v.orderUnitPrice).toFixed(2);
        //客单价
        v.customerUnitPrice = '￥' + parseFloat(v.customerUnitPrice).toFixed(2);
      });
    }
    return state.set('achieveViewList', context);
  }

  /**
   * 获客报表自定义指标
   * @param state
   * @param value
   */
  @Action('achieve:columns')
  achieveColumns(state, value) {
    return state.set('achieveColumns', value);
  }

  /**
   * 获客报表总数
   * @param state
   * @param total
   */
  @Action('achieve:total')
  achieveTotal(state, total: number) {
    return state.set('achieveTotal', total);
  }

  /**
   * 当前页
   * @param state
   * @param current
   */
  @Action('achieve:current')
  achieveCurrent(state, current: number) {
    return state.set('achieveCurrent', current);
  }

  /**
   * 业绩报表搜索关键字
   * @param state
   * @param name
   */
  @Action('achieve:employeeName')
  employeeName(state, name: string) {
    return state.set('achieveEmployeeName', name);
  }

  /**
   * 清空关键字
   * @param state
   * @param name
   */
  @Action('achieve:emptyName')
  emptyName(state) {
    return state.set('achieveEmployeeName', '');
  }

  /**
   * 业绩报表pageSize
   * @param state
   * @param pageSize
   */
  @Action('achieve:pageSize')
  pageSize(state, pageSize) {
    return state.set('achievePageSize', pageSize);
  }

  @Action('achieve:sortName')
  sortName(state, sortName) {
    return state.set('achieveSortName', sortName);
  }

  @Action('achieve:sortOrder')
  sortOrder(state, sortOrder) {
    return state.set('achieveSortType', sortOrder);
  }

  @Action('achieve:hide')
  achieveHide(state) {
    return state.set('achieveVisible', false);
  }

  @Action('achieve:show')
  achieveShow(state) {
    return state.set('achieveVisible', true);
  }
}
