import { Store } from 'plume2';
import { message } from 'antd';
import { cache, Const } from 'qmkit';
import * as webapi from './webapi';
import FormActor from './actor/form-actor';
import userLogin from './loginUtil';
import * as _ from 'lodash';

export default class AppStore extends Store {
  bindActor() {
    return [new FormActor()];
  }

  constructor(props) {
    super(props);
    //debug
    (window as any)._store = this;
  }

  //;;;;;;;;;;;;;action;;;;;;;;;;;;;;;;;;;;;;;
  init = async () => {
    webapi.getSiteInfo().then((resIco: any) => {
      if (resIco.res.code == Const.SUCCESS_CODE) {
        //logo
        const logo = JSON.parse((resIco.res.context as any).pcLogo);
        this.dispatch('login:logo', logo[0].url);
        sessionStorage.setItem(cache.SITE_LOGO, logo[0].url); //放入缓存,以便登陆后获取
        //icon
        const ico = (resIco.res.context as any).pcIco
          ? JSON.parse((resIco.res.context as any).pcIco)
          : null;
        if (ico) {
          const linkEle = document.getElementById('icoLink') as any;
          linkEle.href = 'https://www.tapd.cn/favicon.ico';
          linkEle.type = 'image/x-icon';
        }
      }
      this.dispatch('login:refresh', true);
    });
  };

  /**
   * 账户密码登录;
   */
  login = async (form) => {
    try {
      this.dispatch('login:loading', true);
      await userLogin(form);
      this.dispatch('login:loading', false);
    } catch (error) {
      this.dispatch('login:loading', false);
    }
  };

  /**
   *  输入
   */
  onInput = (param) => {
    this.dispatch('login:input', param);
  };

  /**
   *  切换加载状态
   */
  changeLoading = (bool) => {
    this.dispatch('login:loading', bool);
  };

  messageByResult(res) {
    if (res.code === Const.SUCCESS_CODE) {
      message.success('操作成功');
    } else {
      //登录失败原因
      message.error(res.message);
    }
  }
}
