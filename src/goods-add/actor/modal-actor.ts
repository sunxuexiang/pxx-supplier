import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class ModalActor extends Actor {
  defaultState() {
    return {
      cateIds: [],
      cateId: [],
      imgCates: [],
      expandedKeys: ['0'],
      imgs: [],
      page: {},
      imageName: '',
      videoName: '',
      visible: false,
      tvisible: false,
      currentPage: 0,
      videoCurrentPage: 0,
      videoTotal: 0,
      total: 0,
      pageSize: 10,
      searchName: '',
      videoSearchName: '',
      chooseImgs: [],
      chooseVideos: [],
      imgVisible: false,
      previewImage: '',
      maxCount: 1,
      imgType: 0, // 0: spu图片  1: sku图片   2: 详情
      imgName:'',//变量名称
      skuId: '', // spu中该字段无
      videoList: [], //视频集合
      
    };
  }

  /**
   * 图片分类选中
   * @param state
   * @param cateIds
   */
  @Action('modal: cateIds')
  editCateIds(state, cateIds) {
    return state.set('cateIds', cateIds);
  }

  /**
   * 图片分类选择
   * @param state
   * @param cateId
   */
  @Action('modal: cateId')
  editCateId(state, cateId) {
    return state.set('cateId', cateId);
  }

  /**
   * 图片分类
   * @param state
   * @param imgCates
   */
  @Action('modal: imgCates')
  cates(state, cateList) {
    // 改变数据形态，变为层级结构
    const newDataList = cateList
      .filter((item) => item.get('cateParentId') == 0)
      .map((data) => {
        const children = cateList
          .filter((item) => item.get('cateParentId') == data.get('cateId'))
          .map((childrenData) => {
            const lastChildren = cateList.filter(
              (item) => item.get('cateParentId') == childrenData.get('cateId')
            );
            if (!lastChildren.isEmpty()) {
              childrenData = childrenData.set('children', lastChildren);
            }
            return childrenData;
          });

        if (!children.isEmpty()) {
          data = data.set('children', children);
        }
        return data;
      });
    return state.set('imgCates', newDataList);
  }

  /**
   * 图片集合
   * @param state
   * @param imgs
   */
  @Action('modal: imgs')
  imgs(state, imgs) {
    const chooseImgs = state.get('chooseImgs');
    return state
      .set(
        'imgs',
        imgs.get('content')
          ? imgs.get('content').map((img) => {
              img = img.set(
                'checked',
                chooseImgs.findIndex(
                  (i) => i.get('resourceId') === img.get('resourceId')
                ) >= 0
              );
              return img;
            })
          : []
      )
      .set('total', imgs.get('totalElements'));
  }

  /**
   * 初始化视频列表信息
   */
  @Action('modal: videos')
  initVideoList(state, videoList) {
    const chooseVideos = state.get('chooseVideos');
    return state
      .set(
        'videoList',
        videoList.get('content')
          ? videoList.get('content').map((img) => {
              img = img.set(
                'checked',
                chooseVideos.findIndex(
                  (i) => i.get('resourceId') === img.get('resourceId')
                ) >= 0
              );
              return img;
            })
          : []
      )
      .set('videoTotal', videoList.get('totalElements'));
  }

  /**
   * 分页
   * @param state
   * @param page
   */
  @Action('modal: page')
  page(state, page) {
    if (page.get('resourceType') == 0) {
      return state.set('currentPage', page.get('currentPage'));
    } else {
      return state.set('videoCurrentPage', page.get('currentPage'));
    }
  }

  // /**
  //  * 弹框关闭/展示
  //  * @param state
  //  */
  // @Action('modal: visible')
  // visible(state, { imgType, skuId }: { imgType: number; skuId: string }) {
  //   let imgs = state.get('imgs');

  //   return state
  //     .set('visible', !state.get('visible'))
  //     .set('imageName', '')
  //     .set('searchName', '')
  //     .set('chooseImgs', fromJS([]))
  //     .set(
  //       'imgs',
  //       imgs.map((img) => {
  //         img = img.set('checked', false);
  //         return img;
  //       })
  //     )
  //     .set('imgType', imgType)
  //     .set('skuId', skuId);
  // }

  /**
   * 弹框关闭/展示
   * @param state
   */
  @Action('modal: visible')
  visible(state, { imgType, skuId,imgName }: { imgType: number; skuId: string,imgName:string }) {
    if (imgType == 3) {
      let videoList = state.get('videoList');
      state = state
        .set('tvisible', !state.get('tvisible'))
        .set('chooseVideos', fromJS([]))
        .set(
          'videoList',
          videoList.map((video) => {
            video = video.set('checked', false);
            return video;
          })
        );
    } else {
      let imgs = state.get('imgs');

      state = state
        .set('visible', !state.get('visible'))
        .set('chooseImgs', fromJS([]))
        .set(
          'imgs',
          imgs.map((img) => {
            img = img.set('checked', false);
            return img;
          })
        );
    }

    return state
      .set('imageName', '')
      .set('searchName', '')
      .set('videoName', '')
      .set('videoSearchName', '')
      .set('imgType', imgType)
      .set('imgName', imgName)
      .set('skuId', skuId);
  }

  /**
   * 名称
   * @param state
   * @param {string} imageName
   */
  @Action('modal: search')
  search(state, imageName: string) {
    return state.set('imageName', imageName);
  }

  /**
   * 名称
   * @param state
   * @param {string} imageName
   */
  @Action('modal: videoSearch')
  videoSearch(state, videoName: string) {
    return state.set('videoName', videoName);
  }

  /**
   * 搜索
   * @param state
   * @param {string} searchName
   */
  @Action('modal: searchName')
  searchName(state, searchName: string) {
    return state.set('searchName', searchName);
  }

  /**
   * 搜索
   * @param state
   * @param {string} videoSearchName
   */
  @Action('modal: videoSearchName')
  videoSearchName(state, videoSearchName: string) {
    return state.set('videoSearchName', videoSearchName);
  }

  /**
   * 点击图片
   * @param state
   * @param {any} check
   * @param {any} img
   */
  @Action('modal: chooseImg')
  chooseImg(state, { check, img, chooseCount }) {
    let chooseImgs = state.get('chooseImgs');
    if (check) {
      if (chooseCount === 1) {
        chooseImgs = fromJS([img]);
      } else {
        chooseImgs = chooseImgs
          .filter((f) => f.get('resourceId') !== img.get('resourceId'))
          .push(img);
      }
    } else {
      chooseImgs = chooseImgs.filter(
        (f) => f.get('resourceId') !== img.get('resourceId')
      );
    }
    let imgs = state.get('imgs');
    return state.set('chooseImgs', chooseImgs).set(
      'imgs',
      imgs.map((img) => {
        img = img.set(
          'checked',
          chooseImgs.findIndex(
            (i) => i.get('resourceId') === img.get('resourceId')
          ) >= 0
        );
        return img;
      })
    );
  }

  /**
   * 点击选择视频
   */
  @Action('modal: checkVideo')
  check(state, { video, checked }) {
    let chooseVideos = state.get('chooseVideos');
    if (checked) {
      chooseVideos = fromJS([video]);
    } else {
      chooseVideos = fromJS([]);
    }
    let videoList = state.get('videoList');

    return state.set('chooseVideos', chooseVideos).set(
      'videoList',
      videoList.map((videoItem) => {
        videoItem = videoItem.set(
          'checked',
          chooseVideos.findIndex(
            (i) => i.get('resourceId') === videoItem.get('resourceId')
          ) >= 0
        );
        return videoItem;
      })
    );
  }

  /**
   * 放大还原图片
   * @param state
   * @param imgUrl
   */
  @Action('modal: imgVisible')
  clickImg(state, imgUrl: string) {
    const imgVisible = state.get('imgVisible');
    return state.set('imgVisible', !imgVisible).set('previewImage', imgUrl);
  }

  /**
   * 清除选中的图片集合
   * @param state
   */
  @Action('modal: cleanChooseImg')
  cleanChooseImg(state) {
    let imgs = state.get('imgs');
    return state.set('chooseImgs', fromJS([])).set(
      'imgs',
      imgs.map((i) => {
        i = i.set('checked', false);
        return i;
      })
    );
  }

  /**
   * 清除选中的视频选项
   * @param state
   */
  @Action('modal: cleanChooseVideo')
  cleanChooseVideo(state) {
    let videoList = state.get('videoList');
    return state.set('chooseVideos', fromJS([])).set(
      'videoList',
      videoList.map((i) => {
        i = i.set('checked', false);
        return i;
      })
    );
  }
  /**
   * 最大图片数量
   * @param state
   * @param maxCount
   */
  @Action('modal: maxCount')
  setMaxCount(state, maxCount) {
    return state.set('maxCount', maxCount);
  }

  /**
   * 选中上传成功的图片
   * @param state
   * @param successImgs
   */
  @Action('modal: chooseImgs')
  chooseImgs(state, successImgs) {
    let imgs = state.get('imgs');
    return state.set('chooseImgs', successImgs).set(
      'imgs',
      imgs.map((img) => {
        img = img.set(
          'checked',
          successImgs.findIndex(
            (i) => i.get('resourceId') === img.get('resourceId')
          ) >= 0
        );
        return img;
      })
    );
  }

  /**
   * 选中上传成功的图片
   * @param state
   * @param successImgs
   */
  @Action('modal: chooseVideos')
  chooseVideos(state, successVideos) {
    let videoList = state.get('videoList');
    return state.set('chooseVideos', successVideos).set(
      'videoList',
      videoList.map((item) => {
        item = item.set(
          'checked',
          successVideos.findIndex(
            (i) => i.get('resourceId') === item.get('resourceId')
          ) >= 0
        );
        return item;
      })
    );
  }
}
