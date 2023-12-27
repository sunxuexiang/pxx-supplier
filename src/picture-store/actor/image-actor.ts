import { Actor, Action, IMap } from 'plume2';
export default class GoodsActor extends Actor {
  defaultState() {
    return {
      //图片列表
      imageList: [],
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 10,
      // 当前页数，从1开始
      currentPage: 1,
      //分类id
      cateId: '',
      //移动弹框显示标志
      moveVisible: false,
      //上传图片弹框显示标志
      uploadVisible: false,
      //上传的图片列表
      images: [],
      //搜索的图片名称
      imageName: '',
      //下载图片弹框显示标志
      downloadVisible: false
    };
  }

  /**
   * 初始化图片列表信息
   */
  @Action('imageActor: init')
  init(state, imageList) {
    return state
      .set('imageList', imageList.get('content'))
      .set('total', imageList.get('totalElements'));
  }

  /**
   * 更新当前页码
   */
  @Action('imageActor: page')
  page(state, page: IMap) {
    return state.set('currentPage', page.get('currentPage'));
  }

  /**
   * 全选
   */
  @Action('imageActor: checkAll')
  checkAll(state, checked: boolean) {
    return state.update('imageList', (dataList) => {
      return dataList.map((v) => v.set('checked', checked));
    });
  }

  /**
   * 单选
   */
  @Action('imageActor: check')
  check(state, { index, checked }) {
    return state.setIn(['imageList', index, 'checked'], checked);
  }

  /**
   * 设置图片名称搜索项
   */
  @Action('imageActor: search')
  changeField(state, value) {
    return state.set('imageName', value);
  }

  /**
   * 显示/关闭-移动图片弹窗
   */
  @Action('imageActor: showMoveImageModal')
  showMove(state, needClear: boolean) {
    return state.set('moveVisible', needClear);
  }

  /**
   * 显示/关闭-上传图片弹窗
   */
  @Action('imageActor: showUploadImageModal')
  showUpload(state, needClear: boolean) {
    return state.set('uploadVisible', needClear);
  }

  /**
   * 显示/关闭-下载图片弹窗
   */
  @Action('imageActor: showDownload')
  showDownload(state, needClear: boolean) {
    return state.set('downloadVisible', needClear);
  }

  /**
   * 设置当前选中分类
   */
  @Action('imageActor: editCateId')
  editCateId(state, cateId) {
    return state.set('cateId', cateId);
  }
}
