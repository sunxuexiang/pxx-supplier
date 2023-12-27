import { Store } from 'plume2';

import { Const, history } from 'qmkit';
import { message, Modal } from 'antd';

import * as webApi from './webapi';
import CouponInfoActor from './actor/coupon-info-actor';

export default class AppStore extends Store {
  bindActor() {
    return [new CouponInfoActor()];
  }

  /**
   * 初始化信息
   */
  init = async ({ couponType, cid }) => {
    if (cid) {
      this.fetchCouponInfo(cid);
    } else {
      this.fetchScope(couponType);
    }

    this.fetchCouponCate();
    if (couponType) {
      this.fieldsValue({ field: 'couponType', value: couponType });
    }
  };

  /**
   * 查询优惠券信息
   */
  fetchCouponInfo = async (couponId) => {
    const { res } = (await webApi.fetchCoupon(couponId)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      const { couponInfo, goodsList } = res.context;
      const {
        cateIds,
        couponDesc,
        couponId,
        couponName,
        couponType,
        denomination,
        effectiveDays,
        endTime,
        fullBuyPrice,
        fullBuyType,
        rangeDayType,
        // scopeNames,
        scopeType,
        startTime,
        prompt
      } = couponInfo;
      const scopeIds = await this.fetchScope(scopeType, couponInfo.scopeIds);
      this.dispatch('coupon: info: data', {
        cateIds,
        couponDesc,
        couponId,
        couponName,
        couponType,
        denomination,
        effectiveDays,
        endTime,
        fullBuyPrice,
        fullBuyType,
        rangeDayType,
        scopeIds,
        scopeType,
        startTime,
        goodsList,
        prompt
      });
    }
  };

  /**
   * 查询优惠券分类
   */
  fetchCouponCate = async () => {
    const res = await webApi.fetchCouponCate();
    const { code, context } = res.res as any;
    if (code === Const.SUCCESS_CODE) {
      this.dispatch('coupon: info: field: value', {
        field: 'couponCates',
        value: context
      });
    }
  };

  /**
   * 存储键值
   */
  fieldsValue = ({ field, value }) => {
    this.dispatch('coupon: info: field: value', {
      field,
      value
    });
  };

  /**
   * 修改时间区间
   */
  changeDateRange = ({ startTime, endTime }) => {
    this.dispatch('coupon: info: date: range', {
      startTime,
      endTime
    });
  };

  /**
   * 修改商品选择范围
   */
  chooseScopeType = async (value) => {
    this.transaction(() => {
      this.dispatch('coupon: info: field: value', {
        field: 'scopeType',
        value
      });
      this.dispatch('coupon: info: field: value', {
        field: 'chooseBrandIds',
        value: []
      });
      this.dispatch('coupon: info: field: value', {
        field: 'chooseCateIds',
        value: []
      });
      this.dispatch('coupon: info: field: value', {
        field: 'chooseSkuIds',
        value: []
      });
      this.dispatch('coupon: info: field: value', {
        field: 'goodsRows',
        value: []
      });
    });
  };

  /**
   * 新增优惠券
   */
  addCoupon = async () => {
    const params = this.fetchParams();
    const { res } = (await webApi.addCoupon(params)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('新增优惠券成功!');
      history.push('/coupon-list');
    } else {
      this.changeBtnDisabled();
      return new Promise((resolve) => resolve(res));
    }
  };

  /**
   * 修改优惠券
   */
  editCoupon = async () => {
    let params = this.fetchParams();
    params.couponId = this.state().get('couponId');
    const { res } = (await webApi.editCoupon(params)) as any;
    if (res.code === Const.SUCCESS_CODE) {
      message.success('修改优惠券成功!');
      history.push('/coupon-list');
    } else {
      this.changeBtnDisabled();
      return new Promise((resolve) => resolve(res));
    }
  };

  /**
   * 获取请求参数
   */
  fetchParams = () => {
    const {
      couponName,
      couponType,
      couponCateIds,
      rangeDayType,
      startTime,
      endTime,
      effectiveDays,
      denomination,
      fullBuyType,
      fullBuyPrice,
      scopeType,
      chooseBrandIds,
      chooseCateIds,
      couponDesc,
      chooseSkuIds,
      prompt
    } = this.state().toJS();

    let params = {
      couponName,
      couponType,
      cateIds: couponCateIds,
      rangeDayType,
      denomination,
      fullBuyType,
      scopeType,
      couponDesc,
      prompt
    } as any;

    if (rangeDayType === 0) {
      params.startTime = startTime + ' 00:00:00';
      params.endTime = endTime + ' 23:59:59';
    } else if (rangeDayType === 1) {
      params.effectiveDays = effectiveDays;
    }

    if (fullBuyType === 1) {
      params.fullBuyPrice = fullBuyPrice;
    }

    if (scopeType === 0) {
      params.scopeIds = [];
    } else if (scopeType === 1) {
      params.scopeIds = chooseBrandIds;
    } else if (scopeType === 3) {
      params.scopeIds = chooseCateIds;
    } else if (scopeType === 4) {
      params.scopeIds = chooseSkuIds;
    }
    return params;
  };

  /**
   * 获取优惠券的关联信息
   */
  fetchScope = async (value, scopeIds?) => {
    //加载品牌
    const { res: brandRes } = await webApi.fetchBrands();
    //加载店铺分类
    const { res } = await webApi.fetchCates();
    const { code, context } = res as any;
    if (brandRes.code === Const.SUCCESS_CODE) {
      this.dispatch('coupon: info: field: value', {
        field: 'brands',
        value: brandRes.context
      });
      //过滤已删除的品牌
      if (value == 1 && scopeIds) {
        scopeIds = scopeIds.filter((id) =>
          brandRes.context.find((brand) => brand.brandId == id)
        );
      }
    }

    if (code == Const.SUCCESS_CODE) {
      this.dispatch('coupon: info: field: value', {
        field: 'cates',
        value: context
      });
      //过滤已删除的分类
      if (value == 3 && scopeIds) {
        scopeIds = scopeIds.filter((id) =>
          context.find((cate) => cate.storeCateId == id)
        );
        this.dispatch('coupon: info: cates', context);
      }
    }
    return scopeIds;
  };

  /**
   * 点击完成，保存用户选择的商品信息
   * @param skuIds
   * @param rows
   */
  onOkBackFun = (skuIds, rows) => {
    //保存商品信息
    this.dispatch('coupon: info: field: value', {
      field: 'chooseSkuIds',
      value: skuIds
    });
    this.dispatch('coupon: info: field: value', {
      field: 'goodsRows',
      value: rows
    });
    //关闭弹窗
    this.dispatch('coupon: info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   *选择的商品ids，还有具体的商品列表
   */
  rowChangeBackFun = (selectedRowKeys, rows) => {
    this.dispatch('coupon: info: field: value', {
      chooseSkuIds: selectedRowKeys
    });
    this.dispatch('coupon: info: field: value', { goodsRows: rows });
  };

  /**
   * 删除选中的商品
   */
  deleteSelectedSku = (id) => {
    this.dispatch('delete: selected: sku', id);
  };

  /**
   * 选择商品弹框的关闭按钮
   */
  onCancelBackFun = () => {
    this.dispatch('coupon: info: field: value', {
      field: 'goodsModalVisible',
      value: false
    });
  };

  /**
   * 改变按钮禁用状态
   */
  changeBtnDisabled = () => {
    this.dispatch('coupon: info: btn: disabled');
  };

  /**
   * 处理特殊的错误码
   */
  dealErrorCode = async (res) => {
    const couponCates = this.state().get('couponCates').toJS();
    const errorIds = res.context;
    let errorsNames = couponCates.filter((cate) =>
      errorIds.find((id) => cate.couponCateId == id)
    );
    let errorsName = '';
    errorsNames.forEach((i) => {
      errorsName = errorsName + i.couponCateName + ',';
    });
    errorsName = errorsName.substring(0, errorsName.length - 1);
    let ids = this.state().get('couponCateIds');
    Modal.info({
      content: `${errorsName}优惠券分类不存在，请重新选择。`,
      okText: '好的'
    });
    ids = ids.filter((cate) => !errorIds.find((i) => i == cate));
    //删除不存在的分类id
    this.dispatch('coupon: info: field: value', {
      field: 'couponCateIds',
      value: ids
    });
    await this.fetchCouponCate();
    return new Promise((resolve) => resolve(ids));
  };
}
