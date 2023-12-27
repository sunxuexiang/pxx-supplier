import { IOptions, Store } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { message } from 'antd';
import { Const, history, util, FindArea } from 'qmkit';

import GoodsActor from './actor/goods-actor';

import { fetchGoodsList } from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new GoodsActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (params = { pageNum: 0, pageSize: 10 }) => {
    if (!params.pageNum) params.pageNum = 0;
    if (!params.pageSize) params.pageSize = 10;
    const { searchForm } = this.state().toJS();
    let { res } = await fetchGoodsList({ ...searchForm, ...params });
    if ((res as any).code == Const.SUCCESS_CODE) {
      res = (res as any).context;
      console.log(res, 'goodsgoodsgoods')
      const wareHouseVOPage =
        JSON.parse(localStorage.getItem('warePage')) || [];
      res['goodsInfoPage'].content.map((goodInfo) => {
        wareHouseVOPage.forEach(element => {
          if (element.wareId == goodInfo.wareId) {
            goodInfo.wareName = element.wareName
          }
        });

        const cId = fromJS(res['goodses'])
          .find((s) => s.get('goodsId') === goodInfo.goodsId)
          .get('cateId');
        const cate = fromJS(res['cates']).find((s) => s.get('cateId') === cId);
        goodInfo['cateName'] = cate ? cate.get('cateName') : '';

        const bId = fromJS(res['goodses'])
          .find((s) => s.get('goodsId') === goodInfo.goodsId)
          .get('brandId');
        const brand =
          res['brands'] == null
            ? ''
            : fromJS(res['brands']).find((s) => s.get('brandId') === bId);
        goodInfo['brandName'] = brand ? brand.get('brandName') : '';

        return goodInfo;
      });
      this.dispatch('goodsActor: init', res['goodsInfoPage']);
    }
  };


  onSeachFormBut = (key, value) => {
    this.dispatch('set: search', { key, value });
  };

  onGoodsActorFormBut = (key, value) => {
    this.dispatch('goodsActor: from', { key, value });
  }


  /**
   * 打开导出弹框
   */
  onExportModalShow = (exportModalData) => {
    this.dispatch(
      'info:exportModalShow',
      fromJS({
        ...exportModalData,
        visible: true,
        exportByParams: this.onExportByParams,
        // exportByIds: this.onExportByIds,
        exportByAll: this.onExportByAll
      })
    );
  };

  /**
   * 关闭导出弹框
   */
  onExportModalHide = () => {
    this.dispatch('info:exportModalHide');
  };

  onExportByAll = () => {
    const state=this.state().toJS();
    state.okBackFun({
      isExportModalData:2,
      searchParams:state.searchForm
    })
    return Promise.resolve();
  };

  // /**
  //  * 按勾选的信息进行导出
  //  */
  // onExportByIds = () => {
  //   const checkedIds = this.state().get('selectedSkuIds').toJS();

  //   if (checkedIds.length === 0) {
  //     message.warning('请勾选需要操作的信息');
  //     return new Promise((resolve) => setTimeout(resolve, 500));
  //   }
  //   return this._onExport({ stockoutIdList: checkedIds });
  // };

  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    // 搜索条件
    const state=this.state().toJS();
    state.okBackFun({
      isExportModalData:1,
      searchParams:state.searchForm
    })
    return Promise.resolve();
  };



}
