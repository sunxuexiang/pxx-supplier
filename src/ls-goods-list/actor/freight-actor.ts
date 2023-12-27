import { Actor, Action, IMap } from 'plume2';
import { IList } from 'typings/globalType';

export default class FreightActor extends Actor {
  defaultState() {
    return {
      feightVisible: false,
      freightTemp: {},
      freightList: [],
      selectTemp: {},
      selectTempExpress: {},
      freightTempId: ''
    };
  }

  @Action('freight:feightVisible')
  setFeightVisible(state: IMap, feightVisible: boolean) {
    return state.set('feightVisible', feightVisible);
  }

  @Action('freight:freightTempId')
  setFreightTempId(state: IMap, freightTempId: number) {
    return state.set('freightTempId', freightTempId);
  }

  @Action('freight:freightTemp')
  setFreightTemp(state: IMap, freightTemp: IMap) {
    return state.set('freightTemp', freightTemp);
  }

  @Action('freight:freightList')
  setFreightList(state: IMap, freightList: IList) {
    return state.set('freightList', freightList);
  }

  @Action('freight:selectTemp')
  setSelectTemp(state: IMap, selectTemp: IMap) {
    return state.set('selectTemp', selectTemp);
  }

  @Action('freight:selectTempExpress')
  setSelectTempExpress(state: IMap, selectTempExpress: IMap) {
    return state.set('selectTempExpress', selectTempExpress);
  }
}
