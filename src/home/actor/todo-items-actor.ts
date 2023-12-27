/**
 * Created by chenpeng on 2017/9/26.
 */

import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class TodoItemsActor extends Actor {
  defaultState() {
    return {
      tradeTodo: {}, //订单待处理事项
      returnTodo: {}, //退单待处理事项
      goodsTodo: {}, //会员待处理事项
      employee: {} //员工信息
    };
  }

  /**
   * 设置订单待处理事项
   */
  @Action('home-todo-actor:setTradeTodo')
  setTradeTodo(state: IMap, res) {
    return state.set('tradeTodo', fromJS(res));
  }
  /**
   * 设置退单待处理事项
   */
  @Action('home-todo-actor:setReturnTodo')
  setReturnTodo(state: IMap, res) {
    return state.set('returnTodo', fromJS(res));
  }
  /**
   * 处理会员待处理事项
   */
  @Action('home-todo-actor:setGoodsTodo')
  setCustomeTrodo(state: IMap, res) {
    return state.set('goodsTodo', fromJS(res));
  }
  /**
   * 设置员工信息
   */
  @Action('home-actor:setEmployee')
  setEmployee(state: IMap, res) {
    return state.set('employee', fromJS(res));
  }
}
