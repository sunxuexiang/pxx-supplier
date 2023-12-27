import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import CateActor from './actor/cate-actor';
import BrandActor from './actor/brand-actor';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import FreightActor from './actor/freight-actor';
import ClassfyiActor from './actor/classfyi-actor';
import { message } from 'antd';
import { Const, util } from 'qmkit';
import {
  goodsList,
  spuDelete,
  spuOnSale,
  spuOffSale,
  getCateList,
  getBrandList,
  freightList,
  goodsFreight,
  goodsFreightExpress,
  updateFreight,
  setGoodsSeqNum,
  searchBrandLink,
  setGoodPrice,
  synchronizeSpecialGoods,
  batchCate,
  goodsCatesTree
} from './webapi';

import { IList } from 'typings/globalType';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new CateActor(),
      new BrandActor(),
      new GoodsActor(),
      new FormActor(),
      new FreightActor(),
      new ClassfyiActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (
    { pageNum, pageSize, flushSelected } = {
      pageNum: 0,
      pageSize: 10,
      flushSelected: true
    }
  ) => {
    const { res, err } = (await goodsList({
      pageNum,
      pageSize,
      auditStatus: this.state().get('auditStatus')
      // goodsInfoType: this.state().get('goodsType'),
    })) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('goodsActor: init', fromJS(res.context));
      this.dispatch('form:field', { key: 'pageNum', value: pageNum });
    } else {
      message.error(res.message);
    }

    const cates: any = await getCateList();
    const brands: any = await getBrandList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });
    const cateList: any = await goodsCatesTree();
    this.dispatch('classfyi: cateModalList', fromJS(cateList.res.context));

    if (flushSelected) {
      this.dispatch('goodsActor:clearSelectedSpuKeys');
    }
  };

  /**
   * 条件搜索,回到第一页
   */
  onSearch = async () => {
    const pageNum = sessionStorage.getItem('pageNum');
    console.log(pageNum, 'pageNum');

    if (pageNum) {
      this.dispatch('form:field', { key: 'pageNum', value: 0 });
    }
    // this.dispatch('form:field', { key: 'pageNum', value: 0 });
    this.onPageSearch();
  };

  /**
   * 带着搜索条件的分页点击查询
   */
  onPageSearch = async () => {
    let request: any = {
      likeGoodsName: this.state().get('likeGoodsName'),
      likeProviderName: this.state().get('likeProviderName'),
      likeGoodsInfoNo: this.state().get('likeGoodsInfoNo'),
      likeGoodsNo: this.state().get('likeGoodsNo'),
      pageNum: this.state().get('pageNum'),
      stockUp: this.state().get('stockUp'),
      likeErpNo: this.state().get('likeErpNo'),
      pageSize: this.state().get('pageSize'),
      auditStatus: this.state().get('auditStatus'),
      goodsInfoType: this.state().get('goodsType'),
      goodsInfoBatchNo: this.state().get('goodsInfoBatchNo'),
      specialPriceFirst: this.state().get('specialPriceFirst'),
      specialPriceLast: this.state().get('specialPriceLast')
      // goodsSeqFlag: this.state().get('goodsSeqFlag')
    };

    if (this.state().get('storeCateId') != '-1') {
      request.storeCateId = this.state().get('storeCateId');
    }
    if (this.state().get('brandId') != '-1') {
      request.brandId = this.state().get('brandId');
    }
    if (this.state().get('addedFlag') != '-1') {
      request.addedFlag = this.state().get('addedFlag');
    }
    if (this.state().get('saleType') != '-1') {
      request.saleType = this.state().get('saleType');
    }

    const { res, err } = (await goodsList(request)) as any;
    if (!err) {
      res.context.goodsPage.content.forEach((v, i) => {
        v.key = i;
      });
      this.dispatch('goodsActor: init', fromJS(res.context));
      this.dispatch('goodsActor:clearSelectedSpuKeys');
    }
  };

  onStateTabChange = (tabIndex) => {
    this.dispatch('form:field', { key: 'addedFlag', value: tabIndex });
    this.onSearch();
  };

  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  onEditSkuNo = (value) => {
    this.dispatch('goodsActor:editLikeGoodsInfoNo1', value);
  };

  onShowSku = (value) => {
    this.dispatch('goodsActor:editExpandedRowKeys', value);
  };

  onSelectChange = (selectedRowKeys: number[]) => {
    this.dispatch('goodsActor: onSelectChange', fromJS(selectedRowKeys));
  };

  spuDelete = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }
    await spuDelete({ goodsIds: ids });
    this.onSearch();
  };

  spuOnSale = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }

    const data: any = await spuOnSale({ goodsIds: ids });
    this.message(data);
    this.onSearch();
  };

  spuOffSale = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }

    const data: any = await spuOffSale({ goodsIds: ids });
    this.message(data);
    this.onSearch();
  };

  /**
   * 显示/关闭批量修改分类modal
   */
  setClassfyiVisible = (visible) => {
    this.dispatch('classfyi: classfyiVisible', visible);
  };

  setGoodsIds = () => {
    const goodsIds = this.state().get('selectedSpuKeys');
    this.dispatch('classfyi: goodsIds', goodsIds);
  };

  setCateId = (setCateId) => {
    this.dispatch('classfyi: cateId', setCateId);
  };

  submitCatePut = async (cateId) => {
    const goodsIds = this.state().get('selectedSpuKeys');
    let param = {
      goodsIds: goodsIds.toJS(),
      cateId: cateId
    };
    const { res, err } = await batchCate(param);
    if (!err && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.setCateId(null);
      this.setClassfyiVisible(false);
    } else {
      message.error(res.message);
    }
  };

  /**
   * tip
   */
  message = (data: any) => {
    if (data.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(data.res.message);
    }
  };
  /**
   * 控制modal显示
   */
  setFeightVisible = (feightVisible: boolean) => {
    this.dispatch('freight:feightVisible', feightVisible);
  };
  /**
   * 运费模板Id收录
   */
  setFreightTempId = (freightTempId: number) => {
    this.dispatch('freight:freightTempId', freightTempId);
  };
  /**
   * 所有运费模板
   */
  setFreightList = async () => {
    const { res, err } = await freightList();
    if (!err && res.code === Const.SUCCESS_CODE) {
      this.dispatch('freight:freightList', fromJS(res.context));
    } else {
      message.error(res.message);
    }
  };
  /**
   * 单个运费模板首重，续重，发货地数据收录
   */
  setGoodsFreight = async (freightTempId: number, isSelect: boolean) => {
    const { res, err } = await goodsFreight(freightTempId);
    if (!err && res.code === Const.SUCCESS_CODE) {
      if (isSelect) {
        this.dispatch('freight:selectTemp', fromJS(res.context));
        const result = (await goodsFreightExpress(freightTempId)) as any;
        if (result.res.code === Const.SUCCESS_CODE) {
          this.dispatch(
            'freight:selectTempExpress',
            fromJS(result.res.context)
          );
        } else {
          message.error(result.res.message);
        }
      } else {
        this.dispatch('freight:freightTemp', fromJS(res.context));
      }
    } else {
      message.error(res.message);
    }
  };
  /**
   * 批量编辑运费模板数据提交
   */
  submitBatchFreight = async (freightTempId: number) => {
    const goodsIds = this.state().get('selectedSpuKeys');
    let param = {
      goodsIds: goodsIds.toJS(),
      freightTempId: freightTempId
    };
    const { res, err } = (await updateFreight(param)) as any;
    if (!err && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.setFeightVisible(false);
      this.setFreightTempId(null);
      this.dispatch('goodsActor:clearSelectedSpuKeys');
    } else {
      message.error(res.message);
    }
  };
  /**
   * 数值变更
   */
  onFieldChange = (field, value) => {
    this.dispatch('goods: field: change', { field, value });
  };
  /**
   * 显示/关闭禁售理由框
   */
  switchShowModal = (flag: boolean, text) => {
    this.dispatch('goodsActor: switchShowModal', flag);
    this.dispatch('goodsActor: switchShowModalText', text);
  };
  /**
   * 修改商品序号
   */
  setGoodsSeqNum = async (goodsId, goodsSeqNum) => {
    let param = {
      goodsId,
      goodsSeqNum
    };
    const result = (await setGoodsSeqNum(param)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.onSearch();
    } else {
      message.error(result.res.message);
    }
  };
  /**
   * 查询关联品牌
   */
  searchBrandLink = async (brandId) => {
    const result = (await searchBrandLink(brandId)) as any;
    if (result.res.code === Const.SUCCESS_CODE) {
      this.onFieldChange('isBrandLinksort', result.res.context.brandSeqNum);
    } else {
      message.error(result.res.message);
    }
  };
  /**
   * 关闭导出弹框
   */
  onExportModalHide = () => {
    this.dispatch('info:exportModalHide');
  };
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
        exportByIds: this.onExportByIds
      })
    );
  };
  /**
   * 按搜索条件进行导出
   */
  onExportByParams = () => {
    // 搜索条件
    let request: any = {
      likeGoodsName: this.state().get('likeGoodsName'),
      likeProviderName: this.state().get('likeProviderName'),
      likeGoodsInfoNo: this.state().get('likeGoodsInfoNo'),
      likeGoodsNo: this.state().get('likeGoodsNo'),
      pageNum: this.state().get('pageNum'),
      stockUp: this.state().get('stockUp'),
      likeErpNo: this.state().get('likeErpNo'),
      pageSize: this.state().get('pageSize'),
      auditStatus: this.state().get('auditStatus'),
      goodsInfoType: 0
      // goodsSeqFlag: this.state().get('goodsSeqFlag')
    };

    if (this.state().get('storeCateId') != '-1') {
      request.storeCateId = this.state().get('storeCateId');
    }
    if (this.state().get('brandId') != '-1') {
      request.brandId = this.state().get('brandId');
    }
    if (this.state().get('addedFlag') != '-1') {
      request.addedFlag = this.state().get('addedFlag');
    }
    if (this.state().get('saleType') != '-1') {
      request.saleType = this.state().get('saleType');
    }
    const goodsPageContent = this.state()
      .getIn(['goodsPage', 'content'])
      .toJS();
    const isAllSpecialGoods = goodsPageContent.every(
      (item) => item.goodsType == 2
    );
    if (!isAllSpecialGoods) {
      message.warning('商品中含有非特价商品');
      return new Promise((resolve) => setTimeout(resolve, 500));
    }
    return this._onExport(request);
  };
  /**
   * 导出具体实现(私有的公共方法)
   */
  _onExport = (params: {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const base64 = new util.Base64();
        const token = window.token;
        if (token) {
          // 参数加密
          let result = JSON.stringify({ ...params, token: token });
          let encrypted = base64.urlEncode(result);
          const exportHref = Const.HOST + `/goods/export/${encrypted}`;
          // 新窗口下载
          window.open(exportHref);
        } else {
          message.error('请登录后重试');
        }
        resolve();
      }, 500);
    });
  };
  /**
   * 批量导出
   */
  onExportByIds = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }
    if (ids.length === 0) {
      message.warning('请勾选需要操作的信息');
      return new Promise((resolve) => setTimeout(resolve, 500));
    } else {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');

      const goodsPageContent = this.state().getIn(['goodsPage', 'content']);
      let checkedGoods = [];
      checkedGoods = goodsPageContent
        .toJS()
        .filter((goods) => selectedSpuKeys.indexOf(goods.goodsId) > -1);
      let isAllSpecialGoods = checkedGoods.every((item) => item.goodsType == 2);
      if (!isAllSpecialGoods) {
        message.warning('商品中含有非特价商品');
        return new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        return new Promise((resolve) => {
          setTimeout(() => {
            // 参数加密
            const base64 = new util.Base64();
            const token = (window as any).token;
            if (token) {
              const result = JSON.stringify({
                goodsIds: ids,
                token: token
              });
              const encrypted = base64.urlEncode(result);
              // 新窗口下载
              const exportHref = Const.HOST + `/goods/export/${encrypted}`;
              window.open(exportHref);
            } else {
              message.error('请登录');
            }
            resolve();
          }, 500);
        });
      }
    }
  };

  /**
   * 设价
   * @param goodsInfoIdList
   * @returns {Promise<void>}
   */
  SetGoodPrice = async (goodsInfoIdList) => {
    const goodDiscount = this.state().get('goodDiscount');
    // const marketPrice = this.state().get('marketPrice');
    const { res } = (await setGoodPrice({
      goodsInfoIdList: goodsInfoIdList,
      goodDiscount: goodDiscount
      // marketPrice: marketPrice
    })) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchShowModal(false, '');
      this.onFieldChange('goodDiscount', null);

      this.onPageSearch();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 同步特价仓
   * @param ids
   */
  synchronizeSpecialGoods = async () => {
    const { res } = (await synchronizeSpecialGoods()) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.switchShowModal(false, '');
      this.init();
    } else if (res.code == 'K-050510') {
      message.error('网络请求超时，请稍后重试');
    } else {
      message.error(res.message);
    }
  };
}
