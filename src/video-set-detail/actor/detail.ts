import { Actor, Action, IMap } from 'plume2';

export default class LoadingActor extends Actor {
  defaultState() {
    return {
      settings: {
        videoName: '',
        createTime: '',
        state: 0,
        artworkUrl: '',
        goodsInfoName: ''
      },
      videoId: ''
    };
  }

  @Action('home:setting')
  setting(state: IMap, data) {
    return state.set('settings', data);
  }
  @Action('home:videoId')
  videoId(state: IMap, data) {
    return state.set('videoId', data);
  }
}
