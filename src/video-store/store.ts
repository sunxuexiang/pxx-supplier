import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';

import {
  getCateList,
  fetchVideos,
  addCate,
  moveVideo,
  deleteVideo,
  updateVideo
} from './webapi';
import CateActor from './actor/cate-actor';
import VideoActor from './actor/video-actor';
import { IMap } from 'typings/globalType';
import { List } from 'immutable';
import { message } from 'antd';
import { Const } from 'qmkit';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new CateActor(), new VideoActor()];
  }

  /**
   * 初始化
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    //1.查询店铺分类列表
    const cateList: any = await getCateList();
    const cateListIm = fromJS(cateList.res);
    const cateId = cateListIm
      .find((item) => item.get('isDefault') == 1)
      .get('cateId'); //找默认分类

    //2.查询视频分页信息
    const videoList: any = await fetchVideos({
      pageNum,
      pageSize,
      cateId: cateId,
      resourceType: 1
    });
    if (videoList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.selectVideoCate(cateId);
        this.dispatch('cateActor: init', fromJS(cateList.res)); //初始化分类列表
        this.dispatch('videoActor: init', fromJS(videoList.res.context)); //初始化视频分页列表
        this.dispatch('videoActor: page', fromJS({ currentPage: pageNum + 1 }));
        this.dispatch('cateActor: closeCateModal');
      });
    } else {
      message.error(videoList.res.message);
    }
  };

  /**
   * 查询视频信息分页列表
   */
  queryVideoPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    const cateListIm = this.state().get('cateAllList');
    const cateId = this.state().get('cateId'); //之前选中的分类
    //查询视频分页信息
    const videoList: any = await fetchVideos({
      pageNum,
      pageSize,
      resourceName: this.state().get('videoName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 1
    });

    if (videoList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('videoActor: init', fromJS(videoList.res.context)); //初始化视频分页列表
        this.dispatch('videoActor: page', fromJS({ currentPage: pageNum + 1 }));
        this.dispatch('cateActor: closeCateModal');
      });
    } else {
      message.error(videoList.res.message);
    }
  };

  /**
   * 根据需要展开的分类id,找寻自己的所有父级
   */
  _getExpandedCateIdList = (cateListIm, cateId) => {
    let cateIdListIm = this.state().get('expandedKeys');
    if (cateId) {
      const selfCate = cateListIm.find((item) => item.get('cateId') == cateId); //找到自己
      if (selfCate && selfCate.get('cateParentId')) {
        const parentCate = cateListIm.find(
          (item) => item.get('cateId') == selfCate.get('cateParentId')
        ); //找到父级
        if (parentCate) {
          if (!cateIdListIm.has(parentCate.get('cateId').toString())) {
            cateIdListIm = cateIdListIm.push(
              parentCate.get('cateId').toString()
            ); //加入展开的分类中
          }
          const parentPareCate = cateListIm.find(
            (item) => item.get('cateId') == parentCate.get('cateParentId')
          ); //找到父级的父级
          if (parentPareCate) {
            if (!cateIdListIm.has(parentPareCate.get('cateId').toString())) {
              cateIdListIm = cateIdListIm.push(
                parentPareCate.get('cateId').toString()
              ); //加入展开的分类中
            }
          }
        }
      }
    }
    return cateIdListIm;
  };

  /**
   * 根据分类id,找寻自己+所有子类List
   */
  _getCateIdsList = (cateListIm, cateId) => {
    let cateIdList = new Array();
    if (cateId) {
      cateIdList.push(cateId);
      const secondCateList = cateListIm.filter(
        (item) => item.get('cateParentId') == cateId
      ); //找第二层子节点
      if (secondCateList && secondCateList.size > 0) {
        cateIdList = cateIdList.concat(
          secondCateList.map((item) => item.get('cateId')).toJS()
        );
        const thirdCateList = cateListIm.filter(
          (item) =>
            secondCateList.filter(
              (sec) => item.get('cateParentId') == sec.get('cateId')
            ).size > 0
        ); //找第三层子节点
        if (thirdCateList && thirdCateList.size > 0) {
          cateIdList = cateIdList.concat(
            thirdCateList.map((item) => item.get('cateId')).toJS()
          );
        }
      }
    }
    return cateIdList;
  };

  /**
   * 设置需要展开的分类
   */
  onExpandCate = (expandedKeys) => {
    this.dispatch('cateActor: editExpandedKeys', fromJS(expandedKeys)); //需要展开的分类
  };

  /**
   * 全选
   * @param checked
   */
  onCheckedAll = (checked: boolean) => {
    this.dispatch('videoActor: checkAll', checked);
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onChecked = (index: number, checked: boolean) => {
    this.dispatch('videoActor: check', { index, checked });
  };

  /**
   * 显示/关闭添加视频分类框
   */
  showCateModal = (type: boolean) => {
    this.dispatch('cateActor: showCateModal', type);
  };

  /**
   * 显示/关闭移动视频框
   */
  showMoveVideoModal = (type: boolean) => {
    this.dispatch('videoActor: showMoveVideoModal', type);
  };

  /**
   * 显示/关闭上传视频框
   */
  showUploadVideoModal = (type: boolean) => {
    this.dispatch('videoActor: showUploadVideoModal', type);
  };

  /**
   * 编辑-添加分类表单
   */
  editFormData = (params: IMap) => {
    this.dispatch('cateActor: editFormData', params);
  };

  /**
   * 修改视频名称搜索项
   */
  search = async (videoName: string) => {
    this.dispatch('videoActor: search', videoName);
  };

  /**
   * 选中某个分类
   * @param cateId
   */
  selectVideoCate = (cateId) => {
    if (cateId) {
      this.dispatch('cateActor: editCateId', List.of(cateId.toString())); //选中的分类id List
      this.dispatch('videoActor: editCateId', cateId.toString()); //选中的分类id
    } else {
      this.dispatch('cateActor: editCateId', List()); //全部
      this.dispatch('videoActor: editCateId', ''); //全部
    }
  };

  /**
   * 上传视频-选择分类-点击确认后,自动展开对应的视频分类
   * @param cateId
   */
  autoExpandVideoCate = (cateId) => {
    if (cateId) {
      this.dispatch('cateActor: editCateId', List.of(cateId.toString())); //选中的分类id List
      this.dispatch(
        'cateActor: editExpandedKeys',
        this._getExpandedCateIdList(this.state().get('cateAllList'), cateId)
      ); //需要展开的分类
      this.dispatch('videoActor: editCateId', cateId.toString()); //选中的分类id
    }
  };

  /**
   * 修改某个视频名称信息
   */
  editVideo = async (videoId: string, videoName: string) => {
    const video = { resourceName: videoName, resourceId: videoId };
    const result = (await updateVideo(video)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('修改名称成功');
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 转移视频的视频分类
   */
  move = async (cateId: string) => {
    const videoIds = this.state()
      .get('videoList')
      .filter((v) => {
        return v.get('checked') == true;
      })
      .map((v) => {
        return v.get('resourceId');
      })
      .toJS();
    const result: any = await moveVideo({
      cateId: cateId,
      resourceIds: videoIds
    });

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('移动成功');
      this.showMoveVideoModal(false);
      this.queryVideoPage();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 添加分类
   */
  doAdd = async () => {
    const formData = this.state().get('formData');
    const result: any = await addCate(formData);

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('新增分类成功!');
      this.showCateModal(false);
      const cateList: any = await getCateList();
      this.dispatch('cateActor: init', fromJS(cateList.res)); //初始化分类列表
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 删除视频
   */
  doDelete = async (videoId: string) => {
    const videoIds = this.state()
      .get('videoList')
      .filter((v) => {
        return v.get('resourceId') == videoId;
      })
      .map((v) => {
        return v.get('resourceId');
      })
      .toJS();

    const result = (await deleteVideo(videoIds)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      this.queryVideoPage();
    } else {
      message.error(result.res.message);
    }
  };
}
