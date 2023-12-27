import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';

import {
  getCateList,
  fetchImages,
  addCate,
  moveImage,
  deleteImage,
  updateImage
} from './webapi';
import CateActor from './actor/cate-actor';
import ImageActor from './actor/image-actor';
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
    return [new CateActor(), new ImageActor()];
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

    //2.查询图片分页信息
    const imageList: any = await fetchImages({
      pageNum,
      pageSize,
      cateId: cateId,
      resourceType: 0
    });
    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.selectImageCate(cateId);
        this.dispatch('cateActor: init', fromJS(cateList.res)); //初始化分类列表
        this.dispatch('imageActor: init', fromJS(imageList.res.context)); //初始化图片分页列表
        this.dispatch('imageActor: page', fromJS({ currentPage: pageNum + 1 }));
        this.dispatch('cateActor: closeCateModal');
      });
    } else {
      message.error(imageList.res.message);
    }
  };

  /**
   * 查询图片信息分页列表
   */
  queryImagePage = async (
    { pageNum, pageSize } = { pageNum: 0, pageSize: 10 }
  ) => {
    const cateListIm = this.state().get('cateAllList');
    const cateId = this.state().get('cateId'); //之前选中的分类
    //查询图片分页信息
    const imageList: any = await fetchImages({
      pageNum,
      pageSize,
      resourceName: this.state().get('imageName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 0
    });

    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('imageActor: init', fromJS(imageList.res.context)); //初始化图片分页列表
        this.dispatch('imageActor: page', fromJS({ currentPage: pageNum + 1 }));
        this.dispatch('cateActor: closeCateModal');
      });
    } else {
      message.error(imageList.res.message);
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
    this.dispatch('imageActor: checkAll', checked);
  };

  /**
   * 单选
   * @param index
   * @param checked
   */
  onChecked = (index: number, checked: boolean) => {
    this.dispatch('imageActor: check', { index, checked });
  };

  /**
   * 显示/关闭添加图片分类框
   */
  showCateModal = (type: boolean) => {
    this.dispatch('cateActor: showCateModal', type);
  };

  /**
   * 显示/关闭移动图片框
   */
  showMoveImageModal = (type: boolean) => {
    this.dispatch('imageActor: showMoveImageModal', type);
  };

  /**
   * 显示/关闭上传图片框
   */
  showUploadImageModal = (type: boolean) => {
    this.dispatch('imageActor: showUploadImageModal', type);
  };

  /**
   * 编辑-添加分类表单
   */
  editFormData = (params: IMap) => {
    this.dispatch('cateActor: editFormData', params);
  };

  /**
   * 修改图片名称搜索项
   */
  search = async (imageName: string) => {
    this.dispatch('imageActor: search', imageName);
  };

  /**
   * 选中某个分类
   * @param cateId
   */
  selectImageCate = (cateId) => {
    if (cateId) {
      this.dispatch('cateActor: editCateId', List.of(cateId.toString())); //选中的分类id List
      this.dispatch('imageActor: editCateId', cateId.toString()); //选中的分类id
    } else {
      this.dispatch('cateActor: editCateId', List()); //全部
      this.dispatch('imageActor: editCateId', ''); //全部
    }
  };

  /**
   * 上传图片-选择分类-点击确认后,自动展开对应的图片分类
   * @param cateId
   */
  autoExpandImageCate = (cateId) => {
    if (cateId) {
      this.dispatch('cateActor: editCateId', List.of(cateId.toString())); //选中的分类id List
      this.dispatch(
        'cateActor: editExpandedKeys',
        this._getExpandedCateIdList(this.state().get('cateAllList'), cateId)
      ); //需要展开的分类
      this.dispatch('imageActor: editCateId', cateId.toString()); //选中的分类id
    }
  };

  /**
   * 修改某个图片名称信息
   */
  editImage = async (imageId: string, imageName: string) => {
    const image = { resourceName: imageName, resourceId: imageId };
    const result = (await updateImage(image)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('修改名称成功');
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 转移图片的图片分类
   */
  move = async (cateId: string) => {
    const imageIds = this.state()
      .get('imageList')
      .filter((v) => {
        return v.get('checked') == true;
      })
      .map((v) => {
        return v.get('resourceId');
      })
      .toJS();
    const result: any = await moveImage({
      cateId: cateId,
      resourceIds: imageIds
    });

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('移动成功');
      this.showMoveImageModal(false);
      this.queryImagePage();
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
   * 删除图片
   */
  doDelete = async () => {
    const imageIds = this.state()
      .get('imageList')
      .filter((v) => {
        return v.get('checked') == true;
      })
      .map((v) => {
        return v.get('resourceId');
      })
      .toJS();

    const result = (await deleteImage(imageIds)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('删除成功');
      this.queryImagePage();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 显示/关闭下载图片框
   */
  showDownloadImageModal = (type: boolean) => {
    this.dispatch('imageActor: showDownload', type);
  };
}
