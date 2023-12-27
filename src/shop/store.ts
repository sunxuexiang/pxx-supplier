import { Store } from 'plume2';

import { message } from 'antd';
import { fromJS, Map } from 'immutable';

import { Const, history, cache } from 'qmkit';

import ModalActor from './actor/modal-actor';
import CommonActor from './actor/common-actor';
import CompanyActor from './actor/company-actor';
import { reLogin } from '../login/loginUtil';
import staticData from './components/staticContractInfo';
import moment from 'moment';
import * as webApi from './webapi';
import * as _ from 'lodash';

export default class AppStore extends Store {
  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  bindActor() {
    return [new ModalActor(), new CommonActor(), new CompanyActor()];
  }

  /**
   * 品牌弹窗
   */
  brandModal = async () => {
    //加载所有品牌
    const { res } = await webApi.getAllBrands({
      likeBrandName: ''
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('company:allBrands', fromJS(res.context));
    } else {
      message.error(res.message);
    }
    this.transaction(() => {
      this.dispatch('modalActor: brandModal');
      this.dispatch('detail:deleteBrand', fromJS(new Array()));
    });
  };

  /**
   * 显示类目弹窗
   */
  sortModal = async () => {
    const sortsVisible = this.state().get('sortsVisible');
    const { res: cateList } = await webApi.getCateList();
    if (!sortsVisible) {
      const list = fromJS(cateList.context).map((info) => {
        if (!info.get('qualificationPics')) {
          info = info.set('qualificationPics', '');
        }
        const qualificationPics =
          info.get('qualificationPics') &&
          info
            .get('qualificationPics')
            .split(',')
            .map((url, index) => {
              return Map({ uid: index + 1, status: 'done', url });
            });
        info = info.set('qualificationPics', JSON.stringify(qualificationPics));
        return info;
      });
      const { res: cates } = await webApi.fetchAllCates();
      this.transaction(() => {
        this.dispatch('modal: cates', list);
        this.dispatch('modal: cate: loading: over');
        this.dispatch('modal: AllCates', fromJS(cates.context));
      });
    }
    this.transaction(() => {
      this.dispatch('modal: cate: delete', fromJS([]));
      this.dispatch('modalActor: sortModal');
      this.dispatch('detail:cate', fromJS(cateList.context));
    });
  };

  /**
   * 显示批发市场/商城分类弹窗
   */
  checkboxModal = async (modalType) => {
    let checkBoxDefaultVal = [];
    if (modalType === 0) {
      let allMarkets = this.state()
        .get('allMarkets')
        .toJS();
      if (allMarkets.length === 0) {
        const { res } = await webApi.getAllMarkets({
          pageNum: 0,
          pageSize: 10000
        });
        if (res && res.code === Const.SUCCESS_CODE && res.context) {
          allMarkets = res.context.content || [];
          this.dispatch('company:allMarkets', fromJS(allMarkets));
        }
      }
      const marketList = this.state()
        .get('company')
        .toJS().marketList;
      marketList.forEach((item) => {
        checkBoxDefaultVal.push(Number(item.relationValue));
      });
    } else {
      let allStores = this.state()
        .get('allStores')
        .toJS();
      if (allStores.length === 0) {
        const { res } = await webApi.getAllStores({
          pageNum: 0,
          pageSize: 10000
        });
        if (res && res.code === Const.SUCCESS_CODE && res.context) {
          allStores = res.context.content || [];
          this.dispatch('company:allStores', fromJS(allStores));
        }
      }
      const storeList = this.state()
        .get('company')
        .toJS().storeList;
      storeList.forEach((item) => {
        checkBoxDefaultVal.push(Number(item.relationValue));
      });
    }
    this.transaction(() => {
      this.dispatch('modal: updateDefaultVal', fromJS(checkBoxDefaultVal));
      this.dispatch('modalActor: checkboxModal');
      this.dispatch('modalActor: modalType', modalType);
    });
  };

  /**
   * 关闭批发市场/商城分类弹窗
   */
  closeCheckboxModal = () => {
    this.dispatch('modalActor: checkboxModal');
  };

  /**
   * 保存批发市场/商城分类弹窗
   */
  saveCheckbox = (modalType, values, callback) => {
    let newList;
    if (modalType === 0) {
      let allMarkets = this.state()
        .get('allMarkets')
        .toJS();
      newList = allMarkets
        .filter((item) => values.includes(item.marketId))
        .map((item) => {
          return {
            relationName: item.marketName,
            relationValue: item.marketId
          };
        });
    } else {
      let allStores = this.state()
        .get('allStores')
        .toJS();
      newList = allStores
        .filter((item) => values.includes(item.id))
        .map((item) => {
          return {
            relationName: item.tabName,
            relationValue: item.id
          };
        });
    }
    this.saveMarket(newList, modalType === 0 ? 2 : 1, true, callback);
  };

  /**
   * 保存商家签约的批发市场和商城分类
   */
  saveMarket = async (list, relationType, isClose, callback?) => {
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const params = {
      storeId: loginInfo.storeId,
      relationType,
      contactRelationList: list
    };
    this.dispatch('modal: checkBoxLoading', true);
    const { res } = await webApi.companyMallSave(params);
    this.dispatch('modal: checkBoxLoading', false);
    if (res && res.code === Const.SUCCESS_CODE) {
      message.success('操作成功!');
      this.transaction(() => {
        this.dispatch(
          relationType === 2 ? 'detail:market' : 'detail:store',
          fromJS(list)
        );
        if (isClose) {
          callback();
          this.dispatch('modalActor: checkboxModal');
        }
      });
    } else {
      message.error(res.message || '');
    }
  };

  /**
   * 当前步骤
   */
  setCurrentStep = (step) => {
    this.dispatch('common: current', step);
    switch (step) {
      case 0:
        this.init();
        break;
      case 1:
        this.fetchCompanyInfo();
        break;
      case 2:
        this.fetchSignInfo(); //编辑签约信息
        break;
      case 3:
        this.initAccount();
        break;
    }
  };

  /**
   * 查询工商信息
   */
  fetchCompanyInfo = async () => {
    const { res } = (await webApi.findOne()) as any;
    this.dispatch('company: info', res.context);
  };

  /**
   * 修改工商信息字段
   */
  mergeInfo = ({ field, value }) => {
    this.dispatch('company: merge: info', { field, value });
  };

  /**
   * 保存工商信息
   */
  saveCompanyInfo = async (info) => {
    const businessLicence =
      info.get('businessLicence') && JSON.parse(info.get('businessLicence'));
    const frontIDCard =
      info.get('frontIDCard') && JSON.parse(info.get('frontIDCard'));
    const backIDCard =
      info.get('backIDCard') && JSON.parse(info.get('backIDCard'));
    const warehouseImage =
      info.get('warehouseImage') && JSON.parse(info.get('warehouseImage'));
    const doorImage =
      info.get('doorImage') && JSON.parse(info.get('doorImage'));
    info = info
      .set(
        'businessLicence',
        (businessLicence
          ? businessLicence.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'frontIDCard',
        (frontIDCard
          ? frontIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'backIDCard',
        (backIDCard
          ? backIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'warehouseImage',
        (warehouseImage
          ? warehouseImage.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'doorImage',
        (doorImage ? doorImage.map((b) => b.thumbUrl || b.url) : []).toString()
      );
    const { res } = await webApi.saveCompanyInfo(info);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('保存成功!');
      this.setCurrentStep(2);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 删除分类
   */
  delCate = async (cateId) => {
    const cates = this.state()
      .get('cates')
      .filter((c) => c.get('cateId') != cateId);
    if (cates.count() <= 0) {
      message.error('请至少签约一种类目');
      return;
    }
    // 欲删除的分类信息
    const info = this.state()
      .get('cates')
      .filter((f) => f.get('contractCateId'))
      .find((c) => c.get('cateId') == cateId);

    const delIds = this.state().get('delCateIds');
    if (info) {
      const { res } = await webApi.checkExsit(cateId);
      if (res.code != Const.SUCCESS_CODE) {
        message.error(res.message);
        return;
      }
      this.dispatch('modal: cate: delete', delIds.concat(fromJS([cateId])));
    }
    this.dispatch('modal: cates', cates);
  };

  /**
   * 新增分类
   */
  addCate = (cateId) => {
    const cateSize = this.state().get('cateSize');
    if (cateSize >= 200) {
      message.error('最多可签约200个类目');
      return;
    }
    // 一级分类集合
    const firstLevel = this.state().get('allCates');
    // 二级分类集合
    const secondLevel = firstLevel.flatMap((f) => f.get('goodsCateList'));
    // 三级分类集合
    const thirdLevel = secondLevel.flatMap((f) => f.get('goodsCateList'));
    // 三级分类
    const third = thirdLevel.find((c) => c.get('cateId') == cateId);
    // 当前需要新增的三级分类
    let infos = [];
    if (third) {
      infos = [third];
    }
    // 已存在的分类Id
    const filterIds = this.state()
      .get('cates')
      .map((c) => c.get('cateId'));

    infos = infos
      .map((info) => {
        // 二级分类
        const secondLevelInfo = secondLevel.find(
          (f) => f.get('cateId') == info.get('cateParentId')
        );
        // 一级分类
        const firstLevelInfo = firstLevel.find(
          (f) => f.get('cateId') == secondLevelInfo.get('cateParentId')
        );
        // 设置后台返回的格式类型
        info = info
          .set(
            'parentGoodCateNames',
            firstLevelInfo.get('cateName') +
              '/' +
              secondLevelInfo.get('cateName')
          )
          .set('platformCateRate', info.get('cateRate'))
          .set('cateRate', '');
        return info;
      })
      .filter((f) => filterIds.every((i) => i != f.get('cateId')));
    console.log(infos[0].toJS());
    this.dispatch(
      'modal: cates',
      this.state()
        .get('cates')
        .concat(infos)
    );
  };

  //新增分类（全选）
  addAllCate = (checked) => {
    if (checked) {
      // 一级分类集合
      const firstLevel = this.state().get('allCates');
      // 二级分类集合
      const secondLevel = firstLevel.flatMap((f) => f.get('goodsCateList'));
      // 三级分类集合
      const thirdLevel = secondLevel.flatMap((f) => f.get('goodsCateList'));
      // let
    }
  };

  /**
   * 删除批发市场
   */
  delMarket = (rowInfo) => {
    const marketList = this.state()
      .get('company')
      .toJS().marketList;
    const newList = marketList.filter(
      (item) => item.relationValue !== rowInfo.relationValue
    );
    this.saveMarket(newList, 2, false);
  };

  /**
   * 删除商城分类
   */
  delStore = (rowInfo) => {
    const storeList = this.state()
      .get('company')
      .toJS().storeList;
    const newList = storeList.filter(
      (item) => item.relationValue !== rowInfo.relationValue
    );
    this.saveMarket(newList, 1, false);
  };

  /**
   * 修改折扣率
   */
  changeRate = ({ rate, cateId }) => {
    const cates = this.state()
      .get('cates')
      .map((c) => {
        if (c.get('cateId') == cateId) {
          c = c.set('cateRate', rate);
        }
        return c;
      });
    this.dispatch('modal: cates', cates);
  };

  /**
   * 修改图片
   */
  changeImg = ({ imgs, cateId }) => {
    const cates = this.state()
      .get('cates')
      .map((c) => {
        if (c.get('cateId') == cateId) {
          c = c.set('qualificationPics', imgs);
        }
        return c;
      });
    this.dispatch('modal: cates', cates);
  };

  /**
   * 保存
   */
  save = async () => {
    this.dispatch('modal: cate: loading');
    const cates = this.state()
      .get('cates')
      .map((info) => {
        const qualificationPics =
          info.get('qualificationPics') &&
          JSON.parse(info.get('qualificationPics'));
        info = info.set(
          'qualificationPics',
          (qualificationPics
            ? qualificationPics.map((b) => b.thumbUrl || b.url)
            : []
          ).toString()
        );
        return info;
      });
    const delCateIds = this.state().get('delCateIds');
    const { res } = await webApi.saveSignCate({
      delCateIds,
      cateSaveRequests: cates
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功!');
      this.sortModal();
    } else {
      message.error(res.message);
      this.dispatch('modal: cate: loading: over');
    }
  };

  /**
   * 通过注册协议页面
   */
  passAgree = async (params, callback?) => {
    const { res } = await webApi.fadadaRegister(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      this.getContractInfo();
      if (callback) {
        callback();
      }
      this.transaction(() => {
        this.dispatch('common:typeInfo', {
          field: 'signType',
          value: params.signType
        });
        this.dispatch('common:typeInfo', {
          field: 'isPerson',
          value: params.isPerson
        });
        this.dispatch('common:typeInfo', {
          field: 'investmentManager',
          value: params.investmentManager
        });
        this.dispatch('common:typeInfo', {
          field: 'investemntManagerId',
          value: params.investemntManagerId
        });
        if (params.signType === 0) {
          this.dispatch('common: pass');
          // this.dispatch('common: companyUrl', res.context.url);
        }
      });
    } else {
      message.error(res.message || '');
    }
  };

  //返回选择签署方式页面
  backToPass = () => {
    this.dispatch('common: pass');
  };

  //获取合同信息
  getContractInfo = async () => {
    const { res } = await webApi.findByEmployeeId();
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('common:typeInfo', {
        field: 'contractInfo',
        value: fromJS(res.context || {})
      });
      this.dispatch('common:typeInfo', {
        field: 'signImage',
        value: res.context?.signImage
      });
    } else {
      message.error(res.message || '');
    }
  };

  // 保存合同信息
  saveContractInfo = async (params) => {
    this.dispatch('common:typeInfo', {
      field: 'saveContractLoading',
      value: true
    });
    const { res } = await webApi.eidtWord(params);
    this.dispatch('common:typeInfo', {
      field: 'saveContractLoading',
      value: false
    });
    if (res && res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('common: companyUrl', res.context.url);
        this.dispatch('common:typeInfo', {
          field: 'contracted',
          value: true
        });
        this.dispatch('common:typeInfo', {
          field: 'contractInfo',
          value: fromJS(params)
        });
      });
    } else {
      message.error(res.message || '');
    }
  };

  // 修改common-actor的state
  changeCommonState = (obj) => {
    this.dispatch('common:typeInfo', obj);
  };

  /**
   * 获取签约信息
   */
  fetchSignInfo = async () => {
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const { res } = (await webApi.findOne()) as any;
    this.dispatch('company: info', res.context);
    //获取签约分类和品牌分类
    const { res: cateList } = await webApi.getCateList();
    const { res: brandList } = await webApi.getBrandList();
    const { res: marketList } = await webApi.getMarketList({
      pageNum: 0,
      pageSize: 10000,
      storeId: loginInfo.storeId,
      relationType: 2
    });
    const { res: storeList } = await webApi.getMarketList({
      pageNum: 0,
      pageSize: 10000,
      storeId: loginInfo.storeId,
      relationType: 1
    });
    if (
      cateList.code == Const.SUCCESS_CODE &&
      brandList.code == Const.SUCCESS_CODE &&
      marketList.code == Const.SUCCESS_CODE &&
      storeList.code == Const.SUCCESS_CODE
    ) {
      this.transaction(() => {
        this.dispatch('detail:cate', fromJS(cateList.context));
        this.dispatch('detail:twoBrandKinds', fromJS(brandList.context));
        this.dispatch(
          'detail:market',
          fromJS(marketList.context ? marketList.context.content : [])
        );
        this.dispatch(
          'detail:store',
          fromJS(storeList.context ? storeList.context.content : [])
        );
      });
    } else {
      message.error(cateList.message);
    }
    //获取所有品牌
    await this.filterBrandName('');
    //获取自营商家的所有仓库，以及已选择的仓库信息
    await this.fetchAllSelfWareHouse();
  };

  /**
   * 获取自营商家的所有仓库
   */
  fetchAllSelfWareHouse = async () => {
    const { res: wareHouses } = await webApi.fetchAllSelfWareHouse();
    if (wareHouses.code == Const.SUCCESS_CODE) {
      this.dispatch('company: warehouses', wareHouses.context.wareHouseVOList);
      this.dispatch(
        'company: setChooseWareHouse',
        wareHouses.context.chooseWareIds
      );
    }
  };

  //添加品牌（全选）
  addAllBrand = (checked) => {
    this.dispatch('company:allBrandsChecked', fromJS(checked));
    const brandList = this.state()
      .get('company')
      .get('brandList')
      .toJS();
    if (checked) {
      const allBrands = this.state()
        .get('allBrands')
        .toJS();
      let newBrandList = [...brandList];
      allBrands.forEach((item) => {
        newBrandList.push({
          brandId: item.brandId,
          brandName: item.brandName,
          nickName: item.nickName,
          logo: item.logo
        });
      });
      newBrandList = _.uniqBy(newBrandList, 'brandId');
      this.dispatch('detail:updateBrands', fromJS(newBrandList));
    } else {
      const deleteBrandIdArray = [];
      brandList.forEach((item) => {
        deleteBrandIdArray.push(item.contractBrandId);
      });
      this.dispatch('detail:updateBrands', fromJS([]));
      this.dispatch('detail:deleteBrand', fromJS(deleteBrandIdArray));
    }
  };

  /**
   * 添加品牌
   * @param brand
   */
  addBrand = async (param: any) => {
    const oldBrandList = this.state()
      .get('company')
      .toJS().brandList;
    const otherBrands = this.state()
      .get('otherBrands')
      .toJS();
    //不存在，则push
    const brandArray = this.state()
      .get('company')
      .toJS().brandList;
    let count = 0;
    brandArray.map((v) => {
      if (v.brandId == param.brandId) {
        count++;
      }
    });
    if (count == 0) {
      brandArray.push({
        brandId: param.brandId,
        brandName: param.brandName,
        nickName: param.nickName,
        logo: param.logo
      });
    }
    this.dispatch('detail:updateBrands', fromJS(brandArray));
  };

  /**
   * 新增自定义品牌
   */
  addNewOtherBrand = () => {
    const otherBrands = this.state()
      .get('otherBrands')
      .toJS();
    const num = this.state().get('num');
    const brandList = this.state()
      .get('company')
      .get('brandList')
      .toJS();
    // if (otherBrands.length + brandList.length >= 50) {
    //   message.error('最多只能添加50个品牌');
    // } else {
    otherBrands.push({
      key: num,
      name: '',
      nickName: '',
      logo: '',
      authorizePic: ''
    });
    // }
    this.transaction(() => {
      this.dispatch('detail:num', num + 1);
      this.dispatch('detail:addNewBrand', fromJS(otherBrands));
    });
  };

  /**
   * 删除自定义品牌
   */
  deleteOtherBrand = (contractId: number, id: number) => {
    //已删除的id集合
    let deleteBrandIdArray = this.state()
      .get('delBrandIds')
      .toJS();
    const otherBrands = this.state()
      .get('otherBrands')
      .toJS();
    const brandList = this.state()
      .get('company')
      .get('brandList')
      .toJS();
    if (otherBrands.length + brandList.length <= 1) {
      message.error('请至少签约一种品牌');
    } else {
      //删除的是原来里面自增的
      if (contractId) {
        //当删除了已签约品牌时，所做的删除要存放
        deleteBrandIdArray.push(contractId);
        const newOtherBrands = otherBrands.filter(
          (v) => (v.contractBrandId && v.contractBrandId != contractId) || v.key
        );
        this.transaction(() => {
          this.dispatch('detail:deleteBrand', fromJS(deleteBrandIdArray));
          this.dispatch('detail:addNewBrand', fromJS(newOtherBrands));
        });
      } else {
        const otherBrands = this.state()
          .get('otherBrands')
          .toJS();
        const newOtherBrands = otherBrands.filter(
          (v) => (v.key && v.key != id) || v.contractBrandId
        );
        this.dispatch('detail:addNewBrand', fromJS(newOtherBrands));
      }
    }
  };

  /**
   * 添加自定义品牌输入框事件
   */
  onBrandInputChange = ({ ...params }) => {
    const otherBrands = this.state()
      .get('otherBrands')
      .toJS();
    let newOtherBrands = new Array();
    otherBrands.map((v) => {
      if (v.key && v.key == params.id) {
        v[params.field] = params.value;
      } else if (v.contractBrandId && v.contractBrandId == params.contractId) {
        v[params.field] = params.value;
      }
      newOtherBrands.push(v);
    });
    this.dispatch('detail:addNewBrand', fromJS(newOtherBrands));
  };

  /**
   * 上传品牌授权文件
   * @param imgs
   * @param brandId
   */
  changeBrandImg = ({ contractId, imgs, brandId }) => {
    //修改的原来已选中的平台品牌
    let brandList;
    if (contractId) {
      brandList = this.state()
        .get('company')
        .get('brandList')
        .map((v) => {
          if (v.get('contractBrandId') == contractId) {
            //做删除时，清空
            v = v.set(
              'authorizePic',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    } else {
      brandList = this.state()
        .get('company')
        .get('brandList')
        .map((v) => {
          if (v.get('brandId') == brandId) {
            v = v.set(
              'authorizePic',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    }
    this.dispatch('detail:updateBrands', brandList);
  };

  /**
   * 上传自定义品牌授权文件
   * @param imgs
   * @param brandId
   */
  changeOtherBrandImg = ({ imgs, contractId, brandId }) => {
    let brandList;
    //修改的原来的自定义品牌
    if (contractId) {
      brandList = this.state()
        .get('otherBrands')
        .map((v) => {
          if (v.get('contractBrandId') == contractId) {
            v = v.set('authorizePic', JSON.parse(imgs));
          }
          return v;
        });
    } else {
      brandList = this.state()
        .get('otherBrands')
        .map((v) => {
          if (v.get('key') == brandId) {
            v = v.set('authorizePic', JSON.parse(imgs));
          }
          return v;
        });
    }
    //重置自定义品牌
    this.dispatch('detail:addNewBrand', brandList);
  };

  /**
   * 上传自定义品牌的logo
   * @param imgs
   * @param brandId
   */
  changeLogoImg = ({ imgs, contractId, brandId }) => {
    let brandList;
    if (contractId) {
      brandList = this.state()
        .get('otherBrands')
        .map((v) => {
          if (v.get('contractBrandId') == contractId) {
            v = v.set(
              'logo',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    } else {
      brandList = this.state()
        .get('otherBrands')
        .map((v) => {
          if (v.get('key') == brandId) {
            v = v.set(
              'logo',
              JSON.parse(imgs).length == 0 ? '' : JSON.parse(imgs)
            );
          }
          return v;
        });
    }
    //重置自定义品牌
    this.dispatch('detail:addNewBrand', brandList);
  };

  /**
   * 删除选中的平台品牌
   */
  deleteBrand = async (contractId: string, brandId: string) => {
    const brandList = this.state()
      .get('company')
      .get('brandList')
      .toJS();
    const otherBrands = this.state()
      .get('otherBrands')
      .filter((v) => v.name != '')
      .toJS();
    if (brandList.length + otherBrands.length <= 1) {
      message.error('签约品牌不能为空');
    } else {
      //已删除的id集合
      let deleteBrandIdArray = this.state()
        .get('delBrandIds')
        .toJS();
      if (contractId) {
        //当删除了已签约品牌时，所做的删除要存放
        deleteBrandIdArray.push(contractId);
        this.dispatch('detail:deleteBrand', fromJS(deleteBrandIdArray));
      }
      const brandArray = brandList.filter((v) => v.brandId != brandId);
      this.dispatch('detail:updateBrands', fromJS(brandArray));
    }
  };

  /**
   * 保存品牌编辑
   * @returns {Promise<void>}
   */
  saveBrandEdit = async () => {
    const storeId = this.state().get('storeId');
    const delBrandIds = this.state()
      .get('delBrandIds')
      .toJS();
    let brandSaveRequests = new Array();
    //选中的平台品牌
    const brandList = this.state()
      .get('company')
      .get('brandList')
      .toJS();
    const otherBrands = this.state()
      .get('otherBrands')
      .toJS();

    brandList.map((v) => {
      if (v.authorizePic) {
        let brandUrl = new Array();
        v.authorizePic.map((item) => {
          if (item) {
            if (item.response) {
              brandUrl.push(item.response[0]);
            } else {
              brandUrl.push(item.url);
            }
          }
        });
        v.authorizePic = brandUrl.join(',');
      }
      brandSaveRequests.push(v);
    });

    otherBrands
      .filter((v) => v.name != '')
      .map((v) => {
        let otherUrl = new Array();
        (v.authorizePic || []).map((item) => {
          if (item) {
            if (item.response) {
              otherUrl.push(item.response[0]);
            } else {
              otherUrl.push(item.url);
            }
          }
        });
        if (typeof v.logo == 'string') {
          v.logo = v.logo;
        } else {
          if (v.logo[0].url) {
            v.logo = v.logo[0].url;
          } else {
            v.logo = v.logo[0].response[0];
          }
        }
        v.authorizePic = otherUrl.join(',');
        brandSaveRequests.push(v);
      });
    //增加的自定义品牌
    const { res } = await webApi.updateBrands({
      storeId: storeId,
      delBrandIds: delBrandIds,
      brandSaveRequests: brandSaveRequests
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('操作成功!');
      //弹框关闭
      this.dispatch('modalActor: brandModal');
      //重新获取签约详情
      this.fetchSignInfo();
    } else {
      message.error(res.message);
    }
  };

  /**
   * 查询商家基本信息
   */
  init = async (authed?) => {
    const { res } = await webApi.fetchStoreInfo();
    if (res.code == Const.SUCCESS_CODE) {
      this.transaction(() => {
        const info = res.context;
        if (info.returnGoodsAddress) {
          info.receiveName = info.returnGoodsAddress.receiveName || '';
          info.receivePhone = info.returnGoodsAddress.receivePhone || '';
          info.detailAddress = info.returnGoodsAddress.detailAddress || '';
          info.returnArea = [
            info.returnGoodsAddress.provinceId?.toString(),
            info.returnGoodsAddress.cityId?.toString(),
            info.returnGoodsAddress.areaId?.toString(),
            info.returnGoodsAddress.townId?.toString()
          ];
        }
        this.dispatch('store: info', info);
        /**
         * 审核状态 0、待审核 1、已审核 2、审核未通过 -1、未开店
         */
        switch ((res.context as any).auditState) {
          /**待审核*/
          case 0:
            let header1 = {
              preTxt: '开店申请审核中',
              text: '您的开店申请正在审核中，请耐心等待！'
            };
            this.dispatch('common: header', header1);
            break;
          case 1:
            if (!authed) {
              reLogin();
            }
            break;
          /**审核未通过*/
          case 2:
            let header2 = {
              preTxt: '开店申请审核未通过',
              text: '您的开店申请未通过，原因是：',
              bottomErrTxt: res.context.auditReason || '-',
              btnShow: true,
              btnTxt: '重新提交'
            };
            this.dispatch('common: header', header2);
            break;
          case null:
            //申请开店
            let header3 = { preTxt: '入驻商家信息录入' };
            this.dispatch('common: header', header3);
            break;
        }
      });
    }
  };

  /**
   * 修改商家基本信息字段
   */
  onChange = ({ field, value }) => {
    //如果是省市区级联
    if (field == 'area') {
      this.transaction(() => {
        ['provinceId', 'cityId', 'areaId'].forEach((v, index) => {
          this.dispatch('company: store: merge', {
            field: v,
            value: value[index] || 0
          });
        });
      });
    }
    //  else if (['returnArea', 'receiveName', 'receivePhone', 'detailAddress'].includes(field)) {
    //   this.transaction(() => {
    //     const returnGoodsAddress = this.state().get('company').get('storeInfo').get('returnGoodsAddress') || {};
    //     if(field == 'returnArea'){
    //       ['provinceId', 'cityId', 'areaId'].forEach(
    //         (v, index) => {
    //           returnGoodsAddress[v] = value[index] || 0;
    //         }
    //       );
    //     }else{
    //       returnGoodsAddress[field] = value;
    //     }
    //     this.dispatch('company: store: merge', { field: 'returnGoodsAddress', value: returnGoodsAddress });
    //   });
    // }
    else {
      this.dispatch('company: store: merge', { field, value });
    }
  };

  /**
   * 入驻流程 基本信息保存
   * @param storeInfo
   * @returns {Promise<void>}
   */
  onSaveStoreInfo = async (storeInfo) => {
    const storeId = storeInfo.storeId;
    if (storeId != null) {
      const { res } = await webApi.editStoreInfo(storeInfo);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('保存成功!');
        this.setCurrentStep(1);
      } else {
        message.error(res.message);
      }
    } else {
      const { res } = await webApi.saveStoreInfo(storeInfo);
      if (res.code === Const.SUCCESS_CODE) {
        message.success('保存成功!');
        this.setCurrentStep(1);
      } else {
        message.error(res.message);
      }
    }
  };

  /**
   * 店铺信息编辑
   * @param storeInfo
   * @returns {Promise<void>}
   */
  onEditStoreInfo = async (storeInfo) => {
    const { res } = await webApi.editStoreInfo(storeInfo);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('保存成功!');
      const loginData = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
      loginData.storeName = storeInfo.storeName;
      sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(loginData));
      history.push('/store-info');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 店铺信息编辑
   */
  editCompanyInfo = async (info) => {
    const businessLicence =
      info.get('businessLicence') && JSON.parse(info.get('businessLicence'));
    const frontIDCard =
      info.get('frontIDCard') && JSON.parse(info.get('frontIDCard'));
    const backIDCard =
      info.get('backIDCard') && JSON.parse(info.get('backIDCard'));
    const warehouseImage =
      info.get('warehouseImage') && JSON.parse(info.get('warehouseImage'));
    const doorImage =
      info.get('doorImage') && JSON.parse(info.get('doorImage'));
    info = info
      .set(
        'businessLicence',
        (businessLicence
          ? businessLicence.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'frontIDCard',
        (frontIDCard
          ? frontIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'backIDCard',
        (backIDCard
          ? backIDCard.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'warehouseImage',
        (warehouseImage
          ? warehouseImage.map((b) => b.thumbUrl || b.url)
          : []
        ).toString()
      )
      .set(
        'doorImage',
        (doorImage ? doorImage.map((b) => b.thumbUrl || b.url) : []).toString()
      );
    const { res } = await webApi.saveCompanyInfo(info);
    if (res.code === Const.SUCCESS_CODE) {
      message.success('保存成功!');
      history.push('/store-info/1');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 财务信息初始化
   * @param id
   * @returns {Promise<void>}
   */
  initAccount = async () => {
    const { res } = await webApi.fetchAccountDay();
    const { res: account } = await webApi.fetchAccountList();
    const { res: bank } = await webApi.fetchBaseBank();
    let newAccounts = [];
    let accounts = account.context;
    //如果有银行账号
    if (accounts != null && fromJS(accounts).count() > 0) {
      accounts.forEach((value) => {
        newAccounts.push({
          accountId: value.accountId,
          bankName: value.bankName,
          bankCode: value.bankCode,
          accountName: value.accountName,
          bankNo: value.bankNo,
          bankBranch: value.bankBranch,
          isReceived: value.isReceived,
          isDefaultAccount: value.isDefaultAccount,
          key: Math.random()
            .toString()
            .substring(2)
        });
      });
    } else {
      //如果没有银行账号，则默认初始化一个  初始为建设银行
      newAccounts.push({
        accountId: null,
        bankName: '中国建设银行',
        bankCode: 'CCB',
        accountName: '',
        bankNo: '',
        bankBranch: '',
        key: Math.random()
          .toString()
          .substring(2)
      });
    }
    this.transaction(() => {
      this.dispatch('company:accountDay', fromJS(res.context));
      this.dispatch('company:account', newAccounts);
      this.dispatch('company:bank', bank.context);
    });
  };

  /**
   * 新增银行结算账户
   */
  addNewAccounts = () => {
    const newAccounts = this.state()
      .getIn(['company', 'offlineAccount'])
      .toJS();
    if (newAccounts.length >= 5) {
      message.error('最多可添加5个结算账户');
      return;
    }
    newAccounts.push({
      accountId: null,
      bankName: '',
      bankCode: '',
      accountName: '',
      bankNo: '',
      bankBranch: '',
      key: Math.random()
        .toString()
        .substring(2)
    });

    this.dispatch('company:account', newAccounts);
  };

  /**
   * 添加银行结算账户输入框事件
   */
  onAccountInputChange = ({ id, field, value }) => {
    this.dispatch('company: account: merge', { id, field, value });
  };

  /**
   * 添加选择开户行事件
   */
  onBankNameChange = ({ id, value }) => {
    const banks = this.state().getIn(['company', 'bankList']);
    const bank = banks.filter((bank) => bank.get('bankCode') == value).first();
    let bankName = '';
    if (bank && bank.get('bankName')) {
      bankName = banks
        .find((bank) => bank.get('bankCode') == value)
        .get('bankName');
    }
    this.transaction(() => {
      this.dispatch('company: account: merge', {
        id,
        field: 'bankCode',
        value
      });
      this.dispatch('company: account: merge', {
        id,
        field: 'bankName',
        value: bankName
      });
    });
  };

  /**
   * 删除银行结算账户
   */
  deleteAccount = (id: number) => {
    const accounts = this.state().getIn(['company', 'offlineAccount']);
    let delAccountIds = this.state().getIn(['company', 'delAccountIds']);
    const accountId = accounts.get(id).get('accountId');
    if (accountId != null) {
      delAccountIds = delAccountIds.push(accountId);
    }
    this.transaction(() => {
      this.dispatch('company:account', accounts.delete(id));
      this.dispatch('company:account:delete', delAccountIds);
    });
  };

  /**
   * 保存银行结算账户
   * @returns {Promise<void>}
   */
  saveNewAccount = async () => {
    const deleteIds = this.state()
      .getIn(['company', 'delAccountIds'])
      .toJS();
    const offlineAccounts = this.state()
      .getIn(['company', 'offlineAccount'])
      .toJS();
    let canAdd = true;
    offlineAccounts.forEach((account) => {
      if (account.bankName == '') {
        canAdd = false;
      }
    });
    if (!canAdd) {
      message.error('银行不存在');
      return;
    }
    //增加的银行结算账户
    const { res } = await webApi.updateAccounts({
      deleteIds: deleteIds,
      offlineAccounts: offlineAccounts
    });
    if (res.code == Const.SUCCESS_CODE) {
      message.success('店铺申请成功!');
      history.push('/shop-info');
    } else {
      message.error(res.message);
    }
  };

  /**
   * 保存所有的分类和品牌编辑
   * @returns {Promise<void>}
   */
  renewAll = async () => {
    const brandList = this.state()
      .get('company')
      .get('brandList')
      .toJS();
    const otherBrands = this.state()
      .get('otherBrands')
      .toJS();

    const cateList = this.state()
      .get('company')
      .get('cateList');
    const marketList = this.state()
      .get('company')
      .get('marketList');
    const storeList = this.state()
      .get('company')
      .get('storeList');
    //保存商家类型    商家入驻需求修改  无需保存商家类型信息
    // const successFlag = await this.saveCompanyTypeAndWareHouse();
    // if (!successFlag) {
    //   return;
    // }
    if (cateList.toJS().length < 1) {
      message.error('请至少选择一种签约类目');
    } else if (brandList.length + otherBrands.length < 1) {
      message.error('请至少选择一种签约品牌');
    } else if (marketList.toJS().length < 1) {
      message.error('请至少选择一种签约批发市场');
    } else if (storeList.toJS().length < 1) {
      message.error('请至少选择一种签约商城分类');
    } else {
      //转到下一页
      this.setCurrentStep(3);
    }
  };

  /**
   * 保存所有的分类和品牌编辑以及签约日期和商家类型
   * @returns {Promise<void>}
   */
  storeRenewAll = async () => {
    const brandList = this.state()
      .get('company')
      .get('brandList')
      .toJS();
    const otherBrands = this.state()
      .get('otherBrands')
      .toJS();

    const cateList = this.state()
      .get('company')
      .get('cateList');
    if (cateList.toJS().length < 1) {
      message.error('请至少选择一种签约类目');
    } else if (brandList.length + otherBrands.length < 1) {
      message.error('请至少选择一种签约品牌');
    } else {
      message.success('保存成功！');
    }
  };

  /**
   * 品牌名称检索
   * @param value
   * @returns {Promise<void>}
   */
  filterBrandName = async (value: string) => {
    const { res } = await webApi.getAllBrands({
      likeBrandName: value
    });
    if (res.code == Const.SUCCESS_CODE) {
      this.dispatch('company:allBrands', fromJS(res.context));
    }
  };

  /**
   * 当前页签
   */
  setCurrentTab = (tab) => {
    this.dispatch('common:current:tab', tab);
    switch (tab) {
      case '0':
        this.init();
        break;
      case '1':
        this.fetchCompanyInfo();
        break;
      case '2':
        this.fetchSignInfo(); //编辑签约信息
        break;
      case '3':
        this.initAccount();
        break;
    }
  };

  /**
   * 修改商家的类型
   */
  changeCompanyType = (value) => {
    this.dispatch('company: modifyCompanyType', value);
  };

  setChooseWareHouse = (value) => {
    this.dispatch('company: setChooseWareHouse', value);
  };

  setErpId = (value) => {
    this.dispatch('company: setErpId', value);
  };

  /**
   * 保存分仓以及商家的类型
   */
  saveCompanyTypeAndWareHouse = async () => {
    const company = this.state().get('company');
    const erpId = company.get('erpId');
    const chooseWareHouseIds = company.get('wareHourseIds');
    const companyType = company.get('companyType');
    if (
      companyType &&
      companyType == 2 &&
      (!chooseWareHouseIds || chooseWareHouseIds.length < 1)
    ) {
      message.error('请选择分仓');
      return;
    }
    const param = {
      erpId: erpId,
      companyType: companyType || 1,
      wareIds: chooseWareHouseIds
    };

    const { res } = (await webApi.saveCompanyTypeAndWareHouse(param)) as any;
    if (res.code !== Const.SUCCESS_CODE) {
      message.error(res.message);
      return false;
    } else {
      message.success('保存成功');
      return true;
    }
  };

  //查询合同签署状态
  viewContractStatus = async () => {
    const { res: contractRes } = await webApi.viewContractStatus();
    // 3000:签章成功
    // 3001:签章失败
    // 3002:已撤销
    // 3003:已拒签
    // 9999:待签署
    if (contractRes && contractRes.code === Const.SUCCESS_CODE) {
      if (contractRes.context) {
        this.transaction(() => {
          this.dispatch('common:typeInfo', {
            field: 'signType',
            value: contractRes.context.signType
          });
          this.dispatch('common:typeInfo', {
            field: 'investemntManagerId',
            value: contractRes.context.investemntManagerId || ''
          });
          this.dispatch('common:typeInfo', {
            field: 'investmentManager',
            value: contractRes.context.investmentManager || ''
          });
          this.dispatch('common:typeInfo', {
            field: 'isPerson',
            value: contractRes.context.isPerson || ''
          });
          this.dispatch('common:typeInfo', {
            field: 'hasChoose',
            value:
              contractRes.context.signType || contractRes.context.signType === 0
                ? true
                : false
          });
        });
        if (contractRes.context.status === 3000) {
          this.transaction(() => {
            this.dispatch('common: pass');
            this.dispatch('common: contracted', true);
            this.dispatch('common: auth', true);
            this.setCurrentStep(0);
          });
        } else if (contractRes.context.signType === 0) {
          const { res } = await webApi.queryCompanyInfo();
          if (res && res.code === Const.SUCCESS_CODE) {
            const info = res.context;
            let status = 0;
            if (info.data && info.data.company) {
              status = info.data.company.status
                ? Number(info.data.company.status)
                : 0;
            }
            this.dispatch(
              'company:companyInfo',
              fromJS(info.data || { inited: true })
            );
            // 0：未认证；
            // 1：管理员资料已提交；
            // 2：企业基本资料(没有申请表)已提交；
            // 3：已提交待审核；
            // 4：审核通过（认证完成）；
            // 5：审核不通过；
            // 6人工初审通过（认证未完成，还需按提示完成接下来的操作）
            if (info.code === 1004 || [0, 1, 2, 6].includes(status)) {
              this.dispatch('common: authStatus', 0);
            } else if (status === 4) {
              this.transaction(() => {
                this.dispatch('common: pass');
                this.dispatch('common: contracted', true);
                this.dispatch('common: authStatus', 2);
              });
            } else if (status === 3) {
              this.transaction(() => {
                this.dispatch('common: pass');
                this.dispatch('common: contracted', true);
                this.dispatch('common: authStatus', 1);
              });
            } else if (status === 5) {
              this.transaction(() => {
                this.dispatch('common: pass');
                this.dispatch('common: contracted', true);
                this.dispatch('common: authStatus', 3);
              });
            }
          }
        }
      }
    }
  };

  // 获取fadada页面url
  fadadaRegister = async (parmas) => {
    const { res } = await webApi.eidtWord(parmas);
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('common: companyUrl', res.context.url);
    }
  };

  backToAuth = () => {
    const contractInfo = this.state()
      .get('contractInfo')
      .toJS();
    this.transaction(() => {
      this.dispatch('common: authStatus', 0);
      this.fadadaRegister({ ...contractInfo, ...staticData });
    });
  };

  //重新发送签署合同短信
  returnRegister = async () => {
    const companyInfo = this.state()
      .get('companyInfo')
      .toJS();
    if (companyInfo) {
      const params = `companyName=${
        companyInfo.company ? companyInfo.company.companyName : ''
      }&transactionNo=${companyInfo.transactionNo}&status=${
        companyInfo.company ? companyInfo.company.status : ''
      }&authenticationType=2&sign=`;
      const { res } = await webApi.returnRegister(params);
      if (res && res.code === Const.SUCCESS_CODE) {
        message.success('发送成功');
      } else if (res) {
        message.error(res.message || '');
      }
    }
  };

  // ocr解析
  getOcrInfo = async (businessLicence) => {
    const { res } = await webApi.fetchOcrInfo({ businessLicence });
    let result = '';
    if (res && res.code === Const.SUCCESS_CODE) {
      const ocrInfo = res.context;
      const newVal = {} as any;
      if (ocrInfo.RegNum) {
        newVal.socialCreditCode = ocrInfo.RegNum;
        this.mergeInfo({ field: 'socialCreditCode', value: ocrInfo.RegNum });
      }
      if (ocrInfo.Name) {
        newVal.companyName = ocrInfo.Name;
        this.mergeInfo({ field: 'companyName', value: ocrInfo.Name });
      }
      if (ocrInfo.Person) {
        newVal.legalRepresentative = ocrInfo.Person;
        this.mergeInfo({ field: 'legalRepresentative', value: ocrInfo.Person });
      }
      if (ocrInfo.Address) {
        newVal.address = ocrInfo.Address;
        this.mergeInfo({ field: 'address', value: ocrInfo.Address });
      }
      if (ocrInfo.Business) {
        newVal.businessScope = ocrInfo.Business;
        this.mergeInfo({ field: 'businessScope', value: ocrInfo.Business });
      }
      if (
        ocrInfo.SetDate &&
        moment(ocrInfo.SetDate, 'YYYY年MM月DD日').isValid()
      ) {
        newVal.foundDate = moment(ocrInfo.SetDate, 'YYYY年MM月DD日');
        this.mergeInfo({
          field: 'foundDate',
          value: moment(ocrInfo.SetDate, 'YYYY年MM月DD日').format('YYYY-MM-DD')
        });
      }
      if (ocrInfo.Period) {
        const dateArr = ocrInfo.Period.split('至');
        if (dateArr.length === 2) {
          if (moment(dateArr[0], 'YYYY年MM月DD日').isValid()) {
            newVal.businessTermStart = moment(dateArr[0], 'YYYY年MM月DD日');
            this.mergeInfo({
              field: 'businessTermStart',
              value: moment(dateArr[0], 'YYYY年MM月DD日').format('YYYY-MM-DD')
            });
          }
          if (moment(dateArr[1], 'YYYY年MM月DD日').isValid()) {
            newVal.businessTermEnd = moment(dateArr[1], 'YYYY年MM月DD日');
            this.mergeInfo({
              field: 'businessTermEnd',
              value: moment(dateArr[1], 'YYYY年MM月DD日').format('YYYY-MM-DD')
            });
          }
        }
      }
      result = newVal;
    } else {
      message.error(res.message || '');
    }
    return result;
  };
}
