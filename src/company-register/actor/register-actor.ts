/**
 * Created by feitingting on 2017/8/11.
 */
import { Actor, Action } from 'plume2';
import { fromJS } from 'immutable';

export default class RegisterActor extends Actor {
  defaultState() {
    return {
      //logo
      pcLogo: '',
      //账号
      account: '',
      //密码
      password: '',
      //手机验证码
      telCode: '',
      //是否选中同意注册协议
      checked: true,
      //是否显示密码
      isShowPwd: false,
      //唯一标识符
      UUID: '',
      //正在注册
      doingRegister: false,
      supplierWebsite: '',
      businessBanner: [],
      businessCustom: ''
    };
  }

  @Action('register:tel')
  setTel(state, tel: string) {
    return state.set('account', tel);
  }

  @Action('register:telCode')
  setTelCode(state, telCode) {
    return state.set('telCode', telCode);
  }

  @Action('register:password')
  setPassword(state, password) {
    return state.set('password', password);
  }

  @Action('register:doingRegister')
  doingRegister(state, content) {
    return state.set('doingRegister', content);
  }

  @Action('register:init')
  init(state, uuid: string) {
    return state
      .set('account', '')
      .set('password', '')
      .set('checked', true)
      .set('UUID', uuid);
  }

  @Action('register:checked')
  checked(state, checked: boolean) {
    return state.set('checked', !checked);
  }

  @Action('register:showpass')
  showpass(state, show: boolean) {
    return state.set('isShowPwd', show);
  }

  @Action('register:logo')
  logo(state, res: any) {
    const logo = JSON.parse(res.pcLogo)[0];
    return state.set('pcLogo', logo.url);
  }

  @Action('register:supplierWebsite')
  supplierWebsite(state, res: any) {
    const supplierWebsite = res.supplierWebsite;
    return state.set('supplierWebsite', supplierWebsite);
  }

  @Action('register:businessBanner')
  businessBanner(state, res: any) {
    const businessBanner = JSON.parse(res);
    let banner = businessBanner || [];
    let bannerArr = [];
    for (let index in banner) {
      bannerArr.push(banner[index].thumbUrl);
    }
    return state.set('businessBanner', fromJS(bannerArr));
  }

  @Action('register:businessCustom')
  businessCustom(state, businessCustom: string) {
    return state.set('businessCustom', businessCustom);
  }
}
