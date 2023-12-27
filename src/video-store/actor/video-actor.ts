import { Actor, Action, IMap } from 'plume2';
export default class GoodsActor extends Actor {
  defaultState() {
    return {
      //视频列表
      videoList: [],
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
      //上传视频弹框显示标志
      uploadVisible: false,
      //上传的视频列表
      videos: [],
      //搜索的视频名称
      videoName: ''
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
   * 全选
   */
  @Action('videoActor: checkAll')
  checkAll(state, checked: boolean) {
    return state.update('videoList', (dataList) => {
      return dataList.map((v) => v.set('checked', checked));
    });
  }

  /**
   * 单选
   */
  @Action('videoActor: check')
  check(state, { index, checked }) {
    return state.setIn(['videoList', index, 'checked'], checked);
  }

  /**
   * 设置视频名称搜索项
   */
  @Action('videoActor: search')
  changeField(state, value) {
    return state.set('videoName', value);
  }

  /**
   * 显示/关闭-移动视频弹窗
   */
  @Action('videoActor: showMoveVideoModal')
  showMove(state, needClear: boolean) {
    return state.set('moveVisible', needClear);
  }

  /**
   * 显示/关闭-上传视频弹窗
   */
  @Action('videoActor: showUploadVideoModal')
  showUpload(state, needClear: boolean) {
    return state.set('uploadVisible', needClear);
  }

  /**
   * 设置当前选中分类
   */
  @Action('videoActor: editCateId')
  editCateId(state, cateId) {
    return state.set('cateId', cateId);
  }
}
