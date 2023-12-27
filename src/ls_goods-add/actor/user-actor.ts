import { Action, Actor } from 'plume2';
import { IList } from 'typings/globalType';

export default class UserActor extends Actor {
  defaultState() {
    return {
      // 用户列表，筛选过后的数据
      userList: [],
      // 用户列表，全部数据
      sourceUserList: [],
      // 用户级别列表
      userLevelList: []
    };
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
