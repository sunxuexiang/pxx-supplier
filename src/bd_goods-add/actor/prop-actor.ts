import { Action, Actor } from 'plume2';
import { fromJS } from 'immutable';

export default class PropActor extends Actor {
  defaultState() {
    return {
      //前台应该展示的属性 形如：[{goodsPropDetails: []}]
      propDetail: [],
      propList: []
    };
  }

  @Action('propActor: setPropList')
  setPropList(state, value: any) {
    return state.set('propList', value);
  }

  @Action('propActor: goodsPropDetails')
  changeCatePropDetails(state, value: any) {
    return state.set('propDetail', value);
  }

  @Action('propActor: clear')
  clear(state) {
    return state.set('propDetail', fromJS([])).set('propList', fromJS([]));
  }

  @Action('propActor: change')
  change(state, { propId, detailId }: { propId: string; detailId: string }) {
    //选择下拉选项时，要改变原有属性下属性值的select状态为select，并根据detailId设置对于属性值的select为select
    const index = state
      .get('propDetail')
      .findIndex(v => v.get('propId') === propId);
    if (index > -1) {
      const goodsPropDetails = state
        .getIn(['propDetail', index, 'goodsPropDetails'])
        .map(item => {
          if (item.get('detailId') === detailId || detailId == '0') {
            return item.set('select', 'select').set('detailId', detailId);
          }
          return item.set('select', '');
        });
      return state.setIn(
        ['propDetail', index, 'goodsPropDetails'],
        goodsPropDetails
      );
    } else {
      return state;
    }
  }
}
