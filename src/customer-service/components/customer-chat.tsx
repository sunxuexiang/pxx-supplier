import React, { useState, useRef, useEffect, forwardRef } from 'react';
import './customer-chat.less';
import { cache, Const, util } from 'qmkit';
import { notification } from 'antd';

let noticeAlertList = [];
const _showTimeExt = new Date().getTime();
const CustomerChat = forwardRef((props: any, ref) => {
  const _loginData = util.getLoginData();
  const _iframeUrl = `${Const.IM_URL}?selfManage=${_loginData.selfManage}&_t=${_showTimeExt}`;

  const iframeRef = useRef(null);
  const [iframeLoad, setLoad] = useState(false);
  const img = require('../img/customer-icon.png');
  useEffect(() => {
    window.addEventListener('message', function(e) {
      if (e.origin !== Const.IM_URL) {
        return;
      }
      const msgData = e.data;
      if (msgData.msgType === 'msgReceive') {
        if (msgData.conversationID == 'C2Cadministrator') {
          return;
        }
        if (msgData.conversationID == '@TIM#SYSTEM') {
          return;
        }
        if (typeof msgData.payload.data === 'string') {
          return;
        }
        if (!msgData.payload.text) {
          return;
        }
        if (noticeAlertList.includes(msgData.payload.text)) {
          return;
        }

        // 窗口是否隐藏
        const divEle = document.querySelector(
          '.customer-chat-box'
        ) as HTMLElement;
        if (divEle.style.display !== 'none') {
          return;
        }
        const title = msgData.payload.text;
        const noticeTitle = `消息通知：${msgData.nick}`.replace(
          /(\d{3})\d{4}(\d{4})/,
          '$1****$2'
        );
        const noticeDesc = `${msgData.nick}：${title || '新消息'}`.replace(
          /(\d{3})\d{4}(\d{4})/,
          '$1****$2'
        );
        noticeAlertList.push(title);
        notification.info({
          message: noticeTitle,
          description: noticeDesc,
          icon: <img src={img} className="notice-icon" />
        });
        setTimeout(() => {
          noticeAlertList = [];
        }, 1000);
        return;
      }
      if (msgData.msgType === 'action') {
        if (msgData.data.action === 'close') {
          hideChat();
          return;
        }
        if (msgData.data.action === 'init') {
          setLoad(true);
        }
        return;
      }
    });
    const ifDom = document.getElementById('chatIframe');
    ifDom.onload = function() {
      setLoad(true);
    };
  }, []);
  // 监听聊天iframe加载
  useEffect(() => {
    if (iframeLoad) {
      postLogin();
    }
  }, [iframeLoad]);
  const hideChat = () => {
    props.hideChat();
  };
  // im登录参数处理
  const postLogin = () => {
    const ifDom = document.getElementById('chatIframe') as HTMLIFrameElement;
    // @ts-ignore
    window.ifDom = ifDom;
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const loginParams = {
      msgType: 'login',
      userID: props.accountData.customerServiceAccount,
      userName: props.accountData.customerServiceName,
      offlineAccounts: JSON.parse(
        sessionStorage.getItem(cache.OFFLINE_ACCOUNTS)
      ),
      ...loginInfo
    };
    setTimeout(() => {
      ifDom.contentWindow.postMessage(loginParams, Const.IM_URL);
    }, 300);
  };
  return (
    <div
      className="customer-chat-box"
      style={{ display: props.show ? 'flex' : 'none' }}
    >
      {/* <div className="customer-chat-main">
        <div className="customer-chat-close" onClick={hideChat}>
          <Icon type="close-circle" />
        </div> */}
      <iframe
        ref={iframeRef}
        id="chatIframe"
        style={{
          width: '100%',
          height: '100%',
          border: 'medium none',
          overflow: 'hidden'
        }}
        frameBorder="0"
        scrolling="no"
        src={_iframeUrl}
      />
      {/* </div>
    </div> */}
    </div>
  );
});
export default CustomerChat;
