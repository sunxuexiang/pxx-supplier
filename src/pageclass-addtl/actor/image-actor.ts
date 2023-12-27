import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      images: [],
      images1: []
    };
  }

  @Action('imageActor: editImages')
  editImages(state, images) {
    return state.set(
      'images',
      images instanceof Array ? fromJS(images) : images
    );
  }
  @Action('imageActor: editImages1')
  editImages1(state, images1) {
    return state.set(
      'images1',
      images1 instanceof Array ? fromJS(images1) : images1
    );
  }
}
