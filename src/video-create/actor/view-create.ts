import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      settings: {
        videoName: '',
        artworkUrl: fromJS([]),
        videoId: '',
        resourceKey: ''
      },
      goods: {
        goodsId: '',
        goodsInfoId: '',
        goodsInfoName: ''
      },
      visible: false
    };
  }

  @Action('setting:editSetting')
  editSetting(state, data: IMap) {
    return state.update('settings', (settings) => settings.merge(data));
  }
  @Action('setting:paramFormChange')
  paramFormChange(state, data) {
    return state.setIn(['settings', 'artworkUrl'], data);
  }
  @Action('setting:editGoods')
  editGoods(state, data: IMap) {
    return state.update('goods', (goods) => goods.merge(data));
  }
  @Action('setting:visible')
  visible(state, visible: boolean) {
    return state.set('visible', visible);
  }
}
