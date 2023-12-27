import { Action, Actor, IMap } from 'plume2';
/**
 * Created by chenpeng on 2017/10/13.
 */

export default class ShowTodoActor extends Actor {
  defaultState() {
    return {
      todoVisible: true, //是否显示待处理事项
      fOrderList002: false, //待审核订单
      fOrderList001: false, //待付款订单
      fOrderDetail002: false, //待发货订单
      fOrderList003: false, //待收货订单
      rolf002: false, //待审核退单
      rolf003: false, //待填写物流退单
      rolf004: false, //待收货退单
      rolf005: false, //待退款退单
      f_customer_3: true, //待开票订单
      changeInvoice: true, //待审核商品
      f_goods_check_1: false,
      destoryOpenOrderInvoice: true //待结算账单
    };
  }

  /**
   * 待处理事项merge操作
   */
  @Action('show-todo-actor:mergeShowTodo')
  mergeShowTodo(state: IMap, res: IMap) {
    return state.merge(res);
  }
}
