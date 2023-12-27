import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class ImageActor extends Actor {
  defaultState() {
    return {
      images: [],
      salesPromotionImages: [],
      video: {},
      canvasModalVisible: false, //合图
      goodsImg: '',
      salesPromotionImg: '',
      synthesisImages: [] //合成的图片
    };
  }

  @Action('imageActor: editImages')
  editImages(state, images) {
    return state.set(
      'images',
      images instanceof Array ? fromJS(images) : images
    );
  }

  @Action('salesPromotionImageActor: editImages')
  setSalesPromotioneditImages(state, images) {
    return state.set(
      'salesPromotionImages',
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
    let obj = state
      .get('images')
      .filter((i) => i.get('uid') == imageId)
      .toJS()[0];
    if (obj.artworkUrl == state.get('goodsImg')) {
      return state
        .set(
          'images',
          state.get('images').filter((i) => i.get('uid') !== imageId)
        )
        .set('goodsImg', '');
    } else {
      console.log(obj,'objob')
      return state.set(
        'images',
        state.get('images').filter((i) => i.get('uid') !== imageId)
      );
    }
  }

  /**
   * 移除图片(促销)
   * @param state
   * @param {number} imageId
   */
  @Action('salesPromotionImageActor: remove')
  setSalesPromotionremoveImg(state, imageId: number) {
    let obj = state
      .get('salesPromotionImages')
      .filter((i) => i.get('uid') == imageId)
      .toJS()[0];
    if (obj.artworkUrl == state.get('salesPromotionImg')) {
      return state
        .set(
          'salesPromotionImages',
          state
            .get('salesPromotionImages')
            .filter((i) => i.get('uid') !== imageId)
        )
        .set('salesPromotionImg', '');
    } else {
      return state.set(
        'salesPromotionImages',
        state
          .get('salesPromotionImages')
          .filter((i) => i.get('uid') !== imageId)
      );
    }
  }

  @Action('imageActor: editVideo')
  editVideo(state, video) {
    return state.set('video', video);
  }

  @Action('imageActor: deleteVideo')
  deleteVideo(state: IMap) {
    return state.set('video', {});
  }

  @Action('canvasActor: canvasModalVisible')
  setCanvasModalVisible(state, val) {
    return state.set('canvasModalVisible', val);
  }

  @Action('imageActor: imgs')
  setEditImgss(state: IMap, { key, val }) {
    return state.set(key, val);
  }
}
