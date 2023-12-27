/**
 * Created by feitingting on 2017/8/11.
 */
import { message } from 'antd';

import UUID from 'uuid-js';
import { Store } from 'plume2';
import { history, QMMethod, Const, cache } from 'qmkit';

import * as webapi from './webapi';
import RegisterActor from './actor/register-actor';
import userLogin from '../login/loginUtil';

export default class AppStore extends Store {
  bindActor() {
    return [new RegisterActor()];
  }

  init = async () => {
    const uuid = UUID.create().toString();
    const res = ((await webapi.getSiteInfo()) as any).res;
    if (res.code === Const.SUCCESS_CODE) {
      this.transaction(() => {
        this.dispatch('register:logo', res.context);
        this.dispatch('register:init', uuid);
        this.dispatch('register:supplierWebsite', res.context);
      });
    }
    const business = ((await webapi.getBusinessConfig()) as any).res;
    if (business.code == 'K-000000') {
      //取商家自己的配置信息
      this.transaction(() => {
        this.dispatch(
          'register:businessBanner',
          business.context.supplierBanner
        );
        this.dispatch(
          'register:businessCustom',
          business.context.supplierCustom
        );
      });
    } else {
      message.error(res.message);
    }
  };

  /**
   * 注册账号
   * @param form
   * @returns {Promise<void>}
   */
  register = async (form) => {
    const checked = this.state().get('checked');
    if (!checked) {
      message.error('请先阅读并同意注册协议');
      return false;
    } else {
      this.confirmRegister(form);
    }
  };

  /**
   * 确认注册
   * @param form
   * @returns {Promise<void>}
   */
  confirmRegister = async (form) => {
    const account = form.account;
    const telCode = form.telCode;
    const password = form.password;
    if (telCode == '') {
      message.error('手机验证码不能为空');
    } else if (QMMethod.testPass(password) && QMMethod.testTel(account)) {
      this.dispatch('register:doingRegister', true);
      const res = ((await webapi.register(account, telCode, password)) as any)
        .res;
      if ((res as any).code == 'K-000000') {
        message.success('注册成功');
        //清除本地缓存的审核未通过的或者正在审核中的账户信息
        localStorage.removeItem(cache.PENDING_AND_REFUSED);
        // //去登录页
        // history.push('./login');
        // 去登录
        userLogin({
          account: form.account,
          password: form.password
        });
      } else {
        message.error((res as any).message);
        this.dispatch('register:doingRegister', false);
      }
    }
  };

  /**
   * 监听账号状态值
   * @param e
   */
  setTel = (tel: string) => {
    this.dispatch('register:tel', tel);
  };

  /**
   * 设置验证码
   */
  setTelCode = (telCode) => {
    this.dispatch('register:telCode', telCode);
  };

  /**
   * 设置密码
   */
  setPassword = (password) => {
    this.dispatch('register:password', password);
  };

  /**
   * 发送验证码，两个promise对象嵌套，除了手机号本身外，当图片验证成功方可开启倒计时
   */
  sendCode = () => {
    const tel = this.state().get('account');
    //账号类型 0 b2b账号 1 s2b平台端账号 2 商家端账号 3供应商端账号
    const type = 2;
    return webapi.sendCode(tel, type).then(({ res }) => {
      if ((res as any).code == 'K-000000') {
        message.success('发送验证码成功');
      } else {
        message.error((res as any).message);
        return Promise.reject(message);
      }
    });
  };

  /**
   * 改变复选框的选中状态
   */
  changeChecked = () => {
    const checked = this.state().get('checked');
    this.dispatch('register:checked', checked);
  };

  /**
   * 密码明暗文切换
   */
  showPass = () => {
    const showPass = this.state().get('isShowPwd');
    this.dispatch('register:showpass', !showPass);
  };
}
