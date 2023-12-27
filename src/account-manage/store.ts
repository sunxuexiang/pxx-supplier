import { Store, IOptions } from 'plume2';
import VisibleActor from './actor/visible-actor';
import * as webapi from './webapi';
import AccountActor from './actor/account-actor';
import { message } from 'antd';
import UUID from 'uuid-js';
import LoginLogActor from './actor/login-log-actor';
import { Const, cache } from 'qmkit';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new VisibleActor(), new AccountActor(), new LoginLogActor()];
  }

  onShow = () => {
    this.transaction(() => {
      this.dispatch('modal:show');
    });
  };

  onHide = () => {
    this.dispatch('modal:hide');
  };

  init = async () => {
    const { res } = await webapi.fetchEmployee();
    const { res: result } = await webapi.fetchLoginLogs();
    const uuid = UUID.create().toString();

    this.transaction(() => {
      this.dispatch('accountManager:employee', res);
      this.dispatch('accountManager:uuid', uuid);
      if (result.code === Const.SUCCESS_CODE) {
        this.dispatch('accountManager:logs', result.context.logVOList);
      } else {
        this.dispatch('accountManager:logs', []);
      }
    });
  };

  /**
   * 保存账号名称
   * @param form
   * @returns {Promise<void>}
   */
  saveEmployeeName = async (form: any) => {
    const { res } = await webapi.saveEmployeeName(form.employeeName);
    this.messageByResult(res, this.init);
  };

  onChangeUUid = () => {
    const uuid = UUID.create().toString();
    this.dispatch('accountManager:uuid', uuid);
  };

  /**
   * 校验图片验证码
   */
  onCheckCaptcha = async (enterValue) => {
    const uuid = this.state().get('uuid');
    this.dispatch('accountManager:onEnterValue', enterValue);
    //输入值为空的时候不去校验
    if (!enterValue) {
      return;
    }
    const { res } = await webapi.checkCaptcha(uuid, enterValue);

    if (res.code === Const.SUCCESS_CODE) {
      this.dispatch('accountManager:enableSend', false);
    } else {
      //todo调整校验方式
      message.error('图片验证码错误');
      this.dispatch('accountManager:enableSend', true);
    }
  };

  /**
   * 输入手机号码
   * @param phone
   */
  onInputPhone = (phone) => {
    this.dispatch('accountManager:phone', phone);
  };

  /**
   * 发送短信
   * @returns {Promise<void>}
   */
  sendSms = async () => {
    const uuid = this.state().get('uuid');
    const phone = this.state().get('phone');
    return webapi.sendSms(uuid, phone).then(({ res }) => {
      if (res.code != Const.SUCCESS_CODE) {
        message.error(res.message);
        return Promise.reject(res.message);
      }
    });
  };

  /**
   * 保存手机号
   * @returns {Promise<void>}
   */
  onSavePhone = async (form) => {
    const { res: validSms } = await webapi.validSms(form.phone, form.msgCode);
    if (validSms.code == Const.SUCCESS_CODE) {
      const { res: sendBind } = await webapi.sendBind(form.phone);
      this.messageByResult(sendBind, this.onHide);
      const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
      loginInfo.mobile = form.phone;
      sessionStorage.setItem(cache.LOGIN_DATA, JSON.stringify(loginInfo));
    } else {
      message.error(validSms.message);
    }
  };

  messageByResult(res, _handle: Function) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
      _handle();
      this.init();
    } else {
      message.error(res.code);
    }
  }
}
