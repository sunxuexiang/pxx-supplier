import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useLayoutEffect
} from 'react';
import { Avatar, Badge, notification, message, Modal } from 'antd';
import './customer-service.less';
// import Const from '../../web_modules/qmkit/config';
import CustomerChat from './components/customer-chat';
import { getImSwitch, getIMConfig } from '../online-service/webapi';
import { cache, Const, util } from 'qmkit';
import _ from 'lodash';
import { getImAccountLoginState, offlineAccountList } from './webapi';

const originDocumentTitle = document.title;

let _messageTitle = '';
let _titleTimer = null;
let _titleCount = 0;
let _imreLoginTimer = null;

const startTitleTimer = () => {
  if (_titleTimer) return;
  _titleTimer = setInterval(() => {
    if (_messageTitle) {
      if (_titleCount % 2 == 0) {
        document.title = `【新消息】${_messageTitle}`;
      } else {
        document.title = `【     】${_messageTitle}`;
      }
    } else {
      document.title = originDocumentTitle;
    }
    _titleCount++;
  }, 1000);
};

const stopTitleTimer = () => {
  if (_titleTimer) {
    clearInterval(_titleTimer);
    _titleTimer = null;
    _titleCount = 0;
    _messageTitle = '';
    document.title = originDocumentTitle;
  }
};

const stopImLoginTimer = () => {
  if (_imreLoginTimer) {
    clearTimeout(_imreLoginTimer);
    _imreLoginTimer = null;
  }
};

const png = require('./img/customer-icon.png');

const CustomerService = forwardRef((props: any, ref) => {
  const [count, setCount] = useState(0);
  // 右侧客服入口显示
  const [showCustomerService, setShowCustomerService] = useState(false);
  // 客服聊天框显示
  const [chatShow, setChatShow] = useState(false);
  // 客服状态参数
  const [switchConfig, setSwitchConfig] = useState({} as any);
  // 客服账号
  const [userAccountConfig, setUserAccountConfig] = useState({});

  const [tipReLoginIM, setTipReLoginIM] = useState(false);

  // 父组件可调用方法
  useImperativeHandle(ref, () => ({
    getStatus
  }));
  const openChat = () => {
    setChatShow(true);
  };
  useEffect(() => {
    window.addEventListener('message', function(e) {
      if (e.origin !== Const.IM_URL) {
        return;
      }
      const msgData = e.data;
      if (msgData.msgType === 'msgUnread') {
        if (msgData.unreadCount == 0) {
          stopTitleTimer();
        } else {
          if (!_messageTitle) {
            _messageTitle = '有新消息，请立即查看';
          }
          startTitleTimer();
        }
        setCount(msgData.unreadCount);
        return;
      }
      // 新消息
      if (msgData.msgType === 'msgReceive') {
        const title = msgData.payload.text;
        if (title && typeof title === 'string') {
          _messageTitle = `${msgData.nick.replace(
            /(\d{3})\d{4}(\d{4})/,
            '$1****$2'
          )}${title}`;
        }
        return;
      }
      if (msgData.msgType === 'imError') {
        if (msgData.data.action === 'notReady') {
          _imreLoginTimer = setTimeout(() => {
            setTipReLoginIM(true);
          }, 1000);
        }
        return;
      }
    });
    chatStatusConfig();
    return () => {
      stopTitleTimer();
      stopImLoginTimer();
    };
  }, []);

  const _dragCustomerStart = (e) => {
    e.target.style.opacity = 0.1;
  };

  const __dragCustomerDrop = (e) => {
    const y = e.clientY;
    e.target.style.top = Math.max(50, y) + 'px';
    e.target.style.opacity = 1;
  };

  // 获取客服开关状态
  const chatStatusConfig = () => {
    getImSwitch().then((data) => {
      if (data.res.code !== Const.SUCCESS_CODE) {
        console.warn('获取IM信息失败', data.res);
        return;
      }
      setSwitchConfig(data.res.context);
      if (data.res.context?.serverStatus === 1) {
        getServiceAccountData();
        startTitleTimer();
      } else {
        setShowCustomerService(false);
      }
    });
  };
  // 修改或编辑客服内容后触发
  const getStatus = (data, serviceAccountList = []) => {
    const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
    const currentAccount = serviceAccountList.find((item) => {
      return item.phoneNo === loginInfo.mobile;
    });
    // 不存在与当前登录账户匹配账号
    if (!currentAccount) {
      console.warn('不存在与当前登录账户匹配账号');
      setShowCustomerService(false);
      return;
    }
    // 存在判断当前状态
    if (data.serverStatus === 1) {
      setUserAccountConfig(currentAccount);
      setShowCustomerService(true);
    } else {
      setShowCustomerService(false);
    }
  };
  // 获取客服账号数据
  const getServiceAccountData = async () => {
    try {
      const loginInfo = JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA));
      const [data, data2, data3] = await Promise.all([
        getIMConfig(),
        getImAccountLoginState({ phoneNo: loginInfo.mobile }),
        offlineAccountList()
      ]);
      if (
        data.res.code !== Const.SUCCESS_CODE ||
        data2.res.code !== Const.SUCCESS_CODE
      ) {
        return;
      }
      if (data3.res.code == Const.SUCCESS_CODE && data3.res.context[0]) {
        const offlineReceiveAccounts =
          data3.res.context[0].content.offlineReceiveAccounts;
        sessionStorage.setItem(
          cache.OFFLINE_ACCOUNTS,
          JSON.stringify(offlineReceiveAccounts)
        );
      }
      const accountConfig = data.res.context.imOnlineServerItemRopList.find(
        (item) => item.phoneNo === loginInfo.mobile
      );
      if (!accountConfig) {
        setShowCustomerService(false);
        return;
      }
      setUserAccountConfig(accountConfig);
      setShowCustomerService(true);
    } catch (error) {
      console.warn('getServiceAccountData error:', error);
    }
  };
  return (
    <div>
      {showCustomerService && (
        <CustomerChat
          accountData={userAccountConfig}
          show={chatShow}
          hideChat={() => {
            setChatShow(false);
          }}
        />
      )}

      {showCustomerService && (
        <div
          onDragStart={_dragCustomerStart}
          onDragEnd={__dragCustomerDrop}
          draggable
          className="service-box"
          onClick={openChat}
        >
          <div className="service-img">
            {/* 未读消息总数徽标 */}
            {count > 0 && (
              <span
                className={
                  count < 10
                    ? 'service-img-count-small service-img-count'
                    : 'service-img-count service-img-count-large'
                }
              >
                {count > 99 ? '99+' : count}
              </span>
            )}
            <Avatar src={png} size={50} />
          </div>
          <div className="service-text">在线客服</div>
        </div>
      )}
      <Modal
        visible={tipReLoginIM}
        title="提示"
        onOk={() => {
          setTipReLoginIM(false);
          // @ts-ignore
          const ifDom = window.ifDom;
          ifDom.contentWindow.postMessage({ msgType: 'reLogin' }, Const.IM_URL);
        }}
        onCancel={() => {
          // util.logout();
          setTipReLoginIM(false);
        }}
      >
        <p>登录的IM已经离线，请重新登录</p>
      </Modal>
    </div>
  );
});

export default CustomerService;
