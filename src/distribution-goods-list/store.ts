import { Store, IOptions } from 'plume2';
import { List, fromJS } from 'immutable';
import GoodsActor from './actor/goods-actor';
import FormActor from './actor/form-actor';
import { message } from 'antd';
import { Const, QMFloat, ValidConst } from 'qmkit';
import {
  goodsList,
  getCateList,
  getBrandList,
  addDistributionGoods,
  delDistributionGoods,
  modifyDistributionGoodsCommission,
  modifyDistributionGoods
} from './webapi';
import * as webapi from '../distribution-setting/webapi';

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
    this.transaction(() => {
      this.dispatch('cateActor: init', fromJS(cates.res.context));
      this.dispatch('brandActor: init', fromJS(brands.res.context));
    });
    // 获取分销设置
    this.fetchSetting();
  };

  /**
   * 查询分销设置通用佣金
   */
  fetchSetting = async () => {
    const { res } = await webapi.fetchSetting();
    if (res.code == Const.SUCCESS_CODE) {
      let context = res.context;
      // 如果分销设置里，分销佣金开关开启，取设置的佣金
      // this.onFieldChange('settingCommission', context.commission);
      if (context.openFlag == 1) {
        this.onFieldChange(
          'commissionRate',
          QMFloat.accMul(context.commissionRate, 100).toFixed(0)
        );
      }
      this.onFieldChange('settingOpenFlag', context.openFlag);
    }
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
    // this.dispatch('form: field: clear');
    this.onFormFieldChange({
      key: 'distributionGoodsAudit',
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
   * 多选选中的skuId
   */
  // onSelectChange = (selectedRowKeys: number[]) => {
  //   this.dispatch('goods: sku: checked', fromJS(selectedRowKeys));
  // };

  /**
   * 验证InputGroupCompact控件数值大小，并进行大小值交换
   */
  checkSwapInputGroupCompact = () => {
    const params = this.state()
      .get('form')
      .toJS();
    const {
      optGoodsType,
      salePriceFirst,
      salePriceLast,
      distributionCommissionFirst,
      distributionCommissionLast, // distributionSalesCountFirst,
      // distributionSalesCountLast,
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

    if (optGoodsType == 0) {
      // 商品模糊搜索条
      this.onFormFieldChange({
        key: 'likeGoodsInfoNo',
        value: ''
      });
    } else {
      this.onFormFieldChange({
        key: 'likeGoodsName',
        value: ''
      });
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
    /*if (distributionSalesCountFirst > distributionSalesCountLast) {
      this.onFormFieldChange({
        key: 'distributionSalesCountFirst',
        value: distributionSalesCountLast
      });
      this.onFormFieldChange({
        key: 'distributionSalesCountLast',
        value: distributionSalesCountFirst
      });
    }*/
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
   * 删除分销商品
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
   * 初始化编辑分销商品佣金弹窗
   * 审核未通过、禁止分销和已审核状态编辑弹窗
   * @param goodsInfoId
   * @returns {Promise<void>}
   */
  onShowEditCommissionModal = async (data) => {
    this.onFieldChange('editGoodsInfoId', data.goodsInfoId);
    this.onFieldChange('editMarketPrice', data.marketPrice);
    this.onFieldChange(
      'editDistributionCommission',
      QMFloat.addZeroFloor(data.distributionCommission)
    );
    this.onFieldChange(
      'editCommissionRate',
      QMFloat.accMul(
        data.commissionRate ? data.commissionRate : 0,
        100
      ).toFixed(0)
    );
    this.onFieldChange('distributionGoodsAudit', data.distributionGoodsAudit);
    this.switchShowModal(true);
  };

  /**
   * 显示/关闭编辑分销商品佣金弹窗
   */
  switchShowModal = (flag: boolean) => {
    this.dispatch('goodsActor: switchShowModal', flag);
  };

  /**
   * 保存分销佣金
   * @param goodsInfoId
   * @param distributionCommission
   * @returns {Promise<void>}
   */
  onSaveCommission = async (
    goodsInfoId,
    distributionCommission,
    commissionRate
  ) => {
    const distributionGoodsAudit = this.state().get('distributionGoodsAudit');
    let commissionRateInput = QMFloat.accDiv(commissionRate, 100);
    if (distributionGoodsAudit == 2) {
      const { res } = (await modifyDistributionGoodsCommission({
        goodsInfoId: goodsInfoId,
        distributionCommission: distributionCommission,
        commissionRate: commissionRateInput
      })) as any;
      if (res.code == Const.SUCCESS_CODE) {
        message.success('操作成功');
        this.switchShowModal(false);
        this.init({ pageNum: 0, pageSize: 10 });
      } else {
        message.error(res.message);
      }
    } else if (distributionGoodsAudit != 1) {
      const { res } = (await modifyDistributionGoods({
        goodsInfoId: goodsInfoId,
        distributionCommission: distributionCommission,
        commissionRate: commissionRateInput
      })) as any;
      if (res.code == Const.SUCCESS_CODE) {
        message.success('操作成功');
        this.switchShowModal(false);
        this.init({ pageNum: 0, pageSize: 10 });
      } else {
        message.error(res.message);
      }
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
    // 读取配置的佣金
    // this.fetchSetting();
    this.dispatch('goods: chose: init: commission');
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
  onEditChoseSkuCommission = (field, value) => {
    this.dispatch('goods: chose: edit: commission', { field, value });
  };

  /**
   * 删除选中的sku
   * @param goodsInfoId
   */
  onDelChoseSku = (goodsInfoId) => {
    this.dispatch('goods: chose: delete', goodsInfoId);
  };

  /**
   * 添加分销商品
   * @returns {Promise<void>}
   */
  onSaveDistributionGoods = async (selectedSkuRows) => {
    let params = List();
    selectedSkuRows.map((sku) => {
      let commissionRate = QMFloat.accDiv(sku.get('commissionRate'), 100);
      let row = {
        goodsInfoId: sku.get('goodsInfoId'),
        distributionCommission: sku.get('distributionCommission'),
        commissionRate: commissionRate
      };
      params = params.push(row);
    });
    const { res } = (await addDistributionGoods(params)) as any;
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功');
      this.onCancelChoseSkuFun();
      this.init({ pageNum: 0, pageSize: 10 });
    } else if (res.code == 'K-030701') {
      message.error(res.message);
      this.onFieldChange('invalidGoodsInfoIds', fromJS(res.errorData));
    } else {
      message.error(res.message);
    }
  };
}
