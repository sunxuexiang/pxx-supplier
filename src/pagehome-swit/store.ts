import { Store } from 'plume2';
import { fromJS } from 'immutable';
import moment from 'moment';
import { Const, history } from 'qmkit';
import { message, Modal } from 'antd';
import { IList } from 'typings/globalType';

import * as webapi from './webapi';
import RegisteredActor from './actor/registered-actor';
import ImageActor from './actor/image-actor';

const info = Modal.info;

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new RegisteredActor(), new ImageActor()];
  }

  /**
   * 修改表单信息
   */
  changeFormField = (params) => {
    this.dispatch('change: form: field', fromJS(params));
  };
  /**
   * 修改商品图片
   */
  editImages = async (images: IList) => {
    await this.dispatch('imageActor: editImages', images);
  };

  /**
   * 修改商品图片
   */
  editImages1 = (images: IList) => {
    this.dispatch('imageActor: editImages1', images);
  };
  /**
   * 修改商品图片
   */
  editImages2 = (images: IList) => {
    this.dispatch('imageActor: editImages2', images);
  };
  /**
   * 修改商品图片
   */
  editImages3 = (images: IList) => {
    this.dispatch('imageActor: editImages3', images);
  };

  editImages4 = (images: IList) => {
    this.dispatch('imageActor: editImages4', images);
  };

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
  onDelCoupon = (couponId) => {
    this.dispatch('del: coupon', couponId);
  };

  init = async (activityId) => {
    if (activityId) {
      await this.editInit(activityId);
    }
  };

  /**
   * 编辑初始化
   */
  editInit = async (advertisingId) => {
    // 1.查询活动详情
    const { res } = await webapi.getActivityDetail({
      advertisingId: advertisingId
    });
    console.log(res.context, '789456789');

    if (res.code == Const.SUCCESS_CODE) {
      let activity = {} as any;
      const homeacTive = res.context;

      // 2.格式化数据
      // 2.1.基础信息
      // 商品图片
      let images = fromJS([
        {
          uid: 1,
          name: '图1',
          size: 1,
          status: 'done',
          url: homeacTive.advertisingConfigList[0].advertisingImage
        }
      ]);
      activity.selectedRows = [];
      activity.selectedRows1 = [];
      activity.selectedRows2 = [];
      activity.selectedRows3 = [];
      activity.selectedRows4 = [];

      activity.jumpLink = {};
      activity.jumpLink1 = {};
      activity.jumpLink2 = {};
      activity.jumpLink3 = {};
      activity.jumpLink4 = {};

      activity.jumpLink.isSuit = homeacTive.advertisingConfigList[0].isSuit
        ? homeacTive.advertisingConfigList[0].isSuit
        : 0;
      activity.jumpLink1.isSuit1 = homeacTive.advertisingConfigList[1]
        ? homeacTive.advertisingConfigList[1].isSuit
          ? homeacTive.advertisingConfigList[1].isSuit
          : 0
        : 0;
      activity.jumpLink2.isSuit2 = homeacTive.advertisingConfigList[2]
        ? homeacTive.advertisingConfigList[2].isSuit
          ? homeacTive.advertisingConfigList[2].isSuit
          : 0
        : 0;
      activity.jumpLink3.isSuit3 = homeacTive.advertisingConfigList[3]
        ? homeacTive.advertisingConfigList[3].isSuit
          ? homeacTive.advertisingConfigList[3].isSuit
          : 0
        : 0;
      activity.jumpLink4.isSuit4 = homeacTive.advertisingConfigList[4]
        ? homeacTive.advertisingConfigList[4].isSuit
          ? homeacTive.advertisingConfigList[4].isSuit
          : 0
        : 0;

      if (homeacTive.advertisingConfigList[1]) {
        let images1 = fromJS([
          {
            uid: 2,
            name: '图2',
            size: 1,
            status: 'done',
            url: homeacTive.advertisingConfigList[1].advertisingImage
          }
        ]);

        activity.imageUrl1 =
          homeacTive.advertisingConfigList[1].advertisingImage;
        this.editImages1(images1);
        if (homeacTive.advertisingConfigList[1].moFangAdvertisingName) {
          activity.jumpLink1 = {
            isSuit1: homeacTive.advertisingConfigList[1].isSuit,
            title: homeacTive.advertisingConfigList[1].moFangAdvertisingName,
            pageCode: homeacTive.advertisingConfigList[1].moFangPageCode
          };
          activity.selectedRows1.push(activity.jumpLink1);
        }
      }

      if (homeacTive.advertisingConfigList[2]) {
        let images2 = fromJS([
          {
            uid: 3,
            name: '图3',
            size: 1,
            status: 'done',
            url: homeacTive.advertisingConfigList[2].advertisingImage
          }
        ]);
        this.editImages2(images2);
        if (homeacTive.advertisingConfigList[2].moFangAdvertisingName) {
          activity.jumpLink2 = {
            isSuit2: homeacTive.advertisingConfigList[2].isSuit,
            title: homeacTive.advertisingConfigList[2].moFangAdvertisingName,
            pageCode: homeacTive.advertisingConfigList[2].moFangPageCode
          };
          activity.selectedRows2.push(activity.jumpLink2);
        }
        activity.imageUrl2 =
          homeacTive.advertisingConfigList[2].advertisingImage;
      }
      if (homeacTive.advertisingConfigList[3]) {
        let images3 = fromJS([
          {
            uid: 4,
            name: '图4',
            size: 1,
            status: 'done',
            url: homeacTive.advertisingConfigList[3].advertisingImage
          }
        ]);
        this.editImages3(images3);
        if (homeacTive.advertisingConfigList[3].moFangAdvertisingName) {
          activity.jumpLink3 = {
            isSuit3: homeacTive.advertisingConfigList[3].isSuit,
            title: homeacTive.advertisingConfigList[3].moFangAdvertisingName,
            pageCode: homeacTive.advertisingConfigList[3].moFangPageCode
          };
          activity.selectedRows3.push(activity.jumpLink3);
        }
        activity.imageUrl3 =
          homeacTive.advertisingConfigList[3].advertisingImage;
      }
      if (homeacTive.advertisingConfigList[4]) {
        let images4 = fromJS([
          {
            uid: 5,
            name: '图5',
            size: 1,
            status: 'done',
            url: homeacTive.advertisingConfigList[4].advertisingImage
          }
        ]);
        this.editImages4(images4);
        activity.imageUrl4 =
          homeacTive.advertisingConfigList[4].advertisingImage;

        if (homeacTive.advertisingConfigList[4].moFangAdvertisingName) {
          activity.jumpLink4 = {
            isSuit4: homeacTive.advertisingConfigList[4].isSuit,
            title: homeacTive.advertisingConfigList[4].moFangAdvertisingName,
            pageCode: homeacTive.advertisingConfigList[4].moFangPageCode
          };
          activity.selectedRows4.push(activity.jumpLink4);
        }
      }
      this.editImages(images);
      activity.advertisingId = homeacTive.advertisingId;
      activity.advertisingName = homeacTive.advertisingName;
      activity.advertisingType = homeacTive.advertisingType;
      activity.sortNum = homeacTive.sortNum;
      activity.imageUrl = homeacTive.advertisingConfigList[0].advertisingImage;
      // activity.jumpLink = homeacTive.advertisingConfigList[0].jumpLink;
      if (homeacTive.advertisingConfigList[0].moFangAdvertisingName) {
        activity.jumpLink = {
          isSuit: homeacTive.advertisingConfigList[0].isSuit,
          title: homeacTive.advertisingConfigList[0].moFangAdvertisingName,
          pageCode: homeacTive.advertisingConfigList[0].moFangPageCode
        };
        activity.selectedRows.push(activity.jumpLink);
      }
      // activity.jumpLink1 = homeacTive.advertisingConfigList[1].jumpLink;

      // activity.jumpLink2 = homeacTive.advertisingConfigList[2].jumpLink;
      // activity.jumpLink3 = homeacTive.advertisingConfigList[3].jumpLink;
      // activity.jumpLink4 = homeacTive.advertisingConfigList[4].jumpLink;
      activity.advertisingConfigList = homeacTive.advertisingConfigList;
      // 3.设置状态
      this.dispatch('edit: init', fromJS(activity));
    }
  };

  /**
   * 新增/编辑优惠券
   */
  save = async () => {
    // 1.从state中获取数据
    let activity = this.state()
      .get('activity')
      .toJS();
    let imageList = this.state()
      .get('images')
      .toJS();
    let imageList1 = this.state()
      .get('images1')
      .toJS();
    let imageList2 = this.state()
      .get('images2')
      .toJS();
    let imageList3 = this.state()
      .get('images3')
      .toJS();
    let imageList4 = this.state()
      .get('images4')
      .toJS();
    if (imageList.length <= 0) {
      message.error('请必须需上传图1');
      return;
    }
    // if (!activity.jumpLink || !activity.jumpLink.title && activity.jumpLink.isSuit == 0) {
    //   message.error('请设置图1跳转链接');
    //   return
    // }
    console.log(activity, 'activityactivity', imageList);

    // 2.格式化数据
    let params = {} as any;
    let advertisingConfigList = [];
    params.advertisingName = activity.advertisingName;
    params.sortNum = activity.sortNum;
    params.advertisingType = 2;
    if (imageList.length > 0) {
      advertisingConfigList.push({
        advertisingImage: imageList[0]
          ? imageList[0].response
            ? imageList[0].response[0]
            : imageList[0].url
          : '',
        jumpLink: '',
        advertisingId: activity.advertisingId
          ? activity.advertisingConfigList[0].advertisingId
          : null,
        advertisingConfigId: activity.advertisingId
          ? activity.advertisingConfigList[0].advertisingId
          : null,
        moFangAdvertisingName: activity.jumpLink ? activity.jumpLink.title : '',
        isSuit: activity.jumpLink.isSuit ? activity.jumpLink.isSuit : 0,
        moFangPageCode: activity.jumpLink ? activity.jumpLink.pageCode : ''
      });
    }
    if (imageList1.length > 0) {
      advertisingConfigList.push({
        advertisingImage: imageList1[0]
          ? imageList1[0].response
            ? imageList1[0].response[0]
            : imageList1[0].url
          : '',
        jumpLink: '',
        advertisingId: activity.advertisingConfigList[1]
          ? activity.advertisingConfigList[1].advertisingId
          : null,
        advertisingConfigId: activity.advertisingConfigList[1]
          ? activity.advertisingConfigList[1].advertisingId
          : null,
        moFangAdvertisingName: activity.jumpLink1
          ? activity.jumpLink1.title
          : '',
        isSuit: activity.jumpLink1.isSuit1 ? activity.jumpLink1.isSuit1 : 0,
        moFangPageCode: activity.jumpLink1 ? activity.jumpLink1.pageCode : ''
      });
    }

    if (imageList2.length > 0) {
      advertisingConfigList.push({
        advertisingImage: imageList2[0]
          ? imageList2[0].response
            ? imageList2[0].response[0]
            : imageList2[0].url
          : '',
        jumpLink: '',
        advertisingId: activity.advertisingConfigList[2]
          ? activity.advertisingConfigList[2].advertisingId
          : null,
        advertisingConfigId: activity.advertisingConfigList[2]
          ? activity.advertisingConfigList[2].advertisingId
          : null,
        moFangAdvertisingName: activity.jumpLink2
          ? activity.jumpLink2.title
          : '',
        isSuit: activity.jumpLink2.isSuit2 ? activity.jumpLink2.isSuit2 : 0,
        moFangPageCode: activity.jumpLink2 ? activity.jumpLink2.pageCode : ''
      });
    }
    if (imageList3.length > 0) {
      advertisingConfigList.push({
        advertisingImage: imageList3[0]
          ? imageList3[0].response
            ? imageList3[0].response[0]
            : imageList3[0].url
          : '',
        jumpLink: '',
        advertisingId: activity.advertisingConfigList[3]
          ? activity.advertisingConfigList[3].advertisingId
          : null,
        advertisingConfigId: activity.advertisingConfigList[3]
          ? activity.advertisingConfigList[3].advertisingId
          : null,
        moFangAdvertisingName: activity.jumpLink3
          ? activity.jumpLink3.title
          : '',
        isSuit: activity.jumpLink3.isSuit3 ? activity.jumpLink3.isSuit3 : 0,
        moFangPageCode: activity.jumpLink3 ? activity.jumpLink3.pageCode : ''
      });
    }
    if (imageList4.length > 0) {
      advertisingConfigList.push({
        advertisingImage: imageList4[0]
          ? imageList4[0].response
            ? imageList4[0].response[0]
            : imageList4[0].url
          : '',
        jumpLink: '',
        advertisingId: activity.advertisingConfigList[4]
          ? activity.advertisingConfigList[4].advertisingId
          : null,
        advertisingConfigId: activity.advertisingConfigList[4]
          ? activity.advertisingConfigList[4].advertisingId
          : null,
        moFangAdvertisingName: activity.jumpLink4
          ? activity.jumpLink4.title
          : '',
        isSuit: activity.jumpLink4.isSuit4 ? activity.jumpLink4.isSuit4 : 0,
        moFangPageCode: activity.jumpLink4 ? activity.jumpLink4.pageCode : ''
      });
    }
    console.log(
      advertisingConfigList,
      'advertisingConfigListadvertisingConfigList'
    );
    params.advertisingConfigList =
      advertisingConfigList.length > 0 ? advertisingConfigList : [];
    // 3.提交
    let res = null;
    if (activity.advertisingId) {
      params.advertisingId = activity.advertisingId;
      res = await webapi.modifyCouponActivity(params);
    } else {
      res = await webapi.addCouponActivity(params);
    }
    res = res.res;
    if (res.code == Const.SUCCESS_CODE) {
      message.success(activity.advertisingId ? '修改成功' : '保存成功');
      history.push({
        pathname: '/pagehome-adtt'
      });
    } else {
      message.error(res.message);
    }
  };
}
