import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';

import { getCateList, fetchVideos, deleteVideo, updateVideo } from './webapi';
import CateActor from './actor/cate-actor';
import VideoActor from './actor/video-actor';
import DetailActor from './actor/detail-actor';
import { message } from 'antd';
import { Const } from 'qmkit';
import _ from 'lodash';
export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new CateActor(), new VideoActor(), new DetailActor()];
  }

  formatToTree = (cateParentId, list) => {
    const result = [];
    list.forEach((item) => {
      if (item.cateParentId === cateParentId) {
        const children = this.formatToTree(item.cateId, list);
        if (children.length > 0) {
          item.children = children;
        }
        result.push(item);
      }
    });
    return result;
  };

  findDefault = (list) => {
    let id = '';
    if (list[0].children) {
      id = this.findDefault(list[0].children);
    } else {
      id = list[0].cateId;
    }
    return id;
  };

  init = async (menuId?) => {
    //1.查询店铺分类列表
    const list: any = await getCateList({ cateType: 1 });
    if (list && list.res.code !== Const.SUCCESS_CODE) {
      message.error(list ? list.res.message : '');
      return;
    }
    let listData = list.res?.context?.videoResourceCateVOList || [];
    listData = listData.filter((item) => item.isDefault !== 1);
    const cateList = this.formatToTree('0', listData);
    //找默认分类
    let defaultId = '';
    if (cateList && cateList[0]) {
      defaultId = this.findDefault(cateList);
    }
    this.transaction(() => {
      this.dispatch('cateActor: cateAllList', fromJS(listData));
      this.dispatch('cateActor: init', fromJS(cateList)); //初始化分类列表
      this.selectVideoCate(defaultId);
      this.dispatch(
        'cateActor: editExpandedKeys',
        this._getExpandedCateIdList(defaultId)
      );
    });
  };

  /**
   * 根据需要展开的分类id,找寻自己的所有父级
   */
  _getExpandedCateIdList = (cateId, parentList?, parentIds?) => {
    let list = this.state()
      .get('expandedKeys')
      .toJS();
    let newList = [];
    const cateList = this.state()
      .get('cateList')
      .toJS();
    const currentList = parentList || cateList;
    if (cateId) {
      currentList.forEach((item) => {
        if (item.cateId === cateId) {
          newList = newList.concat(
            parentIds ? _.uniq(parentIds.concat(list)) : []
          );
          return;
        } else if (item.children) {
          newList = newList.concat(
            this._getExpandedCateIdList(
              cateId,
              item.children,
              (parentIds || []).concat([item.cateId])
            )
          );
        }
      });
    }
    if (parentList) {
      return newList;
    }
    return fromJS(list.concat(newList));
  };

  getAllCateId = (cateId, list) => {
    let result = [];
    list.forEach((item) => {
      if (item.cateId === cateId) {
        if (item.children) {
          item.children.forEach((cd) => {
            result = result.concat(this.getAllCateId(cd.cateId, item.children));
          });
        } else {
          result.push(item.cateId);
        }
      } else if (item.children) {
        result = result.concat(this.getAllCateId(cateId, item.children));
      }
    });
    return result;
  };

  // 根据选中的id获取tablist
  getTabListById = (id) => {
    const cateList = this.state()
      .get('cateList')
      .toJS();
    let result = [];
    cateList.forEach((item) => {
      let flag = false;
      if (item.id === id) {
        flag = true;
      }
      if (item.children) {
        item.children.forEach((cd) => {
          if (cd.id === id) {
            flag = true;
          }
        });
      }
      if (flag) {
        result.push({ name: '全部', key: item.id });
        item.children.forEach((cd) => {
          if (cd.uploadFlag && cd.uploadFlag > 0) {
            result.push({ name: cd.title, key: cd.id });
          }
        });
        return;
      }
    });
    return result;
  };

  /**
   * 查询视频信息分页列表
   */
  queryVideoPage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 8 },
    justGetData?
  ) => {
    const id = this.state().get('defaultCheckedKey'); //之前选中的分类
    const resourceName = this.state().get('resourceName');

    const cateList = this.state()
      .get('cateList')
      .toJS();
    //查询视频分页信息
    const params: any = {
      pageNum,
      pageSize,
      cateIds: [],
      resourceType: 1
    };
    if (resourceName) {
      params.resourceName = resourceName;
    } else {
      params.cateIds = this.getAllCateId(id, cateList);
    }
    const videoList: any = await fetchVideos(params);

    if (videoList.res.code === Const.SUCCESS_CODE) {
      const context = videoList.res.context;
      context.content.forEach((item) => {
        item.resourceName = item.resourceName.replace('.mp4', '');
      });
      if (justGetData) {
        return context;
      }
      this.transaction(() => {
        this.dispatch('videoActor: init', fromJS(context)); //初始化视频分页列表
        this.dispatch('videoActor: page', fromJS({ currentPage: pageNum + 1 }));
        if (resourceName) {
          this.dispatch('cateActor: editCateId', '');
        } else {
          this.dispatch('videoActor: resourceName', '');
        }
      });
    } else {
      message.error(videoList.res.message);
    }
  };

  // 搜索条件change
  searchChange = (e) => {
    this.dispatch('videoActor: resourceName', e.target.value);
  };

  /**
   * 选中某个分类
   * @param id
   */
  selectVideoCate = (id) => {
    this.transaction(() => {
      this.dispatch('cateActor: editCateId', id); //选中的分类id
      const tabList = this.getTabListById(id);
      this.dispatch('videoActor: editTabList', fromJS(tabList));
      this.dispatch('videoActor: editTabList', fromJS(tabList));
      this.dispatch('videoActor: resourceName', '');
      this.closeVideoDetail();
      this.queryVideoPage();
    });
  };

  //展开/收起分类
  onExpandCate = (expandedKeys) => {
    this.dispatch('cateActor: editExpandedKeys', fromJS(expandedKeys));
  };

  //打开视频详情
  showVideoDetail = (data, index) => {
    const videoList = this.state()
      .get('videoList')
      .toJS();
    const total = this.state().get('total');
    const pageSize = this.state().get('pageSize');
    const currentPage = this.state().get('currentPage');
    let preData;
    let nextData;
    if (index === 0 && currentPage === 1) {
      preData = null;
    } else if (index === 0) {
      const newList: any = this.queryVideoPage(
        { pageNum: currentPage - 2, pageSize: 8 },
        true
      );
      preData = newList[newList.length - 1];
    } else {
      preData = videoList[index - 1];
    }
    if (index === videoList.length - 1 && currentPage * pageSize === total) {
      nextData = null;
    } else if (index === videoList.length - 1) {
      const newList: any = this.queryVideoPage(
        { pageNum: currentPage, pageSize: 8 },
        true
      );
      nextData = newList[0];
    } else {
      nextData = videoList[index + 1];
    }
    this.transaction(() => {
      this.dispatch('detailActor: visible', true);
      this.dispatch('detailActor: update', {
        key: 'currentData',
        val: fromJS(data)
      });
      this.dispatch('detailActor: update', {
        key: 'preData',
        val: preData ? fromJS(preData) : null
      });
      this.dispatch('detailActor: update', {
        key: 'nextData',
        val: nextData ? fromJS(nextData) : null
      });
    });
  };

  //关闭视频详情
  closeVideoDetail = () => {
    this.transaction(() => {
      this.dispatch('detailActor: visible', false);
      this.dispatch('detailActor: update', { key: 'currentData', val: null });
      this.dispatch('detailActor: update', { key: 'preData', val: null });
      this.dispatch('detailActor: update', { key: 'nextData', val: null });
    });
  };

  //查看上一条视频
  showPreDetail = () => {
    const newCurrent = this.state().get('preData');
    const newNext = this.state().get('currentData');
    const videoList = this.state()
      .get('videoList')
      .toJS();
    const currentPage = this.state().get('currentPage');
    let currentIndex;
    let newPre = null;
    videoList.forEach((item, index) => {
      if (item.resourceId === newNext.get('resourceId')) {
        currentIndex = index;
      }
    });
    if (currentIndex <= 1 && currentPage - 2 >= 0) {
      const newList: any = this.queryVideoPage({
        pageNum: currentPage - 2,
        pageSize: 8
      });
      newPre = newList[newList.length - 2 + currentIndex];
    } else {
      newPre = videoList[currentIndex - 2];
    }
    this.transaction(() => {
      this.dispatch('detailActor: update', {
        key: 'currentData',
        val: newCurrent
      });
      this.dispatch('detailActor: update', {
        key: 'preData',
        val: newPre ? fromJS(newPre) : null
      });
      this.dispatch('detailActor: update', { key: 'nextData', val: newNext });
    });
  };

  //查看下一条视频
  showNextDetail = () => {
    const newCurrent = this.state().get('nextData');
    const newPre = this.state().get('currentData');
    const videoList = this.state()
      .get('videoList')
      .toJS();
    const currentPage = this.state().get('currentPage');
    const total = this.state().get('total');
    const pageSize = this.state().get('pageSize');
    let currentIndex;
    let newNext = null;
    videoList.forEach((item, index) => {
      if (item.resourceId === newPre.get('resourceId')) {
        currentIndex = index;
      }
    });
    if (
      videoList.length - 1 - currentIndex <= 1 &&
      currentPage * pageSize < total
    ) {
      const newList: any = this.queryVideoPage({
        pageNum: currentPage,
        pageSize: 8
      });
      newNext = newList[1 - (videoList.length - 1 - currentIndex)];
    } else {
      newNext = videoList[currentIndex + 2];
    }
    this.dispatch('detailActor: update', {
      key: 'currentData',
      val: newCurrent
    });
    this.dispatch('detailActor: update', { key: 'preData', val: newPre });
    this.dispatch('detailActor: update', {
      key: 'nextData',
      val: newNext ? fromJS(newNext) : null
    });
  };
}
