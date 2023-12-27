import { IOptions, Store } from 'plume2';
import { message } from 'antd';
import { Const, history, ValidConst } from 'qmkit';
import * as webapi from './webapi';

import SettingActor from './actor/setting-actor';
import ProcessActor from './actor/process-actor';
import InputActor from './actor/input-actor';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new SettingActor(), new ProcessActor(), new InputActor()];
  }

  init = async (phone) => {
    const { res } = await webapi.fetchBossLogo();
    const uri = JSON.parse((res as any).context)[0].url;
    if (phone) {
      this.dispatch('set: phone', phone);
    }
    this.dispatch('setting:init', uri);
  };

  toNext = (i) => {
    this.dispatch('process:next', i);
  };

  /**
   * 查询账号是否存在
   * @returns {Promise<void>}
   */
  fetchPhoneExist = async () => {
    const phone = this.state().get('phone');

    if (!ValidConst.phone.test(phone)) {
      message.error('请输入正确的手机号码');
      return;
    }

    const { res } = await webapi.fetchPhoneExist(phone);
    if (res && res.code == Const.SUCCESS_CODE) {
      this.toNext(1);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 输入手机好吗
   * @param phone
   */
  onInputPhone = (phone) => {
    this.dispatch('findPassword:inputPhone', phone);
  };

  /**
   * 输入验证码
   * @param code
   */
  onInputCode = (code) => {
    this.dispatch('findPassword:inputCode', code);
  };

  /**
   * 输入密码
   * @param password
   */
  onInputPassword = (password) => {
    this.dispatch('findPassword:inputPassword', password);
  };

  /**
   * 发送验证码
   */
  sendValidCode = () => {
    const phone = this.state().get('phone');
    webapi.sendValidCode(phone);
  };

  /**
   * 验证短信验证码
   */
  validCode = async () => {
    const code = this.state().get('code');
    if (!code) {
      message.error('请输入短信验证码');
      return;
    }
    if (!/^[0-9]{6}$/.test(code.trim())) {
      message.error('请输入正确格式的短信验证码');
      return;
    }
    const phone = this.state().get('phone');
    const { res } = await webapi.validCode(phone, code);

    if (res.code == Const.SUCCESS_CODE) {
      localStorage.setItem('forgetpassword-validcode', res.context);
      this.toNext(2);
    } else {
      message.error(res.message);
    }
  };

  /**
   * 重置密码
   * @returns {Promise<void>}
   */
  resetPassword = async () => {
    const phone = this.state().get('phone');
    const password = this.state().get('password');
    if (!password) {
      message.error('请输入密码');
      return;
    }
    if (!/^[0-9a-zA-Z]{6,16}$/.test(password.trim())) {
      message.error('请输入正确格式的密码');
      return;
    }
    let smsVerifyCode = localStorage.getItem('forgetpassword-validcode');
    const { res } = await webapi.resetPassword(
      phone,
      password.trim(),
      smsVerifyCode
    );
    if (res.code == Const.SUCCESS_CODE) {
      this.toNext(3);
      localStorage.removeItem('forgetpassword-validcode');
      setTimeout(() => history.push('/login'), 3000);
    } else {
      message.error(res.message);
    }
  };
}
