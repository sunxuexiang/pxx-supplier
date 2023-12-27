import { IOptions, Store } from 'plume2';

import { message } from 'antd';
import InfoActor from './actor/actor';
import * as webApi from './webapi';
import { Const, cache, history } from 'qmkit';
import { webimCreate } from './webIm';
import QRCode from 'qrcode';
import moment from 'moment';

export default class AppStore extends Store {
  constructor(props: IOptions) {
    super(props);
    if (__DEV__) {
      (window as any)._store = this;
    }
  }

  bindActor() {
    return [new InfoActor()];
  }

  init = async () => {
    //im初始化
    webimCreate((event) => {
      if (event && event.data && event.data[0]) {
        const payload = JSON.parse(event.data[0].payload.data);
        if (payload.messageType === 13) {
          message.success('充值成功', 2, () => {
            history.push('/jinbi-account');
          });
        }
      }
    });
    this.queryCustomerWallet();
  };

  //查询鲸币账户余额
  queryCustomerWallet = async () => {
    const params = {
      storeFlag: true,
      storeId: JSON.parse(sessionStorage.getItem(cache.LOGIN_DATA)).storeId
    };
    const { res } = await webApi.queryCustomerWallet(params);
    if (res && res.code === Const.SUCCESS_CODE) {
      this.dispatch('state:update', {
        key: 'accountMoney',
        value: res.context?.balance || 0
      });
    } else {
      message.error(res.message || '');
    }
  };

  /**
   * 修改信息
   */
  update = (params) => {
    this.dispatch('state:update', params);
  };

  // 下一步
  goNext = async () => {
    const rechargeNum = this.state().get('rechargeNum');
    const payType = this.state().get('payType');
    if (rechargeNum > 0) {
      const { res } = await webApi.fetchQRcode({
        rechargeBalance: rechargeNum,
        payType
      });
      if (res && res.code === Const.SUCCESS_CODE) {
        if (payType === 0) {
          this.dispatch('state:update', { key: 'step', value: 2 });
          if (res.context.wxPayQRCode) {
            QRCode.toDataURL(
              decodeURIComponent(res.context.wxPayQRCode),
              { errorCorrectionLevel: 'H' },
              (_err, url) => {
                this.dispatch('state:update', {
                  key: 'wechatPayUrl',
                  value: url
                });
                this.dispatch('state:update', {
                  key: 'endTime',
                  value: moment()
                    .add(29, 'm')
                    .format('YYYY年MM月DD日 HH时mm分失效')
                });
              }
            );
          }
        } else if (payType === 1 && res.context.cshdk_Url) {
          window.open(res.context.cshdk_Url, '_blank');
        }
      } else {
        message.error(res.message || '');
      }
    } else {
      message.error('请输入充值金额');
    }
  };

  // 上一步
  goBack = () => {
    this.transaction(() => {
      this.dispatch('state:update', { key: 'step', value: 1 });
      this.dispatch('state:update', { key: 'rechargeNum', value: 0 });
      this.dispatch('state:update', { key: 'wechatPayUrl', value: '' });
      this.dispatch('state:update', { key: 'aliPayUrl', value: '' });
      this.dispatch('state:update', { key: 'endTime', value: '' });
    });
  };
}
