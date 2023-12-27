import * as webapi from './webapi';
import { cache, Const, history, util } from 'qmkit';
import { fromJS } from 'immutable';
import { message } from 'antd';
import { getCateList } from '../video-tutorial/webapi';
import { queryStoreState } from '../home/webapi';
import * as _ from 'lodash';

/**
 * 获取视频教程分类列表
 * @param list
 * @private
 */
const getCateInfo = async () => {
  const { res } = (await getCateList()) as any;
  if (res.code === Const.SUCCESS_CODE) {
    const cateList = res.context || [];
    sessionStorage.setItem('cateList', JSON.stringify(cateList));
  }
};

/**
 * 获取子菜单
 * @param list
 * @private
 */
const _getChildren = (list, dataList) => {
  return list.map((data) => {
    const children = dataList.filter(
      (item) => item.get('pid') == data.get('id')
    );
    if (!children.isEmpty()) {
      data = data.set('children', _getChildren(children, dataList));
    }
    return data;
  });
};

const getAuthInfo = async () => {
  const { res } = await queryStoreState();
  if (res && res.code === Const.SUCCESS_CODE && res.context) {
    // 存储商家权限信息
    sessionStorage.setItem(
      cache.AUTHINFO,
      JSON.stringify({
        pileState: res.context.pileState,
        jingBiState: res.context.jingBiState,
        presellState: res.context.presellState
      })
    );
  }
};

const getAllDeliveryWay = async () => {
  const { res } = await webapi.fetchAllDeliveryWay();
  console.warn(res);
  if (res && res.code === Const.SUCCESS_CODE && res.context) {
    // 存储商家权限信息
    sessionStorage.setItem(
      cache.DELIVERYWAY,
      JSON.stringify(res.context || [])
    );
  }
};

export const passFunction = async () => {
  message.success('登录成功');
  //登录成功之后，获取视频教程分类列表
  getCateInfo();
  //登录成功之后，获取商家权限信息
  getAuthInfo();
  // 登录成功之后，获取所有配送方式
  getAllDeliveryWay();
  //登录成功之后，塞入baseConfig
  const config = (await webapi.getSiteInfo()) as any;
  sessionStorage.setItem(
    cache.SYSTEM_BASE_CONFIG,
    JSON.stringify(config.res.context)
  );
  const { res: wareList } = await webapi.wareList({
    pageNum: 0,
    pageSize: 1000,
    defaultFlag: 1
  });
  const { res: wareListt } = await webapi.wareList({
    pageNum: 0,
    pageSize: 1000
  });
  if (wareList && wareList.context) {
    localStorage.setItem(
      'warePage',
      JSON.stringify(wareList.context.wareHouseVOPage.content)
    );
    wareListt.context.wareHouseVOPage.content.unshift({
      wareId: '0',
      wareName: '全部'
    });
    localStorage.setItem(
      'warePageList',
      JSON.stringify(wareListt.context.wareHouseVOPage.content)
    );
    // console.log(wareList, 'wareListwareList');
    wareList.context.wareHouseVOPage.content.unshift({
      wareId: '0',
      wareName: '全部'
    });
    localStorage.setItem(
      'wareHouseVOPage',
      JSON.stringify(wareList.context.wareHouseVOPage.content)
    );
  } else {
    message.error('仓库列表获取失败，请重新登录');
  }
  history.push('/');
};

let accountState = '';
let passwordState = '';

export const reLogin = () => {
  if (accountState && passwordState) {
    login({
      account: accountState,
      password: passwordState
    });
  }
};

// 根据商家的配送方式隐藏菜单
const getHideMenuByDeliveryTypeList = (deliveryTypeList: number[] = []) => {
  let hideMenus = [];
  const menus = {
    2: ['/logistics-company'],
    3: ['/self-pickup'],
    4: ['/delivery-to-home'],
    5: ['/delivery-to-store'],
    8: ['/appoint-company'],
    9: ['/delivery-to-same-city'],
    10: ['/delivery-to-home-collect']
  };
  Object.keys(menus).forEach((key) => {
    if (!deliveryTypeList.includes(Number(key))) {
      hideMenus = hideMenus.concat(menus[key]);
    }
  });
  return hideMenus;
};
/**
 * 账户密码登录;
 */
const login = async (form, fristLoginFlag?) => {
  const account = form.account;
  const password = form.password;
  if (fristLoginFlag) {
    accountState = form.account;
    passwordState = form.password;
  }
  const isRemember = form.isRemember;
  let base64 = new util.Base64();
  const { res } = await webapi.login(
    base64.urlEncode(account),
    base64.urlEncode(password)
  );
  if ((res as any).code === Const.SUCCESS_CODE) {
    // @ts-ignore
    window.selfManage = (res as any).context.selfManage;
    sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));
    // if (isRemember) {
    //   localStorage.setItem(cache.LOGIN_DATA, JSON.stringify(res.context));
    // }
    // @ts-ignore
    window.token = res.context.token;
    // @ts-ignore
    window.companyType = res.context.companyType;
    // res.context.deliveryTypeList
    // @ApiEnumProperty("2: 托运部")

    // @ApiEnumProperty("3: 上门自提/自提")

    // @ApiEnumProperty("4: 收费快递/快递到家(自费)")

    // @ApiEnumProperty("5: 配送到店(自费)")

    // @ApiEnumProperty("8: 指定物流")

    // @ApiEnumProperty("9: 同城配送(到付)")
    // @ApiEnumProperty("10: 快递到家(到付)")

    // 获取登录人拥有的菜单
    const menusRes = (await webapi.fetchMenus()) as any;
    if (menusRes.res.code === Const.SUCCESS_CODE) {
      let dataList = fromJS(menusRes.res.context);
      // @ts-ignore
      if (window.companyType == 0) {
        dataList = dataList.filterNot(
          (item) => item.get('title') == '业务员统计'
        );
      }
      // 非自营店铺 隐藏企业会员
      // @ts-ignore
      if (window.companyType == 1) {
        dataList = dataList.filterNot(
          (item) => item.get('title') == '企业会员'
        );
      }
      // 主页菜单不在权限中配置，写死第一个
      dataList = dataList.insert(
        0,
        fromJS({
          id: 'menu_a',
          pid: 'menu_0',
          realId: -1,
          title: '主页',
          grade: 1,
          icon: '1505551659667.jpg',
          authNm: '',
          url: '/',
          reqType: '',
          authRemark: '',
          isMenuUrl: null,
          sort: 0
        })
      );

      const allGradeMenus = _getChildren(
        dataList.filter((item) => item.get('grade') == 1),
        dataList
      );
      //统仓统配 才显示上门自提菜单
      const gradeMenus = [];
      // 配送方式菜单合并后 此处已无用
      // const deliveryHide = getHideMenuByDeliveryTypeList(
      //   res.context?.deliveryTypeList || []
      // );
      const deliveryHide = [];
      allGradeMenus.toJS().forEach((item) => {
        const firstMenu = _.cloneDeep(item);
        if (item.children) {
          firstMenu.children = [];
          item.children.forEach((secondItem) => {
            const secondMenu = _.cloneDeep(secondItem);
            if (secondItem.children) {
              secondMenu.children = [];
              const hideSecond = [
                '/finance-manage-second-menu' // 商家入驻版本暂时隐藏  后续版本可能开放
              ];
              secondItem.children.forEach((thirdItem) => {
                const thirdMenu = thirdItem;
                let hideThird = [].concat(deliveryHide);
                // 没有 自营 标签的商家 不显示部分菜单
                if (res.context.selfManage !== 1) {
                  hideThird = hideThird.concat([
                    '/order-add', // 代客下单
                    '/order-return-apply-list' // 代客退单
                  ]);
                }
                // 非第三方商家 没有新增商品菜单
                if (window.companyType != 1) {
                  hideThird = hideThird.concat(['/add-product-simple']);
                }
                //统仓统配 才显示上门自提菜单   此版本不分商家类型 所有类型均有上门自提页面
                // if (window.companyType != 2) {
                // hideThird.push('/self-pickup');
                // }
                if (!hideThird.includes(thirdItem.url)) {
                  secondMenu.children.push(thirdMenu);
                }
              });
            }
            firstMenu.children.push(secondMenu);
          });
        }
        gradeMenus.push(firstMenu);
      });
      //第三方 隐藏部分菜单
      const thirdAllGradeMenus = [];
      // @ts-ignore
      if (window.companyType == 1) {
        //第三方商家
        gradeMenus.forEach((item) => {
          const firstMenu = _.cloneDeep(item);
          if (item.url !== '/store-customer') {
            if (item.children) {
              firstMenu.children = [];
              item.children.forEach((secondItem) => {
                const secondMenu = _.cloneDeep(secondItem);
                const hideSecond = [
                  '/finance-ticket-second-menu',
                  '/mofang-pc-second-menu',
                  '/groupon-activity-second-menu',
                  '/flash-sale-second-menu',
                  '/applet-second-menu'
                ];
                if (!hideSecond.includes(secondItem.url)) {
                  if (secondItem.children) {
                    secondMenu.children = [];
                    secondItem.children.forEach((thirdItem) => {
                      const thirdMenu = thirdItem;
                      const hideThird = [
                        '/th_daike_order_list',
                        '/release-products',
                        '/goods-evaluate-list',
                        '/stockout-list',
                        '/goods-add-vendor',
                        '/customer-statistics',
                        '/goodm',
                        '/ls-goods-list',
                        '/bd-goods-list',
                        '/gather-together-setting',
                        '/home-delivery',
                        '/pieces-list',
                        '/coupon-list',
                        '/coupon-activity-list'
                      ];
                      if (!hideThird.includes(thirdItem.url)) {
                        secondMenu.children.push(thirdMenu);
                      }
                    });
                  }
                  firstMenu.children.push(secondMenu);
                }
              });
            }
            thirdAllGradeMenus.push(firstMenu);
          }
        });
      }

      sessionStorage.setItem(
        cache.LOGIN_MENUS,
        JSON.stringify(
          // @ts-ignore
          window.companyType == 1 ? thirdAllGradeMenus : gradeMenus
        )
      );

      const functionsRes = (await webapi.fetchFunctions()) as any;
      sessionStorage.setItem(
        cache.LOGIN_FUNCTIONS,
        JSON.stringify(functionsRes.res.context)
      );

      //获取店铺ID
      const storeId = res.context.storeId;
      //获取店铺主页的小程序码
      const { res: qrcode } = (await webapi.fetchMiniProgramQrcode(
        storeId
      )) as any;
      if (qrcode.code == Const.SUCCESS_CODE) {
        //获取小程序码的地址，保存到本地
        localStorage.setItem(cache.MINI_QRCODE, qrcode.context);
      }

      /**
       * 审核状态 0、待审核 1、已审核 2、审核未通过 -1、未开店
       */
      switch ((res.context as any).auditState) {
        /**待审核*/
        case 0:
          //将审核中的店铺信息存入本地缓存
          history.push('/shop-info');
          break;
        /**审核通过，成功登录*/
        case 1:
          await passFunction();
          break;
        /**审核未通过*/
        case 2:
          history.push('/shop-info');
          break;
        default:
          //申请开店
          history.push('/shop-process');
      }
    } else {
      message.error(menusRes.res.message);
    }
  } else {
    message.error(res.message);
  }
};

export default login;
