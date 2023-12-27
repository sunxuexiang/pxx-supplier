import { Actor, Action, IMap } from 'plume2';
export default class VideoActor extends Actor {
  defaultState() {
    return {
      //视频列表
      videoList: [],
      //当前的数据总数
      total: 0,
      //当前的分页条数
      pageSize: 8,
      // 当前页数，从1开始
      currentPage: 1,
      //分类id
      id: '',
      //上传视频弹框显示标志
      uploadVisible: false,
      //上传的视频列表
      videos: [],
      // 视频搜索条件
      resourceName: ''
    };
  }

  /**
   * 初始化视频列表信息
   */
  @Action('videoActor: init')
  init(state, videoList) {
    return state
      .set('videoList', videoList.get('content'))
      .set('total', videoList.get('totalElements'));
  }

  /**
   * 更新当前页码
   */
  @Action('videoActor: page')
  page(state, page: IMap) {
    return state.set('currentPage', page.get('currentPage'));
  }

  /**
   * 显示/关闭-上传视频弹窗
   */
  @Action('videoActor: showUploadVideoModal')
  showUpload(state, needClear: boolean) {
    return state.set('uploadVisible', needClear);
  }

  /**
   * 设置视频搜索条件
   */
  @Action('videoActor: editCateId')
  editCateId(state, id) {
    return state.set('id', id);
  }

  /**
   * 设置当前选中分类
   */
  @Action('videoActor: resourceName')
  resourceName(state, resourceName) {
    return state.set('resourceName', resourceName);
  }
}
