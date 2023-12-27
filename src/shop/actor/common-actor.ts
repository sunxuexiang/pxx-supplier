import { Actor, Action, IMap } from 'plume2';
import { fromJS } from 'immutable';

export default class CommonActor extends Actor {
  defaultState() {
    return {
      //tab页签,与步骤类型不同
      tabsStep: '0',
      // 当前步骤
      currentStep: 0,
      // 是否通过协议页面
      pass: false,
      // 是否通过企业认证
      auth: false,
      // 是否填写合同内容
      contracted: false,
      // 是否填写过协议签署形式
      hasChoose: false,
      // 商家性质
      isPerson: '',
      // 签署方式
      signType: '',
      //入驻商家业务代表
      investemntManagerId: '',
      investmentManager: '',
      // 企业认证状态
      authStatus: 0,
      //头部提示
      header: {
        // 首条开始信息
        preTxt: '',
        // 首条尾部信息
        postTxt: '',
        // 底部文字
        text: '',
        // 蓝色
        errTxt: '',
        // 底部蓝色
        bottomErrTxt: '',
        // 按钮是否展示
        btnShow: false,
        // 按钮文本
        btnTxt: ''
      },
      // 法大大企业认证URL
      companyUrl: '',
      // 合同信息
      contractInfo: {},
      // 签名url
      signImage: '',
      saveContractLoading: false
    };
  }

  /**
   * 设置当前步骤
   */
  @Action('common: current')
  currentStep(state: IMap, currentStep: number) {
    return state.set('currentStep', currentStep);
  }

  /**
   * 通过注册协议页面
   * @param state
   */
  @Action('common: pass')
  pass(state: IMap) {
    const pass = !state.get('pass');
    return state.set('pass', pass);
  }

  /**
   * 头部信息单个字段
   * @param state
   * @param param1
   */
  @Action('common: header')
  onHeaderChange(state: IMap, header) {
    return state.set('header', fromJS(header));
  }

  /**
   * 设置当前页签
   */
  @Action('common:current:tab')
  currentTab(state: IMap, currentTab: string) {
    return state.set('tabsStep', currentTab);
  }

  @Action('common: auth')
  auth(state: IMap, auth: boolean) {
    return state.set('auth', auth);
  }

  @Action('common:typeInfo')
  typeInfo(state: IMap, { field, value }) {
    return state.set(field, value);
  }

  @Action('common: authStatus')
  authStatus(state: IMap, authStatus: number) {
    return state.set('authStatus', authStatus);
  }

  @Action('common: companyUrl')
  companyUrl(state: IMap, companyUrl: string) {
    return state.set('companyUrl', companyUrl);
  }

  @Action('common: contracted')
  contracted(state: IMap, contracted: boolean) {
    return state.set('contracted', contracted);
  }
}
