/**
 * Created by feitingting on 2017/10/18.
 */
import { Actor, Action, IMap } from 'plume2';
export default class TableActor extends Actor {
  defaultState() {
    return {
      tradeTable: '',
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      pageNum: 1,
      current: 1, //当前显示的页，默认为1
      startDate: '', //开始时间
      endDate: '', //结束时间，
      tableColumns: '',
      recommendIndicators: '', //推荐指标
      sortedName: 'title', //排序的列
      sortedOrder: 'descend', //排序的种类（升或降）
      visible: false,
      selectType: 0
    };
  }

  /**
   *
   * @param state
   */
  @Action('trade:table')
  table(state: IMap, context: any) {
    context.map(v => {
      //百分率后面加%
      v.orderConversionRate =
        parseFloat(v.orderConversionRate).toFixed(2) + '%';
      v.payOrderConversionRate =
        parseFloat(v.payOrderConversionRate).toFixed(2) + '%';
      v.wholeStoreConversionRate =
        parseFloat(v.wholeStoreConversionRate).toFixed(2) + '%';
      //下单金额
      v.orderAmt = '￥' + parseFloat(v.orderAmt).toFixed(2);
      //退单金额
      v.returnOrderAmt = '￥' + parseFloat(v.returnOrderAmt).toFixed(2);
      //付款金额
      v.payOrderAmt = '￥' + parseFloat(v.payOrderAmt).toFixed(2);
      //笔单价
      v.everyUnitPrice = '￥' + parseFloat(v.everyUnitPrice).toFixed(2);
      //客单价
      v.customerUnitPrice = '￥' + parseFloat(v.customerUnitPrice).toFixed(2);
    });
    return state.set('tradeTable', context);
  }

  @Action('trade:startDate')
  startDate(state: IMap, date: string) {
    return state.set('startDate', date);
  }

  @Action('trade:selectType')
  selectType(state: IMap, selectType: number) {
    return state.set('selectType', selectType);
  }

  @Action('trade:endDate')
  endDate(state: IMap, date: string) {
    return state.set('endDate', date);
  }

  /**
   * 总数
   * @param state
   * @param total
   */
  @Action('trade:total')
  totalPages(state, total: number) {
    return state.set('total', total);
  }

  /**
   * 报表当前显示哪一页
   * @param state
   * @param current
   */
  @Action('trade:current')
  current(state, current: number) {
    return state.set('current', current);
  }

  /**
   * 自定义报表的显示指标
   * @param state
   * @param columns
   */
  @Action('trade:columns')
  columns(state, columns) {
    return state.set('tableColumns', columns);
  }

  @Action('trade:recommend')
  recommend(state, columns) {
    return state.set('recommendIndicators', columns);
  }

  @Action('trade:pageSize')
  pageSize(state, pageSize) {
    return state.set('pageSize', pageSize);
  }

  @Action('trade:sortName')
  sortName(state, sortName) {
    return state.set('sortedName', sortName);
  }

  @Action('trade:sortOrder')
  sortOrder(state, sortOrder) {
    return state.set('sortedOrder', sortOrder);
  }

  @Action('trade:hideModal')
  hideModal(state) {
    return state.set('visible', false);
  }

  @Action('trade:showModal')
  showModal(state) {
    return state.set('visible', true);
  }
}
