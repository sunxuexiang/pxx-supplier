import { IOptions, Store } from 'plume2';
import { IList, IMap } from 'typings/globalType';
import { fromJS, List, Map, OrderedMap } from 'immutable';
import { message } from 'antd';
import { Const, history, util, FindArea } from 'qmkit';

import GoodsActor from './actor/goods-actor';
import SpecActor from './actor/spec-actor';
import PriceActor from './actor/price-actor';
import UserActor from './actor/user-actor';
import FormActor from './actor/form-actor';
import ModalActor from './actor/modal-actor';

import {
  edit,
  editPrice,
  fetchImages,
  getBossUserLevelList,
  getBossUserList,
  getBossUserListByName,
  getGoodsDetail,
  getImgCates,
  getUserLevelList,
  getUserList,
  syncSkuStock,
  syncErpGoodsWareStock
} from './webapi';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      window['_store'] = this;
    }
  }

  bindActor() {
    return [
      new GoodsActor(),
      new SpecActor(),
      new PriceActor(),
      new UserActor(),
      new FormActor(),
      new ModalActor()
    ];
  }

  /**
   * 初始化
   */
  init = async (goodsId?: string) => {
    if (goodsId) {
      let userList: any;
      if (util.isThirdStore()) {
        userList = await getUserList('');
      } else {
        userList = await getBossUserList();
      }
      const sourceUserList = fromJS(userList.res.context);
      this.dispatch('userActor: setUserList', sourceUserList);
      this.dispatch('userActor: setSourceUserList', sourceUserList);

      let newLevelList = [];
      if (util.isThirdStore()) {
        const userLevelList: any = await getUserLevelList();
        userLevelList.res.context.storeLevelVOList.map((v) => {
          newLevelList.push({
            customerLevelId: v.storeLevelId,
            customerLevelName: v.levelName,
            customerLevelDiscount: v.discountRate
          });
        });
      } else {
        const userLevelList: any = await getBossUserLevelList();
        newLevelList = userLevelList.res.context.customerLevelVOList;
      }

      const userLevel = {
        customerLevelId: 0,
        customerLevelName: '全平台客户',
        customerLevelDiscount: 1
      };
      newLevelList.unshift(userLevel);
      this.dispatch('userActor: setUserLevelList', fromJS(newLevelList));

      this.dispatch('priceActor: setUserLevelList', fromJS(newLevelList));

      this._getGoodsDetail(goodsId, false);
    }
  };

  /**
   * 重新获取最新库存信息
   * @param goodsId
   */
  doInitGoodList = async (goodsId?: string) => {
    await this._getGoodsDetail(goodsId, true);
  };

  /**
   *  编辑时获取商品详情，转换数据
   */
  _getGoodsDetail = async (goodsId?: string, syncStock?: boolean) => {
    let goodRes: any = await getGoodsDetail(goodsId);
    let goodsDetail = fromJS({});
    if (goodRes.res.code == Const.SUCCESS_CODE) {
      // goodRes.res.context.goodsInfo.allowedPurchaseArea = goodRes.res.context.goodsInfo.allowedPurchaseArea.split(',');
      // goodRes.res.context.goodsInfo.allowedPurchaseAreaName = goodRes.res.context.goodsInfo.allowedPurchaseAreaName.split(',');
      console.log(
        goodRes.res.context.choseProductGoodsInfo,
        '11111111111'
      );
      goodRes.res.context.goodsInfo.choseProductGoodsInfo = goodRes.res.context.choseProductGoodsInfo;
      console.log(goodRes.res.context,'goodRes.res.contextgoodRes.res.context');
      
      // this.dispatch('goodsActor: editGoodsrAssignArea', goodRes.res.context.choseProductGoodsInfo);
      goodsDetail = fromJS(goodRes.res.context);
      let skuWareStocks;
      //新查询的同步信息
      if (syncStock) {
        let param = Map();
        let goodsInfoIds = [];
        goodsDetail = goodsDetail.set('choseProductGoodsInfo',goodRes.res.context.choseProductGoodsInfo)
        let goodsInfoId = goodsDetail.get('goodsInfo').get('goodsInfoId');
        goodsInfoIds.push(goodsInfoId);
        param = param.set('goodsInfoIds', goodsInfoIds);
        let result: any = await syncSkuStock(param.toJS());

        if (result.res.code == Const.SUCCESS_CODE) {
          result = fromJS(result.res.context);
        } else {
          message.error('同步最新库存信息失败');
          return false;
        }
        skuWareStocks = result.get('goodsInfoVOS');
      }
      this.dispatch('goodsActor: editGoodsrAssignArea', goodsDetail.get('goodsInfo'));
      // goodsDetail=goodsDetail.set('')
      
      // console.log(goodsDetail.get('goodsInfo').toJS(),'goodsDetail.get().allowedPurchaseArea');

      console.log(goodsDetail.toJS(),'goodsDetail')
      this.transaction(() => {
        // 商品基本信息
        let goodsInfo = goodsDetail.get('goodsInfo');
        
        let goods = goodsDetail.get('goods');
        goodsInfo=goodsInfo.set('goodsUnit',goods.get('goodsUnit'));
        console.log(goodsDetail.get('goodsInfo').toJS(), 'goodsInfogoodsInfogoodsInfogoodsInfogoodsInfo');

        this.dispatch('goodsActor: editGoods', goodsInfo);

        this.dispatch('goodsActor: spu', goods);

        // 规格
        let goodsSpecs = goodsDetail.get('goodsSpecs') || List();
        const goodsSpecDetails = goodsDetail.get('goodsSpecDetails');
        goodsSpecs = goodsSpecs.map((item) => {
          const specValues = goodsSpecDetails.filter(
            (detailItem) => detailItem.get('specId') == item.get('specId')
          );
          return item.set('specValues', specValues);
        });
        // 商品列表
        goodsInfo = goodsInfo.set('id', goodsInfo.get('goodsInfoId'));

        // 图片
        const images = goodsInfo.get('goodsInfoImg')
          ? [
            {
              uid: -1,
              name: 'sku',
              status: 'done',
              size: 10000,
              url: goodsInfo.get('goodsInfoImg'),
              artworkUrl: goodsInfo.get('goodsInfoImg')
            }
          ]
          : [];
        // 二维码
        const qrCodeImages = goodsInfo.get('goodsInfoQrcode')
          ? [
            {
              uid: -1,
              name: 'sku',
              status: 'done',
              size: 10000,
              url: goodsInfo.get('goodsInfoQrcode'),
              artworkUrl: goodsInfo.get('goodsInfoQrcode')
            }
          ]
          : [];
        goodsInfo = goodsInfo.set('images', fromJS(images));
        goodsInfo = goodsInfo.set('qrCodeImages', fromJS(qrCodeImages));
        if (skuWareStocks) {
          skuWareStocks.map((i) => {
            if (i.get('goodsInfoId') == goodsInfo.get('goodsInfoId')) {
              goodsInfo = goodsInfo.set(
                'goodsWareStocks',
                i.get('goodsWareStocks')
              );
            }
          });
        }
        const mockSpecDetailIds = goodsInfo.get('mockSpecDetailIds');
        const mockSpecIds = goodsInfo.get('mockSpecIds') || List();
        mockSpecIds.forEach((specId, index) => {
          const detailId = mockSpecDetailIds.get(index);
          const goodsSpecDetail = goodsSpecDetails.find(
            (item) => item.get('specDetailId') == detailId
          );
          goodsInfo = goodsInfo.set(
            'specId-' + specId,
            goodsSpecDetail.get('detailName')
          );
          goodsInfo = goodsInfo.set('specDetailId-' + specId, detailId);
        });
        let goodsList = List();
        goodsList = goodsList.push(goodsInfo);
        this.dispatch('goodsSpecActor: init', {
          goodsSpecs: goodsSpecs,
          goodsList
        });

        this.dispatch(
          'priceActor: editLevelDiscountFlag',
          goodsInfo.get('levelDiscountFlag')
        );

        // 价格
        let aloneFlag = goodsInfo.get('aloneFlag');
        aloneFlag = aloneFlag ? aloneFlag : false;
        this.dispatch('priceActor: switchAloneFlag', aloneFlag);
        const goodsLevelPrices = goodsDetail.get('goodsLevelPrices');
        const priceOpt = this.state().get('spu').get('priceType');
        const openUserPrice = goodsInfo.get('customFlag') == 1 ? true : false;
        this.dispatch('priceActor: editPriceSetting', {
          key: 'priceOpt',
          value: priceOpt
        });
        this.dispatch('priceActor: editPriceSetting', {
          key: 'marketPrice',
          value: goodsInfo.get('marketPrice')
        });
        this.dispatch('priceActor: editPriceSetting', {
          key: 'vipPrice',
          value: goodsInfo.get('vipPrice')
        });
        this.dispatch('priceActor: editPriceSetting', {
          key: 'costPrice',
          value: goodsInfo.get('costPrice')
        });
        this.dispatch('priceActor: editPriceSetting', {
          key: 'openUserPrice',
          value: openUserPrice
        });

        if (priceOpt == 0) {
          // 级别价
          let levelPriceMap = Map();
          if (goodsLevelPrices) {
            goodsLevelPrices.forEach((item) => {
              levelPriceMap = levelPriceMap.set(item.get('levelId') + '', item);
            });
          }
          this.dispatch('priceActor: initPrice', {
            key: 'userLevelPrice',
            priceMap: levelPriceMap
          });

          // 密价
          if (openUserPrice) {
            const userList = this.state().get('userList');
            let userPriceMap = OrderedMap();
            let goodsCustomerPrices = goodsDetail.get('goodsCustomerPrices');
            if (goodsCustomerPrices) {
              goodsCustomerPrices.forEach((item) => {
                const user = userList.find(
                  (userItem) =>
                    userItem.get('customerId') == item.get('customerId')
                );
                item = item.set('userLevelName', user.get('customerLevelName'));
                item = item.set('userName', user.get('customerName'));
                userPriceMap = userPriceMap.set(
                  item.get('customerId') + '',
                  item
                );
              });
            }

            this.dispatch('priceActor: initPrice', {
              key: 'userPrice',
              priceMap: userPriceMap
            });
          }
        } else {
          // 区间价
          let areaPriceMap = Map();
          if (goodsDetail.get('goodsIntervalPrices')) {
            goodsDetail.get('goodsIntervalPrices').forEach((item) => {
              areaPriceMap = areaPriceMap.set(
                item.get('intervalPriceId') + '',
                item
              );
            });
            this.dispatch('priceActor: initPrice', {
              key: 'areaPrice',
              priceMap: areaPriceMap
            });
          }
        }
      });
    }
  };

  choseProductSkuId = (choseProductSkuId) => {
    console.log('goodsActor: choseProductSkuId', choseProductSkuId);

    this.dispatch('goodsActor: choseProductSkuId', choseProductSkuId);
  };

  /**
   * 修改商品基本信息
   */
  editGoods = (goods: IMap) => {
    if (goods.get('marketPrice') != undefined) {
      const levelPriceForm = this.state().get('levelPriceForm');
      const skuForm = this.state().get('skuForm');
      skuForm.setFieldsValue(goods.toJS());
      if (levelPriceForm && levelPriceForm.size) {
        levelPriceForm.setFieldsValue(goods.toJS());
      }
    }
    console.log(goods.toJS(), 'goods123123');

    this.dispatch('goodsActor: editGoods', goods);
  };

  /**
   * 同步wms库存
   * @param erpGoodsInfoNo
   * @param goodsInfoId
   */
  syncErpStock = async (erpGoodsInfoNo, goodsInfoId) => {
    let skuWareStocks;
    //查询wms接口返回库存信息
    await syncErpGoodsWareStock({
      erpGoodsInfoNo: erpGoodsInfoNo,
      goodsInfoId: goodsInfoId
    }).then(({ res, err }) => {
      if (res.code !== Const.SUCCESS_CODE) {
        message.error('同步最新库存信息失败！');
      }
      if (res.code == Const.SUCCESS_CODE) {
        message.info('同步成功！');
        const goodsWareStockVOS = res.context.goodsWareStockVOS;
        let goodsList = this.state().get('goodsList');
        let goodsSpecs = this.state().get('goodsSpecs');
        if (goodsList) {
          let goodsInfoList = goodsList.map((g) => {
            if (g.get('goodsInfoId') == goodsInfoId) {
              g = g.set('goodsWareStocks', goodsWareStockVOS);
            }
            return g;
          });
          goodsInfoList = fromJS(goodsInfoList);
          this.dispatch('goodsSpecActor: init', {
            goodsSpecs,
            goodsList: goodsInfoList
          });
        }
      }
    });
  };

  /**
   * 修改商品属性
   */
  editGoodsItem = (id: string, key: string, value: any) => {
    console.info(id);
    console.info(key);
    console.info(value);
    // return
    this.dispatch('goodsSpecActor: editGoodsItem', { id, key, value });
  };

  gPack = (id: string, key: string, value: any) => {
    // console.log(value, '222222222222222222');

    //this.dispatch('goodsSpecActor: gPack',  { id, key, value });
  };

  /**
   * 更改设价方式
   * @param state
   * @param priceOpt
   */
  editPriceSetting = (key: string, value: any) => {
    this.dispatch('priceActor: editPriceSetting', { key, value });
  };

  /**
   * 修改级别价单个属性
   * @param state
   * @param param1
   */
  editUserLevelPriceItem = (
    userLevelId: string,
    key: string,
    value: string
  ) => {
    this.dispatch('priceActor: editUserLevelPriceItem', {
      userLevelId,
      key,
      value
    });
  };

  /**
   * 修改用户价
   */
  editUserPrice = (userId: string, userName: string, userLevelName: string) => {
    this.dispatch('priceActor: editUserPrice', {
      userId,
      userName,
      userLevelName
    });
  };

  /**
   * 删除级别价
   */
  deleteUserPrice = (userId: string) => {
    this.dispatch('priceActor: deleteUserPrice', userId);
  };

  /**
   * 修改客户价单个属性
   */
  editUserPriceItem = (userId: string, key: string, value: string) => {
    this.dispatch('priceActor: editUserPriceItem', { userId, key, value });
  };

  /**
   * 修改客户价单个属性
   */
  editAreaPriceItem = (id: string, key: string, value: string) => {
    this.dispatch('priceActor: editAreaPriceItem', { id, key, value });
  };

  /**
   * 删除区间价
   */
  deleteAreaPrice = (id: string) => {
    this.dispatch('priceActor: deleteAreaPrice', id);
  };

  /**
   * 新增区间价
   */
  addAreaPrice = () => {
    this.dispatch('priceActor: addAreaPrice');
  };

  updateSkuForm = (skuForm) => {
    // console.log(skuForm, 'skuForm');

    this.dispatch('formActor:sku', skuForm);
  };

  updateLevelPriceForm = (levelPriceForm) => {
    this.dispatch('formActor:levelprice', levelPriceForm);
  };

  updateUserPriceForm = (userPriceForm) => {
    this.dispatch('formActor:userprice', userPriceForm);
  };

  updateAreaPriceForm = (areaPriceForm) => {
    this.dispatch('formActor:areaprice', areaPriceForm);
  };

  updateAddedFlagForm = (addedFlagForm) => {
    this.dispatch('formActor:addedFlag', addedFlagForm);
  };

  updateeditGoodsisscatt = (isScatteredQuantitative) => {
    console.log(isScatteredQuantitative);
    console.log(this);
    // return
    this.dispatch('formActor:updateeditGoodsisscatt', isScatteredQuantitative);
    // this.dispatch('formActor:setisScatteredQuantitative',isScatteredQuantitative)
  };
  /**
   * 对基本信息表单进行校验
   * @returns {boolean}
   * @private
   */
  _validMainForms() {
    let valid = true;
    // 校验表单
    this.state()
      .get('skuForm')
      .validateFieldsAndScroll(null, (errs) => {
        valid = valid && !errs;
        if (!errs) {
        }
      });
    return valid;
  }

  /**
   * 对设价表单进行校验
   * @returns {boolean}
   * @private
   */
  _validPriceForms() {
    let valid = true;
    // 校验表单
    if (
      this.state().get('levelPriceForm') &&
      this.state().get('levelPriceForm').validateFieldsAndScroll
    ) {
      this.state()
        .get('levelPriceForm')
        .validateFieldsAndScroll(null, (errs) => {
          valid = valid && !errs;
          if (!errs) {
          }
        });
    }

    if (
      this.state().get('userPriceForm') &&
      this.state().get('userPriceForm').validateFieldsAndScroll
    ) {
      this.state()
        .get('userPriceForm')
        .validateFieldsAndScroll(null, (errs) => {
          valid = valid && !errs;
          if (!errs) {
          }
        });
    }
    if (
      this.state().get('areaPriceForm') &&
      this.state().get('areaPriceForm').validateFieldsAndScroll
    ) {
      this.state()
        .get('areaPriceForm')
        .validateFieldsAndScroll(null, (errs) => {
          valid = valid && !errs;
          if (!errs) {
          }
        });
    }

    return valid;
  }

  validMain = () => {
    return this._validMainForms();
  };

  changeAreas = (value, label) => {
    console.info(value, label);
    this.dispatch('areas: changeArea', { value, label });
  };

  // 单笔指定区域销售
  singleOrderAssignArea = (value, label) => {

    console.info(value, label, '-----ooo');
    if (label.length == 0) {
      label = ['传空']
    }
    this.dispatch('areas: singleOrderAssignArea', { value, label });
  };

  // 指定区域销售
  goodsSalesCountOfOneMonth = (value, label) => {

    console.info(value, label, '-----ooo');
    if (label.length == 0) {
      label = ['传空']
    }
    this.dispatch('areas: changeCityArea', { value, label });
  };

  /**
   * 保存基本信息
   */
  saveMain = async () => {
    if (!this._validMainForms()) {
      return false;
    }

    const data = this.state();
    const { areaParam, cityAreaParam, singleOrderAssignAreaParam } = this.state().toJS();
    const isScatteredQuantitative = sessionStorage.getItem(
      'isScatteredQuantitative'
    );

    let param = Map();
    // -----商品信息-------
    let goodsInfo = data.get('goodsList').first();

    // 单笔限购区域
    const allowedPurchaseAreas =
      singleOrderAssignAreaParam.destinationArea.length > 0
        ? singleOrderAssignAreaParam.destinationArea.join(',')
        : null;
    const allowedPurchaseAreaNames =
      singleOrderAssignAreaParam.destinationAreaName.length > 0
        ? singleOrderAssignAreaParam.destinationAreaName.join(',')
        : null;
    goodsInfo = goodsInfo.set(
      'isSuitGoods',
      data.getIn(['goods', 'isSuitGoods'])
    );

    // console.log(goodsInfo.toJS(), '0000909090', data.get('choseProductSkuId'));
    if (goodsInfo.get('isSuitGoods') == 1 && data.get('choseProductSkuId').length == 1) {
      goodsInfo = goodsInfo.set(
        'choseProductSkuId',
        data.get('choseProductSkuId').toString()
      );
    }


    // return
    if (allowedPurchaseAreaNames == '传空') {
      goodsInfo = goodsInfo.set(
        'singleOrderAssignAreaName',
        ''
      );
      // 单笔限购区
      goodsInfo = goodsInfo.set(
        'singleOrderAssignArea',
        ''
      );
    } else {
      if (allowedPurchaseAreas) {
        // 单笔限购区
        goodsInfo = goodsInfo.set(
          'singleOrderAssignAreaName',
          allowedPurchaseAreaNames
        );
        // 单笔限购区
        goodsInfo = goodsInfo.set('singleOrderAssignArea', allowedPurchaseAreas);
      } else {
        // 没有改变的时候
        // 单笔限购区
        goodsInfo = goodsInfo.set(
          'singleOrderAssignAreaName',
          goodsInfo.get('singleOrderAssignAreaName')
        );
        // 单笔限购区
        goodsInfo = goodsInfo.set(
          'singleOrderAssignArea',
          goodsInfo.get('singleOrderAssignArea')
        );
      }
    }

    // return
    // 销售区域
    const allowedPurchaseArea =
      cityAreaParam.destinationArea.length > 0
        ? cityAreaParam.destinationArea.join(',')
        : null;
    const allowedPurchaseAreaName =
      cityAreaParam.destinationAreaName.length > 0
        ? cityAreaParam.destinationAreaName.join(',')
        : null;

    console.log(allowedPurchaseAreaName, '指定销售区域', allowedPurchaseArea);

    if (allowedPurchaseAreaName == '传空') {
      goodsInfo = goodsInfo.set(
        'allowedPurchaseAreaName',
        ''
      );
      // 销售区
      goodsInfo = goodsInfo.set(
        'allowedPurchaseArea',
        ''
      );
    } else {
      if (allowedPurchaseArea) {
        // 销售区
        goodsInfo = goodsInfo.set(
          'allowedPurchaseAreaName',
          allowedPurchaseAreaName
        );
        // 销售区
        goodsInfo = goodsInfo.set('allowedPurchaseArea', allowedPurchaseArea);
      } else {
        // 没有改变的时候
        // 销售区
        goodsInfo = goodsInfo.set(
          'allowedPurchaseAreaName',
          goodsInfo.get('allowedPurchaseAreaName')
        );
        // 销售区
        goodsInfo = goodsInfo.set(
          'allowedPurchaseArea',
          goodsInfo.get('allowedPurchaseArea')
        );
      }
    }


    // return
    ///包装类型
    if (isScatteredQuantitative == '' || isScatteredQuantitative == undefined) {
      goodsInfo = goodsInfo.set(
        'isScatteredQuantitative',
        goodsInfo.get('isScatteredQuantitative')
      );
    } else {
      goodsInfo = goodsInfo.set(
        'isScatteredQuantitative',
        isScatteredQuantitative
      );
    }
    // allowedPurchaseArea
    // allowedPurchaseAreaName
    sessionStorage.removeItem('isScatteredQuantitative');
    const arrea = FindArea.findProvinceCity([]);
    let isfalse = false;
    arrea.forEach((el) => {
      if (el.key == areaParam.destinationArea) {
        if (el.children[0].label != areaParam.destinationAreaName[0]) {
          isfalse = true;
          return;
        } else {
          goodsInfo = goodsInfo.set('origin', areaParam.destinationAreaName[0]);
          goodsInfo = goodsInfo.set('originCode', areaParam.destinationArea);
        }
      } else {
        if (!isfalse) {
          el.children.forEach((vl) => {
            if (vl.label == areaParam.destinationAreaName[0]) {
              goodsInfo = goodsInfo.set(
                'origin',
                el.label + areaParam.destinationAreaName[0]
              );
              goodsInfo = goodsInfo.set(
                'originCode',
                areaParam.destinationArea
              );
            }
          });
        }
      }
    });
    if (isfalse) {
      message.error('请选择市。');
      return;
    }
    // goodsInfo = goodsInfo.set(
    //   'origin',
    //   areaParam.destinationAreaName[0]
    // );
    // console.log(areaParam, '2222');
    // console.log(arrea, '333');
    // console.log(goodsInfo.get('origin'));

    // return;
    // 上下架
    goodsInfo = goodsInfo.set('addedFlag', data.getIn(['goods', 'addedFlag']));
    // console.log(singleOrderAssignAreaParam.destinationArea.length, '----------------------', data.getIn(['goods', 'singleOrderAssignArea']), '----------------------', data.getIn(['goods', 'stock']));
    // 单笔限购不能大于库存

    goodsInfo = goodsInfo.set('singleOrderPurchaseNum', data.getIn(['goods', 'singleOrderPurchaseNum']));


    // 单笔订单限购数量
    if (singleOrderAssignAreaParam.destinationArea.length == 0 && !data.getIn(['goods', 'singleOrderAssignArea'])) {
      goodsInfo = goodsInfo.set('singleOrderPurchaseNum', '');
      console.log(data.getIn(['goods', 'singleOrderPurchaseNum']), 'singleOrderAssignAreaParam.123456');
    } else {
      console.log(222222222221);
      if (singleOrderAssignAreaParam.destinationArea.length > 0 && data.getIn(['goods', 'singleOrderPurchaseNum']) <= 0) {
        message.error('请填写大于0的值')
        return
      }
      else if (singleOrderAssignAreaParam.destinationArea.length > 0 && !data.getIn(['goods', 'singleOrderPurchaseNum']) || data.getIn(['goods', 'singleOrderPurchaseNum']) == ' ') {
        message.error('请填写单笔订单限购数量');
        console.log(data.getIn(['goods', 'singleOrderPurchaseNum']), 'singleOrderAssignAreaParam.destinationArea');
        return
      }
      goodsInfo = goodsInfo.set('singleOrderPurchaseNum', data.getIn(['goods', 'singleOrderPurchaseNum']));
      console.log(data.getIn(['goods', 'singleOrderPurchaseNum']), 'singleOrderAssignAreaParam.456789');
    }
    // return
    // 商品询价设置
    goodsInfo = goodsInfo.set(
      'inquiryFlag',
      data.getIn(['goods', 'inquiryFlag'])
    );
    // 商品询价设置
    goodsInfo = goodsInfo.set(
      'virtualStock',
      data.getIn(['goods', 'virtualStock'])
    );
    // 商品起购设置
    goodsInfo = goodsInfo.set(
      'isStartBuyNum',
      data.getIn(['goods', 'isStartBuyNum'])
    );
    // 商品起购设置
    goodsInfo = goodsInfo.set(
      'startBuyNum',data.get('goods').get('startBuyNum')?data.getIn(['goods', 'startBuyNum']):1
    );
    // 商品起购（单位）
    goodsInfo = goodsInfo.set(
      'goodsUnit',
      data.getIn(['goods', 'goodsUnit'])
    );
    // if(!data.get('goodsInfo')?.get('retailGoodsDescribe')){
       // 商品起购（单位）
      goodsInfo = goodsInfo.set(
        'retailGoodsDescribe',`一箱等于${goodsInfo.get('startBuyNum')}${goodsInfo.get('goodsUnit')}`
      );
    // };
   
    console.log(goodsInfo.toJS(), 'goodsInfogoodsInfogoodsInfogoodsInfo');

    // 图片
    let imageUrl = null;

    if (
      goodsInfo.get('images') != null &&
      goodsInfo.get('images').count() > 0
    ) {
      imageUrl = goodsInfo.get('images').toJS()[0].artworkUrl;
    }
    //二维码
    let qrCodeImageUrl = null;
    if (
      goodsInfo.get('qrCodeImages') != null &&
      goodsInfo.get('qrCodeImages').count() > 0
    ) {
      qrCodeImageUrl = goodsInfo.get('qrCodeImages').toJS()[0].artworkUrl;
    }
    goodsInfo = goodsInfo.set('goodsInfoImg', imageUrl);
    goodsInfo = goodsInfo.set('goodsInfoQrcode', qrCodeImageUrl);
    goodsInfo = goodsInfo.set('goodsInfoQrcode', qrCodeImageUrl);
    goodsInfo = goodsInfo.set(
      'goodsWareStocks',
      goodsInfo.get('goodsWareStocks')
    );
    goodsInfo = goodsInfo.set('vipPrice', data.getIn(['goods', 'vipPrice']));
    goodsInfo = goodsInfo.set(
      'marketPrice',
      data.getIn(['goods', 'marketPrice'])
    );
    goodsInfo = goodsInfo.set('costPrice', data.getIn(['goods', 'costPrice']));

    param = param.set('goodsInfo', goodsInfo);

    //保存参数
    // console.info('--param--');
    // console.info(data.get('selectList').toJS());
    // console.info(goodsInfo.get('goodsWareStocks').toJS());
    // console.info(param.toJS());
    // console.info(data.toJS());
    this.dispatch('goodsActor: saveLoading', true);
    let result: any;
    result = await edit(param.toJS());

    this.dispatch('goodsActor: saveLoading', false);

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      return true;
    } else {
      message.error(result.res.message);
    }

    return false;
  };

  /**
   * 保存基本信息和设价信息
   */
  saveAll = async () => {
    if (!this._validMainForms() || !this._validPriceForms()) {
      return false;
    }

    const data = this.state();
    let param = Map();

    // -----商品信息-------
    let goodsInfo = data.get('goodsList').first();
    // 上下架
    goodsInfo = goodsInfo.set('addedFlag', data.getIn(['goods', 'addedFlag']));
    // 图片
    let imageUrl = null;
    if (
      goodsInfo.get('images') != null &&
      goodsInfo.get('images').count() > 0
    ) {
      imageUrl = goodsInfo.get('images').toJS()[0].artworkUrl;
    }
    //二维码
    let qrCodeImageUrl = null;
    if (
      goodsInfo.get('qrCodeImages') != null &&
      goodsInfo.get('qrCodeImages').count() > 0
    ) {
      qrCodeImageUrl = goodsInfo.get('qrCodeImages').toJS()[0].artworkUrl;
    }
    goodsInfo = goodsInfo.set('goodsInfoImg', imageUrl);
    goodsInfo = goodsInfo.set('goodsInfoQrcode', qrCodeImageUrl);
    goodsInfo = goodsInfo.set(
      'goodsWareStocks',
      goodsInfo.get('goodsWareStocks')
    );
    goodsInfo = goodsInfo.set('vipPrice', data.getIn(['goods', 'vipPrice']));
    goodsInfo = goodsInfo.set(
      'marketPrice',
      data.getIn(['goods', 'marketPrice'])
    );
    goodsInfo = goodsInfo.set('costPrice', data.getIn(['goods', 'costPrice']));

    // 是否按客户单独定价
    goodsInfo = goodsInfo.set('customFlag', data.get('openUserPrice') ? 1 : 0);
    // 是否叠加客户等级折扣
    goodsInfo = goodsInfo.set(
      'levelDiscountFlag',
      data.get('levelDiscountFlag') ? 1 : 0
    );

    param = param.set('goodsInfo', goodsInfo);

    // -----商品等级价格列表-------
    let isErr = false;

    // 是否独立设价
    param = param.setIn(['goodsInfo', 'aloneFlag'], data.get('aloneFlag'));

    data.get('userLevelPrice').forEach((value) => {
      if (
        value.get('count') != null &&
        value.get('maxCount') != null &&
        value.get('count') > value.get('maxCount')
      ) {
        isErr = true;
      }
    });
    if (isErr) {
      message.error('起订量不允许超过限订量');
      return false;
    }
    const goodsLevelPrices = data.get('userLevelPrice').valueSeq().toList();
    param = param.set('goodsLevelPrices', goodsLevelPrices);

    // -----商品客户价格列表-------
    data.get('userPrice').forEach((value) => {
      if (
        value.get('count') != null &&
        value.get('maxCount') != null &&
        value.get('count') > value.get('maxCount')
      ) {
        isErr = true;
      }
    });
    if (isErr) {
      message.error('起订量不允许超过限订量');
      return false;
    }
    const userPrice = data.get('userPrice').valueSeq().toList();
    param = param.set('goodsCustomerPrices', userPrice);

    // -----商品订货区间价格列表-------
    const areaPrice = data.get('areaPrice').valueSeq().toList();
    //验证订货区间是否重复
    if (areaPrice != null && areaPrice.count() > 0) {
      let cmap = Map();
      let isExist = false;
      areaPrice.forEach((value) => {
        if (cmap.has(value.get('count') + '')) {
          isExist = true;
        } else {
          cmap = cmap.set(value.get('count') + '', '1');
        }
      });

      if (isExist) {
        message.error('订货区间不允许重复');
        return false;
      }
    }

    param = param.set('goodsIntervalPrices', areaPrice);

    this.dispatch('goodsActor: saveLoading', true);

    let result: any;
    result = await editPrice(param.toJS());

    this.dispatch('goodsActor: saveLoading', false);

    if (result.res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      history.goBack();
    } else {
      message.error(result.res.message);
    }
  };

  /**
   * 客户搜索
   */
  searchUserList = async (customerName?: string) => {
    //判断是否是自营店铺 自营店铺根据用户名查询 非自营店铺前台过滤查询
    if (util.isThirdStore()) {
      const userList = this.state()
        .get('sourceUserList')
        .filter((user) => user.get('customerName').indexOf(customerName) > -1);
      this.dispatch('userActor: setUserList', userList);
    } else {
      if (customerName) {
        const userList: any = await getBossUserListByName(customerName);
        this.dispatch('userActor: setUserList', fromJS(userList.res.context));
      } else {
        const userList: any = await getBossUserList();
        this.dispatch('userActor: setUserList', fromJS(userList.res.context));
      }
    }
  };

  /**
   * 更新等级起订量选中状态
   */
  updateLevelCountChecked = async (levelCountChecked?: boolean) => {
    this.dispatch('priceActor: editLevelCountChecked', levelCountChecked);
  };

  /**
   * 同步等级起订量
   */
  synchLevelCount = async () => {
    this.dispatch('priceActor: synchLevelCount');
  };

  /**
   * 更新等级限订量选中状态
   */
  updateLevelMaxCountChecked = async (levelMaxCountChecked?: boolean) => {
    this.dispatch('priceActor: editLevelMaxCountChecked', levelMaxCountChecked);
  };

  /**
   * 同步等级限订量
   */
  synchLevelMaxCount = async () => {
    this.dispatch('priceActor: synchLevelMaxCount');
  };

  /**
   * 更新客户起订量选中状态
   */
  updateUserCountChecked = async (userCountChecked?: boolean) => {
    this.dispatch('priceActor: editUserCountChecked', userCountChecked);
  };

  /**
   * 同步客户起订量
   */
  synchUserCount = async () => {
    this.dispatch('priceActor: synchUserCount');
  };

  /**
   * 更新客户限订量选中状态
   */
  updateUserMaxCountChecked = async (userCountChecked?: boolean) => {
    this.dispatch('priceActor: editUserMaxCountChecked', userCountChecked);
  };

  /**
   * 同步客户限订量
   */
  synchUserMaxCount = async () => {
    this.dispatch('priceActor: synchUserMaxCount');
  };

  modalVisible = async (maxCount: number, imgType: number, skuId: string) => {
    if (this.state().get('visible')) {
      this.initImg({ pageNum: 0, cateId: '', successCount: 0 });
    }
    if (maxCount) {
      //取消时候, 该值为0, 不重置, 防止页面渲染太快, 看到数量变化不友好
      this.dispatch('modal: maxCount', maxCount);
    }
    this.dispatch('modal: visible', { imgType, skuId });
  };

  /**
   * 初始化
   */
  initImg = async (
    { pageNum, cateId, successCount } = {
      pageNum: 0,
      cateId: null,
      successCount: 0
    }
  ) => {
    const cateList: any = await getImgCates();
    const cateListIm = this.state().get('cateAllList');
    if (cateId == -1) {
      cateId = fromJS(cateList.res)
        .filter((item) => item.get('isDefault') == 1)
        .get(0)
        .get('cateId');
    }
    cateId = cateId ? cateId : this.state().get('cateId');
    const imageList: any = await fetchImages({
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
   * 放大还原图片
   */
  clickImg = (imgUrl: string) => {
    this.dispatch('modal: imgVisible', imgUrl);
  };

  /**
   * 移除图片
   * @param id
   */
  removeImg = ({ type, id }) => {
    if (type === 0) {
      this.dispatch('imageActor: remove', id);
    } else {
      this.dispatch('goodsSpecActor: removeImg', id);
    }
  };

  /**
   * 移除二维码
   * @param id
   */
  removeQrImg = ({ id }) => {
    this.dispatch('goodsQrSpecActor: removeQrImg', id);
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
   * 点击搜索保存搜索内容
   * @param {string} searchName
   * @returns {Promise<void>}
   */
  saveSearchName = async (searchName: string) => {
    this.dispatch('modal: searchName', searchName);
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
    if (imgType === 1) {
      const skuId = this.state().get('skuId');
      this.dispatch('goodsSpecActor: editGoodsItem', {
        id: skuId,
        key: 'images',
        value: chooseImgs
      });
    } else if (imgType === -1000) {
      const skuId = this.state().get('skuId');
      this.dispatch('goodsSpecActor: editGoodsItem', {
        id: skuId,
        key: 'qrCodeImages',
        value: chooseImgs
      });
    }
  };

  /**
   * 清除选中的图片集合
   */
  cleanChooseImgs = () => {
    this.dispatch('modal: cleanChooseImg');
  };

  /**
   * 切换 基础信息 与 价格及订货量 tab
   * @param activeKey
   * @param executeValid 是否执行基本信息校验
   */
  onMainTabChange = (activeKey, executeValid: boolean = true) => {
    if (executeValid) {
      // 基本信息校验不通过，不允许进行切换
      if ('price' === activeKey && !this._validMainForms()) {
        return;
      }
    }
    this.dispatch('goodsActor: tabChange', activeKey);
  };

  /**
   * 切换是否保持独立设价
   */
  switchAloneFlag = (flag) => {
    this.dispatch('priceActor: switchAloneFlag', flag);
  };

  /**
   * 修改商品库存
   * @param disabled
   */
  editGoodsStock = (
    id: string,
    storeWareId: number,
    key: string,
    value: string
  ) => {
    this.dispatch('goodsSpecActor: editGoodsStock', {
      id,
      key,
      value,
      storeWareId
    });
  };
}
