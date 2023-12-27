import { IOptions, Store } from 'plume2';
import { fromJS, List } from 'immutable';
import { IList, IMap } from 'typings/globalType';
import PicActor from './actor/pic-actor';
import EditorActor from './actor/editor-actor';
import EquitiesActor from './actor/equities-actor';
import CouponActor from './actor/coupon-actor';
import update from 'immutability-helper';
import * as webApi from './webapi';
import {
  addEquities,
  deleteEquities,
  dragSort,
  getEquitiesList,
  modifyEquities
} from './webapi';
import { Const } from 'qmkit';
import { message } from 'antd';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new EquitiesActor(),
      new PicActor(),
      new EditorActor(),
      new CouponActor()
    ];
  }

  /**
   * 初始化
   */
  init = async () => {
    const { res } = (await getEquitiesList()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch(
        'equities: init',
        fromJS(res.context.customerLevelRightsVOList)
      );
    } else {
      message.error(message);
    }
  };

  /**
   * 显示添加框
   */
  modal = (isAdd) => {
    this.dispatch('equities: modal', isAdd);
    this.dispatch('setting: context:setNull');
    this.dispatch('setting: cuopon:setNull');
  };

  /**
   * 显示修改弹窗
   */
  showEditModal = (formData: IMap, isAdd: boolean) => {
    if (formData.get('rightsType') == 3) {
      let rightsRule = JSON.parse(formData.get('rightsRule'));
      let activity = {
        // 领取类型(默认为不限)
        receiveType: rightsRule.type == 'issueOnce' ? 0 : 1,
        // 每人限领次数
        receiveCount: rightsRule.issueDate,
        // 选择的优惠券
        coupons: rightsRule.couponLists,
        // 无效的优惠券
        invalidCoupons: []
      };
      this.dispatch('edit: init', fromJS(activity));
    }

    this.transaction(() => {
      this.dispatch('equities: editFormData', formData);
      this.dispatch('equities: modal', isAdd);
      this.dispatch('equities: filed: value', {
        field: 'context',
        value: formData.get('rightsDescription')
      });
    });
  };

  /**
   * 修改form信息
   */
  editFormData = (formData: IMap) => {
    this.dispatch('equities: editFormData', formData);
  };

  /**
   * 修改商品图片
   */
  _editImages = (images: IList) => {
    this.dispatch('equities: editImages', images);
  };

  /**
   * 拖拽排序
   * @param dragIndex  拖拽排序源
   * @param hoverIndex 拖拽排序目标位置
   * @returns {Promise<void>}
   */
  cateSort = async (dragIndex, hoverIndex) => {
    let couponCateList = this.state().get('equitiesList').toJS();
    //拖拽排序
    const dragRow = couponCateList[dragIndex];
    //拖拽排序后的列表
    let sortList = update(couponCateList, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRow]
      ]
    });
    let rightsIdList = [];
    for (let index in sortList) {
      rightsIdList.push(sortList[index].rightsId);
    }
    const { res } = (await dragSort({ rightsIdList: rightsIdList })) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.refresh();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除优惠券分类
   */
  deleteEquities = async (couponCateId) => {
    let result: any = await deleteEquities(couponCateId);
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 刷新需要延迟一下
   */
  refresh = () => {
    setTimeout(() => {
      this.init();
    }, 1000);
  };

  doAdd = async () => {
    let result: any;
    const editor = this.state().get('regEditor');
    const formData = this.state().get('formData');
    const activity = this.state().get('activity');
    const rightsDescription = editor.getContent ? editor.getContent() : '';

    if (editor.getContentLength(true) > 500) {
      message.error('权益介绍字数已达最大限制!');
      return;
    }
    if (!rightsDescription) {
      message.error('请填写权益介绍!');
      return;
    }
    let rightsRule = JSON.stringify({
      type: activity.get('receiveType') == 0 ? 'issueOnce' : 'issueMonthly',
      issueDate: activity.get('receiveCount'),
      couponLists: activity.get('coupons').toJS()
    });
    let params = { ...formData.toJS(), rightsDescription, rightsRule };
    if (this.state().get('isAdd')) {
      result = await addEquities(params);
    } else {
      result = await modifyEquities(params);
    }
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      // 刷新
      this.refresh();
      this.modal(false);
    } else {
      message.error(result.res.message);
    }
  };

  /********************************1.优惠券代码*********************************/
  /**
   * 修改优惠券总张数
   * @param index 修改的优惠券的索引位置
   * @param totalCount 优惠券总张数
   */
  changeCouponTotalCount = (index, totalCount) => {
    this.dispatch('change: coupon: total: count', { index, totalCount });
  };

  /**
   * 批量选择优惠券
   */
  onChosenCoupons = (coupons) => {
    this.dispatch('choose: coupons', fromJS(coupons));
  };

  /**
   * 删除优惠券
   */
  onDelCoupon = (couonId) => {
    this.dispatch('del: coupon', couonId);
  };

  /**
   * 修改表单信息
   */
  changeFormField = (params) => {
    this.dispatch('change: form: field', fromJS(params));
  };
  /********************************优惠券代码end*********************************/

  /********************************富文本编辑开始*********************************/
  setVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (!this.state().get('visible')) {
      this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
    }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
  };

  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await webApi.getImgCates();
    const cateListIm = this.state().get('cateAllList');
    if (cateId == -1) {
      cateId = fromJS(cateList.res)
        .filter((item) => item.get('isDefault') == 1)
        .get(0)
        .get('cateId');
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await webApi.fetchImages({
      pageNum,
      pageSize: 15,
      resourceName: this.state().get('searchName'),
      cateIds: this._getCateIdsList(cateListIm, cateId),
      resourceType: 0
    });
    if (imageList.res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        if (cateId) {
          this.dispatch('modal: cateIds', List.of(cateId.toString()));
          this.dispatch('modal: cateId', cateId.toString());
        }
        this.dispatch('modal: imgCates', fromJS(cateList.res));
        if (successCount > 0) {
          //表示上传成功之后需要选中这些图片
          this.dispatch(
            'modal: chooseImgs',
            fromJS(imageList.res.context).get('content').slice(0, successCount)
          );
        }
        this.dispatch('modal: imgs', fromJS(imageList.res.context));
        this.dispatch('modal: page', fromJS({ currentPage: pageNum + 1 }));
      });
    } else {
      message.error(imageList.res.message);
    }
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
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('modal: searchName', searchName);
  };

  editCateId = async (value: string) => {
    this.dispatch('modal: cateId', value);
  };

  /**
   * 修改选中分类
   * @param value
   * @returns {Promise<void>}
   */
  editDefaultCateId = async (value: string) => {
    this.dispatch('modal: cateIds', List.of(value));
  };

  search = async (imageName: string) => {
    this.dispatch('modal: search', imageName);
  };

  /**
   * 修改商品图片
   */
  editImages = (images: IList) => {
    this.dispatch('imageActor: editImages', images);
  };

  /**
   * 点击图片
   * @param {any} check
   * @param {any} img
   */
  chooseImg = ({ check, img, chooseCount }) => {
    this.dispatch('modal: chooseImg', { check, img, chooseCount });
  };

  /**
   * 确定选择以上图片
   */
  beSureImages = () => {
    const chooseImgs = this.state().get('chooseImgs');
    const imgType = this.state().get('imgType');
    if (imgType === 0) {
      let images = this.state().get('images');
      images = images.concat(chooseImgs);
      this.dispatch('imageActor: editImages', images);
    } else if (imgType === 1) {
      const skuId = this.state().get('skuId');
      this.dispatch('goodsSpecActor: editGoodsItem', {
        id: skuId,
        key: 'images',
        value: chooseImgs
      });
    } else {
      this.state()
        .get('regEditor')
        .execCommand('insertimage', (chooseImgs || fromJS([])).toJS());
    }
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };

  refEditor = (editor) => {
    this.dispatch('setting: regEditor', editor);
  };

  /********************************富文本编辑结束*********************************/
}
