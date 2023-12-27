import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';
import { IList } from 'typings/globalType';

export default class UserActor extends Actor {
  defaultState() {
    return {
      // 用户列表，筛选过后的数据
      userList: [],
      // 用户列表，全部数据
      sourceUserList: [],
      // 用户级别列表
      userLevelList: [],
      areaParam: {
        destinationArea: fromJS([]),
        destinationAreaName: fromJS([])
      },
      cityAreaParam: {
        destinationArea: fromJS([]),
        destinationAreaName: fromJS([])
      },
      singleOrderAssignAreaParam: {
        destinationArea: fromJS([]),
        destinationAreaName: fromJS([])
      }
    };
  }
  /**
   * 产地
   */
  @Action('areas: changeArea')
  changeArea(state: any, param) {
    console.info('--changeArea--');
    return state
      .setIn(['areaParam', 'destinationArea'], fromJS(param.value))
      .setIn(['areaParam', 'destinationAreaName'], fromJS(param.label));
  }

  /**
   * 指定区域销售
   */
  @Action('areas: changeCityArea')
  changeCityArea(state: any, param) {
    console.info('--changeCityArea--');
    return state
      .setIn(['cityAreaParam', 'destinationArea'], fromJS(param.value))
      .setIn(['cityAreaParam', 'destinationAreaName'], fromJS(param.label));
  }
   /**
   * 单笔订单指定限购区域
   */
    @Action('areas: singleOrderAssignArea')
    singleOrderAssignArea(state: any, param) {
      console.info('--singleOrderAssignArea--');
      return state
        .setIn(['singleOrderAssignAreaParam', 'destinationArea'], fromJS(param.value))
        .setIn(['singleOrderAssignAreaParam', 'destinationAreaName'], fromJS(param.label));
    }

  @Action('userActor: setUserList')
  setUserList(state, userList: IList) {
    return state.set('userList', userList);
  }

  @Action('userActor: setSourceUserList')
  setSourceUserList(state, sourceUserList: IList) {
    return state.set('sourceUserList', sourceUserList);
  }

  @Action('userActor: setUserLevelList')
  setUserLevelList(state, userLevelList: IList) {
    return state.set('userLevelList', userLevelList);
  }
}
