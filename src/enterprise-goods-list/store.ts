import { Store, IOptions } from 'plume2';
import { List, fromJS } from 'immutable';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import { Const, QMFloat, QMMethod, ValidConst, VASConst } from 'qmkit';
import {
  goodsList,
  getCateList,
  getBrandList,
  addDistributionGoods,
  delDistributionGoods,
  modifyEnterpriseGoodsPrice
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
   * 企业购商品初始化
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<void>}
   */
  init = async ({ pageNum, pageSize } = { pageNum: 0, pageSize: 10 }) => {
    const searchForm = this.state()
      .get('form')
      .toJS();
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
    const iepInfo: any = await QMMethod.fetchIepInfo();
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
      this.dispatch('iep: iepInfo', fromJS(iepInfo));
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
   * 带着搜索条件的分页点击查询
   */
  onSearch = async () => {
    let validFlag = this.checkSwapInputGroupCompact();
    if (validFlag) {
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      this.wrongSearch();
    }
  };

  /**
   * tab页签切换事件
   * @param val
   * @returns {Promise<void>}
   */
  onTabChange = async (val) => {
    // 清空搜索条件
    this.onFormFieldChange({
      key: 'enterPriseAuditState',
      value: val
    });
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
   * 验证InputGroupCompact控件数值大小，并进行大小值交换
   */
  checkSwapInputGroupCompact = () => {
    const params = this.state()
      .get('form')
      .toJS();
    const {
      salePriceFirst,
      salePriceLast,
      distributionCommissionFirst,
      distributionCommissionLast, // distributionSalesCountFirst,
      stockFirst,
      stockLast,
      commissionRateFirst,
      commissionRateLast
    } = params;

    let validateFlag = false;
    // 校验数据
    if (salePriceFirst && !ValidConst.zeroPrice.test(salePriceFirst)) {
      return validateFlag;
    }

    if (salePriceLast && !ValidConst.zeroPrice.test(salePriceLast)) {
      return validateFlag;
    }

    if (
      distributionCommissionFirst &&
      !ValidConst.zeroPrice.test(distributionCommissionFirst)
    ) {
      return validateFlag;
    }

    if (
      distributionCommissionLast &&
      !ValidConst.zeroPrice.test(distributionCommissionLast)
    ) {
      return validateFlag;
    }

    if (stockFirst && !ValidConst.numbezz.test(stockFirst)) {
      return validateFlag;
    }

    if (stockLast && !ValidConst.numbezz.test(stockLast)) {
      return validateFlag;
    }

    if (
      commissionRateFirst &&
      !ValidConst.zeroPrice.test(commissionRateFirst)
    ) {
      return validateFlag;
    }

    if (commissionRateLast && !ValidConst.zeroPrice.test(commissionRateLast)) {
      return validateFlag;
    }
    if (parseFloat(salePriceFirst) > parseFloat(salePriceLast)) {
      this.onFormFieldChange({
        key: 'salePriceFirst',
        value: salePriceLast
      });
      this.onFormFieldChange({
        key: 'salePriceLast',
        value: salePriceFirst
      });
    }
    if (
      parseFloat(distributionCommissionFirst) >
      parseFloat(distributionCommissionLast)
    ) {
      this.onFormFieldChange({
        key: 'distributionCommissionFirst',
        value: distributionCommissionLast
      });
      this.onFormFieldChange({
        key: 'distributionCommissionLast',
        value: distributionCommissionFirst
      });
    }
    if (parseFloat(commissionRateFirst) > parseFloat(commissionRateLast)) {
      this.onFormFieldChange({
        key: 'commissionRateFirst',
        value: commissionRateLast
      });
      this.onFormFieldChange({
        key: 'commissionRateLast',
        value: commissionRateFirst
      });
    }
    if (parseInt(stockFirst) > parseInt(stockLast)) {
      this.onFormFieldChange({
        key: 'stockFirst',
        value: stockLast
      });
      this.onFormFieldChange({
        key: 'stockLast',
        value: stockFirst
      });
    }

    return !validateFlag;
  };

  /**
   * enter键搜索时，参数错误调用此方法，默认查不到数据
   */
  wrongSearch = () => {
    this.dispatch('wrong:search');
  };

  /**
   * 删除企业购商品
   * @param goodsInfoId
   * @returns {Promise<void>}
   */
  onDelete = async (goodsInfoId, goodsInfoNo) => {
    const { res } = (await delDistributionGoods(
      goodsInfoId,
      goodsInfoNo
    )) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.init({ pageNum: 0, pageSize: 10 });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 初始化编辑企业购商品佣金弹窗
   * 审核未通过、禁止企业购和已审核状态编辑弹窗
   * @param goodsInfoId
   * @returns {Promise<void>}
   */
  onShowEditEnterprisePriceModal = async (data) => {
    this.onFieldChange('editGoodsInfoId', data.goodsInfoId);
    this.onFieldChange('enterPrisePrice', data.enterPrisePrice);
    this.switchShowModal(true);
  };

  /**
   * 显示/关闭编辑企业专享价弹窗
   */
  switchShowModal = (flag: boolean) => {
    this.dispatch('goodsActor: switchShowModal', flag);
  };

  /**
   * 保存企业专享价
   * @param goodsInfoId
   * @param distributionCommission
   * @returns {Promise<void>}
   */
  onSaveEnterprisePrice = async (goodsInfoId, enterPrisePrice) => {
    const { res } = (await modifyEnterpriseGoodsPrice({
      goodsInfoId: goodsInfoId,
      enterPrisePrice: enterPrisePrice
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
   * 数值变更
   */
  onFieldChange = (field, value) => {
    this.dispatch('goods: field: change', {
      field,
      value
    });
  };

  /**
   * 编辑佣金比例
   */
  editCommissionFuc = (marketingPrice, value) => {
    let rate = QMFloat.accDiv(value, 100);
    let editDistributionCommission = QMFloat.addZeroFloor(
      QMFloat.accMul(marketingPrice, rate)
    );
    this.onFieldChange('editCommissionRate', value);
    this.onFieldChange(
      'editDistributionCommission',
      editDistributionCommission
    );
  };

  /**
   * 选择商品弹框的打开、关闭按钮
   * @param flag
   */
  onChooseSkuModal = (flag) => {
    this.onFieldChange('goodsModalVisible', flag);
  };

  /**
   * 取消选择商品弹框
   */
  onCancelBackFun = () => {
    //关闭弹窗
    this.onChooseSkuModal(false);
    // 清空数据
    this.onFieldChange('selectedSkuKeys', fromJS([]));
    this.onFieldChange('selectedSkuRows', fromJS([]));
  };

  /**
   * 选中sku 点击下一步，保存用户选择的商品信息
   * 弹出编辑选中商品弹窗
   * 读取配置的佣金
   * @param skuIds
   * @param rows
   */
  onNextBackFun = (skuIds, rows) => {
    //保存商品信息
    this.onFieldChange('selectedSkuKeys', fromJS(skuIds));
    this.onFieldChange('selectedSkuRows', fromJS(rows));
    this.onChooseSkuModal(false);
    // 下一步 编辑选中sku弹窗显示
    this.onEditChoseSkuModal(true);
  };

  /**
   * 选中商品弹框的打开、关闭按钮
   * @param flag
   */
  onEditChoseSkuModal = (flag) => {
    this.onFieldChange('choseGoodsModalVisible', flag);
  };

  /**
   * 取消编辑选中商品弹框
   */
  onCancelChoseSkuFun = () => {
    //关闭弹窗
    this.onEditChoseSkuModal(false);
    // 清空数据
    this.onFieldChange('selectedSkuKeys', fromJS([]));
    this.onFieldChange('selectedSkuRows', fromJS([]));
  };

  /**
   * 设置选中sku的佣金
   * @param field goodsInfoId
   * @param value commission
   */
  onEditChoseSkuEnterprisePrice = (field, value) => {
    this.dispatch('goods: chose: edit: enterprisePrice', { field, value });
  };

  /**
   * 删除选中的sku
   * @param goodsInfoId
   */
  onDelChoseSku = (goodsInfoId) => {
    this.dispatch('goods: chose: delete', goodsInfoId);
  };

  /**
   * 添加企业购商品
   * @returns {Promise<void>}
   */
  onSaveEnterpriseGoods = async (selectedSkuRows) => {
    let params = List();
    selectedSkuRows.map((sku) => {
      let row = {
        goodsInfoId: sku.get('goodsInfoId'),
        enterPrisePrice: sku.get('enterPrisePrice')
      };
      params = params.push(row);
    });
    const { res } = (await addDistributionGoods(params)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.onCancelChoseSkuFun();
      this.init({ pageNum: 0, pageSize: 10 });
    } else if (res.code == 'K-030702') {
      message.error(res.message);
      this.onFieldChange('invalidGoodsInfoIds', fromJS(res.errorData));
    } else {
      message.error(res.message);
    }
  };
}
