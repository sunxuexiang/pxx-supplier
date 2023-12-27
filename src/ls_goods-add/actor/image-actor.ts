import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      images: [],
      video: {}
    };
  }

  @Action('imageActor: editImages')
  editImages(state, images) {
    return state.set(
      'images',
      images instanceof Array ? fromJS(images) : images
    );
  }

  /**
   * 移除图片
   * @param state
   * @param {number} imageId
   */
  @Action('imageActor: remove')
  removeImg(state, imageId: number) {
    return state.set(
      'images',
      state.get('images').filter((i) => i.get('uid') !== imageId)
    );
  }

  @Action('imageActor: editVideo')
  editVideo(state, video) {
    return state.set('video', video);
  }

  @Action('imageActor: deleteVideo')
  deleteVideo(state: IMap) {
    return state.set('video', {});
  }
}
