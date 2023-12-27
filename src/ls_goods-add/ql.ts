import { QL } from 'plume2';
import { Map, fromJS } from 'immutable';
import { IMap, IList } from 'typings/globalType';

const goodsRequired: IMap = Map({
  goodsName: '请填写商品名称',
  cateId: '请选择分类',
  goodsNo: '请填写SPU编码'
});

/**
 *
 */
export const goodsStatusHelpMapQL = QL('goodsStatusHelpMapQL', [
  'goods',
  (goods: IMap) => {
    let statusMap = Map();
    let helpMap = Map();

    goods.forEach((item, key) => {
      if (goodsRequired.has(key) && !item) {
        statusMap = statusMap.set(key, 'error');
        helpMap = helpMap.set(key, goodsRequired.get(key));
      }
    });

    return Map({ statusMap, helpMap });
  }
]);

/**
 * 获取还可以选择的图片数量
 * @type {plume2.QueryLang}
 */
export const choosedImgCountQL = QL('choosedImgCountQL', [
  'images',
  'maxCount',
  'imgType',
  (images: IList, maxCount: number, imgType: number) => {
    // imgType 等于2 表示此处上传为商品详情, 不限制总数, 每次均可上传10张
    if (imgType == 2) {
      return 10;
    }
    // 如果为1 表示为sku处图片上传, 只可以上传一张图片, 最大量为1,
    // 此处为特殊处理
    if (maxCount == 1) {
      return 1;
    }
    return maxCount - (images || fromJS([])).size;
  }
]);

/**
 * 点击图片的数量(点击并选中的)
 * @type {plume2.QueryLang}
 */
export const clickImgsCountQL = QL('clickImgsCountQL', [
  'chooseImgs',
  (imgs: IList) => {
    return (imgs || fromJS([])).size;
  }
]);

/**
 * 点击视频的数量(点击并选中的)
 * @type {plume2.QueryLang}
 */
export const clickVideosCountQL = QL('clickVideosCountQL', [
  'chooseVideos',
  (videos: IList) => {
    return (videos || fromJS([])).size;
  }
]);

/**
 * 是否可以继续选中图片
 * @type {plume2.QueryLang}
 */
export const clickEnabledQL = QL('clickEnabledQL', [
  choosedImgCountQL,
  clickImgsCountQL,
  (chooseCount, clickImgs) => chooseCount > clickImgs
]);
