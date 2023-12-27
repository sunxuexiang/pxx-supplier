import { IOptions, Store } from 'plume2';
import * as webapi from './webapi';
import { fromJS, List } from 'immutable';
import { message } from 'antd';
import { Const, history, util } from 'qmkit';

import SettingActor from './actor/setting-actor';

import * as webApi from '../customer-equities/webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    // debug
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettingActor()];
  }

  init = async () => {
    const { res } = (await webapi.fetchhomeDeliverySetting()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('setting:init', fromJS(res.context.homeDeliveryVOList[0]));
    } else {
      message.error(res.message);
    }
  };

  /**
   * 点击按钮---新增/修改  基本信息
   * @param settings
   * @returns {Promise<void>}
   */
  editSetting = async (settings) => {
    const isThird = util.isThirdStore();
    let editor = this.state().get('regEditor');
    if (
      !isThird &&
      editor &&
      editor.getContent &&
      editor.getContentLength(true) > 500
    ) {
      return;
    }
    let regLogisticsContent = this.state().get('regLogisticsContent');
    if (
      regLogisticsContent &&
      regLogisticsContent.getContent &&
      regLogisticsContent.getContentLength(true) > 500
    ) {
      return;
    }

    let expensesCostContent = this.state().get('expensesCostContent');
    if (
      expensesCostContent &&
      expensesCostContent.getContent &&
      expensesCostContent.getContentLength(true) > 500
    ) {
      return;
    }
    let regExpressContent = this.state().get('regExpressContent');
    if (
      regExpressContent &&
      regExpressContent.getContent &&
      regExpressContent.getContentLength(true) > 500
    ) {
      return;
    }
    let regPickSelfContent = this.state().get('regPickSelfContent');
    if (
      regPickSelfContent &&
      regPickSelfContent.getContent &&
      regPickSelfContent.getContentLength(true) > 500
    ) {
      return;
    }
    settings.homeDeliveryId = this.state().getIn([
      'settings',
      'homeDeliveryId'
    ]);
    if (!isThird) {
      settings.content = editor.getContent ? editor.getContent() : '';
    }
    settings.logisticsContent = regLogisticsContent.getContent
      ? regLogisticsContent.getContent()
      : '';
    // specifyLogisticsContent 指定物流 logisticsContent 托运部
    settings.specifyLogisticsContent = settings.logisticsContent;
    settings.expensesCostContent = expensesCostContent.getContent
      ? expensesCostContent.getContent()
      : '';
    settings.expressContent = regExpressContent.getContent
      ? regExpressContent.getContent()
      : '';
    // intraCityLogisticsContent 同城配送 expressContent 快递到家
    settings.intraCityLogisticsContent = settings.expressContent;
    settings.pickSelfContent = regPickSelfContent.getContent
      ? regPickSelfContent.getContent()
      : '';
    const { res } = await webapi.editHomeDeliverySetting(settings);
    if (res.code == Const.SUCCESS_CODE) {
      message.success('保存成功');
      history.push('/home-delivery-setting/');
    } else {
      message.error(res.message);
    }
  };

  //**************富文本开始**********//

  refEditor = (editor) => {
    this.dispatch('setting: regEditor', editor);
  };

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
            fromJS(imageList.res.context)
              .get('content')
              .slice(0, successCount)
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
  //**************富文本结束**********//

  refLogisticsContent = (editor) => {
    this.dispatch('setting: regLogisticsContent', editor);
  };

  refexpensesCostContent = (editor) => {
    this.dispatch('setting: expensesCostContent', editor);
  };

  refExpressContent = (editor) => {
    this.dispatch('setting: regExpressContent', editor);
  };

  refPickSelfContent = (editor) => {
    this.dispatch('setting: regPickSelfContent', editor);
  };
}
