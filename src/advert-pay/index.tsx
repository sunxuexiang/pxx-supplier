import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { Const, FindArea, history } from 'qmkit';
import { adActivityPay, fetchAd } from './webapi';
import { webimCreate, webimLogout } from '../jinbi-recharge/webIm';
import './index.less';
import moment from 'moment';
import QRCode from 'qrcode';

const AdvertPay = (props) => {
  const { location } = props;
  const [qrCodeUrl, setUrl] = useState('');
  const [endTime, setEndTime] = useState('');
  const [payState, setPatState] = useState(0);
  const [data, setData] = useState({} as any);

  const init = async () => {
    if (location && location.state && location.state.id) {
      const params = {
        id: location.state.id,
        patType: 0
      };
      const { res } = await adActivityPay(params);
      if (res && res.code === Const.SUCCESS_CODE) {
        setEndTime(
          moment()
            .add(29, 'm')
            .format('YYYY年MM月DD日 HH时mm分失效')
        );
        QRCode.toDataURL(
          decodeURIComponent(res.context),
          { errorCorrectionLevel: 'H' },
          (_err, url) => {
            setUrl(url);
          }
        );
        webimCreate((event) => {
          console.warn(event, '支付IM');
          if (event && event.data && event.data[0]) {
            const payload = JSON.parse(event.data[0].payload.data);
            if (payload.messageType === 16) {
              setPatState(1);
              message.success('支付成功', 2, () => {
                // history.push('/jinbi-account');
              });
            }
          }
        });
      } else {
        message.error(res.message || '');
      }
    }
  };

  const getAdInfo = async () => {
    if (location && location.state && location.state.id) {
      const { res } = await fetchAd(location.state.id);
      if (res && res.code === Const.SUCCESS_CODE) {
        setData(res.context || {});
      } else {
        message.error(res.message || '');
      }
    }
  };
  useEffect(() => {
    init();
    getAdInfo();
    return function logout() {
      webimLogout(
        () => {
          console.log('登出成功');
        },
        () => {
          console.log('登出失败');
        }
      );
    };
  }, []);
  return (
    <div className="container advertPay">
      <div className="advertPayContent">
        {payState === 0 && (
          <React.Fragment>
            <img src={qrCodeUrl} alt="" />
            <div>请使用手机“扫一扫”功能扫描二维码支付（建议使用微信）</div>
            <div>{endTime}</div>
          </React.Fragment>
        )}
        {payState === 1 && (
          <span>
            支付成功，
            {data.slotType !== 2
              ? '您的广告申请会在1-3个工作日内审核'
              : `您可以在APP的（${FindArea.findProviceName(data.provinceId)}${
                  data.marketName
                }-${data.mallTabName}）查看您的广告`}
          </span>
        )}
      </div>
      <div className="advertPayFooter">
        <Button type="primary" onClick={() => history.push('/advert-list')}>
          返回列表
        </Button>
      </div>
    </div>
  );
};

export default AdvertPay;
