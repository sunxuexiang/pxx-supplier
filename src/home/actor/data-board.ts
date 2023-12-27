/**
 * Created by chenpeng on 2017/10/9.
 */
import { Action, Actor, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class DataBoardActor extends Actor {
  defaultState() {
    return {
      dataBoard: [], //数据看板
      boardIndex: {}, //数据看板索引
      oViewNum: 0 //近日概况看板数量
    };
  }

  /**
   * 设置数据看板
   */
  @Action('data-board-actor:setDataBoard')
  setDataBoard(state: IMap, res) {
    return state.set('dataBoard', fromJS(res));
  }

  /**
   * 设置数据看板索引
   */
  @Action('data-board-actor:setBoardIndex')
  setBoardIndex(state: IMap, res) {
    return state.set('boardIndex', fromJS(res));
  }

  /**
   * 切换数据看板是否生效
   */
  @Action('data-board-actor:switchDataBoard')
  switchDataBoard(state: IMap, res) {
    return state.updateIn(['dataBoard', (res as any).index], val => {
      val['onOff'] = (res as any).checked;
      return val;
    });
  }

  /**
   * 设置近日概况看板数量
   */
  @Action('data-board-actor:setOViewNum')
  setOViewNum(state: IMap, res) {
    return state.set('oViewNum', res);
  }

  /**
   * 更新近日概况看板数量
   */
  @Action('data-board-actor:updateOViewNum')
  updateOViewNum(state: IMap, res: boolean) {
    return state.updateIn(['oViewNum'], val => {
      if (res == true) {
        return ++val;
      } else {
        return --val;
      }
    });
  }
}
