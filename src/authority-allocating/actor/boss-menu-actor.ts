import { Action, Actor, IMap } from 'plume2';

/**
 * 菜单actor
 */
export default class BossMenuActor extends Actor {
  defaultState() {
    return {
      allMenus: [], // 扁平无层级的菜单
      bossMenus: [], // 有层级关系的菜单
      menuIdList: [], // 当前勾选的菜单
      functionIdList: [] // 当前勾选的功能
    };
  }

  @Action('authority:allMenus')
  allMenus(state: IMap, menus) {
    return state.set('allMenus', menus);
  }

  @Action('authority:bossMenus')
  bossMenus(state: IMap, menus) {
    return state.set('bossMenus', menus);
  }

  @Action('authority:menuIdList')
  menuIdList(state: IMap, menuIdList) {
    return state.set('menuIdList', menuIdList);
  }

  @Action('authority:functionIdList')
  functionIdList(state: IMap, functionIdList) {
    return state.set('functionIdList', functionIdList);
  }
}
