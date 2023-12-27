import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      images: [],
      images1: [],
      images2: [],
      images3: [],
      images4: []
    };
  }

  @Action('imageActor: editImages')
  editImages(state, images) {
    console.log(images.toJS(), 'asdasd');

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
  @Action('imageActor: editImages2')
  editImages2(state, images1) {
    return state.set(
      'images2',
      images1 instanceof Array ? fromJS(images1) : images1
    );
  }
  @Action('imageActor: editImages3')
  editImages3(state, images1) {
    return state.set(
      'images3',
      images1 instanceof Array ? fromJS(images1) : images1
    );
  }
  @Action('imageActor: editImages4')
  editImages4(state, images1) {
    return state.set(
      'images4',
      images1 instanceof Array ? fromJS(images1) : images1
    );
  }
}
