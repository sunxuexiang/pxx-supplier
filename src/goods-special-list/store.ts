import { Store, IOptions } from 'plume2';
import { fromJS } from 'immutable';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import { Const, util } from 'qmkit';
import { IList } from 'typings/globalType';

import {
  goodsList,
  getCateList,
  getBrandList,
  setGoodPrice,
  queryStoreByName,
  skuOnSale,
  skuOffSale,
  spuDelete,
  synchronizeSpecialGoods
} from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [new GoodsActor(), new FormActor()];
  }

  /**
   * 分销商品初始化
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<void>}
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const searchForm = this.state().get('form').toJS();
    //已审核通过的
    const { res } = (await goodsList({
      ...searchForm,
      pageSize,
      pageNum
    })) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('init', {
        data: res.context,
        pageNum: pageNum
      });
    } else {
      message.error(res.message);
    }

    const cates: any = await getCateList();
    const brands: any = await getBrandList();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });
  };

  /**
   * 搜索条件表单的变更
   * @param {any} key
   * @param {any} value
   */
  onFormFieldChange = ({ key, value }) => {
    this.dispatch('form:field', { key, value });
  };

  /**
   * 根据店铺名称查询店铺
   * @param storeName
   * @returns {Promise<void>}
   */
  queryStoreByName = async (storeName) => {
    this.onFormFieldChange({ key: 'storeName', value: storeName });
    const { res } = (await queryStoreByName(storeName)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('form: store: info', res.context);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 带着搜索条件的分页点击查询
   */
  onSearch = async () => {
    this.checkSwapInputGroupCompact();
    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * tab页签切换事件
   * @param val
   * @returns {Promise<void>}
   */
  onTabChange = async (val) => {
    // 清空搜索条件
    // this.dispatch('form: field: clear');
    this.onFormFieldChange({ key: 'addedFlag', value: val });

    this.init({ pageNum: 0, pageSize: 10 });
  };

  /**
   * 更改排序信息
   * @param columnKey
   * @param order
   */
  setSortedInfo = (columnKey, order) => {
    this.dispatch('form: sort', {
      columnKey: columnKey,
      order: order
    });
  };

  /**
   * 多选选中的skuId
   */
  onSelectChange = (selectedRowKeys: number[]) => {
    this.dispatch('goods: sku: checked', fromJS(selectedRowKeys));
  };

  /**
   * 验证InputGroupCompact控件数值大小，并进行大小值交换
   */
  checkSwapInputGroupCompact = () => {
    const params = this.state().get('form').toJS();
    const { salePriceFirst, salePriceLast } = params;
    if (parseFloat(salePriceFirst) > parseFloat(salePriceLast)) {
      this.onFormFieldChange({
        key: 'specialPriceFirst',
        value: salePriceLast
      });
      this.onFormFieldChange({
        key: 'specialPriceLast',
        value: salePriceFirst
      });
    }
  };

  /**
   * 上架(单个)
   * @param goodsInfoId
   * @returns {Promise<void>}
   */
  skuOnSale = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }

    const { res } = (await skuOnSale({
      goodsInfoIds: ids,
      goodsInfoType: 1
    })) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.onSearch();
  };
  /**
   * 下架(单个)
   * @param goodsInfoId
   * @returns {Promise<void>}
   */
  skuOffSale = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }

    const { res } = (await skuOffSale({
      goodsInfoIds: ids,
      goodsInfoType: 1
    })) as any;

    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      message.error(res.message);
    }
    this.onSearch();
  };

  /**
   * 批量导出
   */
  onExportByIds = async (ids: string[]) => {
    if (!ids) {
      const selectedSkuKeys: IList = this.state().get('selectedSkuKeys');
      ids = selectedSkuKeys.toJS();
    }
    if (ids.length === 0) {
      message.warning('请勾选需要操作的信息');
      return new Promise((resolve) => setTimeout(resolve, 500));
    }

    // const queryParams = this.state()
    //     .get('settleQueryParams')
    //     .toJS();
    // const { startTime, endTime, storeName } = queryParams;
    return new Promise((resolve) => {
      setTimeout(() => {
        // 参数加密
        const base64 = new util.Base64();
        const token = (window as any).token;
        if (token) {
          const result = JSON.stringify({
            goodsInfoIds: ids,
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
    const searchParams = this.state().get('form').toJS();
    return this._onExport(searchParams);
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
      this.switchShowModal(false);
      this.init({ pageNum: 0, pageSize: 10 });
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
      this.switchShowModal(false);
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };

  //删除
  spuDelete = async (ids: string[]) => {
    if (!ids) {
      const selectedSpuKeys: IList = this.state().get('selectedSpuKeys');
      ids = selectedSpuKeys.toJS();
    }
    await spuDelete({ goodsInfoIds: ids });
    this.onSearch();
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
  switchShowModal = (flag: boolean) => {
    this.dispatch('goodsActor: switchShowModal', flag);
  };
}
