import * as webApi from './webapi';
import { Const } from 'qmkit';
import TIM from 'tim-js-sdk';
import { message } from 'antd';

export async function webimCreate(callback?) {
  const { res } = await webApi.addImAccount({});
  if (res && res.code === Const.SUCCESS_CODE) {
    const { res: signRes } = await webApi.fetchImSign({
      customerServiceAccount: res.context
    });
    if (signRes && signRes.code === Const.SUCCESS_CODE) {
      const loginInfo = {
        userID: res.context,
        userSig: signRes.context?.sign,
        sdkAppID: signRes.context?.appid
      };
      webimLogin(loginInfo, callback);
    }
  } else {
    message.error(res.message || '');
  }
}

let onfunction = null;

export async function webimLogin(loginInfo, callback?) {
  // @ts-ignore
  window.tim = TIM.create({ SDKAppID: loginInfo.sdkAppID });
  // @ts-ignore
  window.tim.setLogLevel(0);
  onfunction = (event) => {
    console.log('MESSAGE_RECEIVED');
    console.log(event);
    // msgReceived(event);
    if (callback) {
      callback(event);
    }
  };
  // @ts-ignore
  window.tim.on(TIM.EVENT.MESSAGE_RECEIVED, onfunction);
  // @ts-ignore
  const promise = window.tim.login({
    userID: loginInfo.userID,
    userSig: loginInfo.userSig
  });
  promise
    .then((imResponse) => {
      console.log('登录成功');
      if (imResponse.data.actionStatus === 'OK') {
        // 登录成功
        console.log('获取权限');
      }
      if (imResponse.data.repeatLogin === true) {
        // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
        console.log(imResponse.data.errorInfo);
      }
    })
    .catch((imError) => {
      console.warn('login error:', imError); // 登录失败的相关信息
    });
}

export function webimLogout(cbOk?, cbErr?) {
  try {
    // @ts-ignore
    const promise = window.tim.logout();
    // @ts-ignore
    window.tim.off(TIM.EVENT.MESSAGE_RECEIVED, onfunction);
    if (cbOk && cbErr) {
      promise.then(cbOk).catch(cbErr);
    }
  } catch (error) {
    cbErr();
  }
}
