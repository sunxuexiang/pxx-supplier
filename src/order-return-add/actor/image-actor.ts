import { Actor, Action } from 'plume2';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      images: []
    };
  }

  @Action('imageActor: editImages')
  editImages(state, images) {
    return state.set('images', images);
  }
}
