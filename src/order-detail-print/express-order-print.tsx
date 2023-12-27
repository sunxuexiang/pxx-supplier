import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import './index-express.less';
import QRCode from 'qrcode';
import { orderGetWayBillNo } from './webapi';
import JsBarcode from 'jsbarcode';

let resData = null;

export default function ExpressOrderPrint(props) {
  const { tid } = props.match.params;
  const [expressData, setExpressData] = useState({}) as any;
  const _generateQR = async (item) => {
    return new Promise((resolve, reject) => {
      try {
        const result = {
          // qr1Code: '',
          qr2Code: ''
        };
        const _next = () => {
          if (result.qr2Code) {
            resolve(result);
          }
        };
        // QRCode.toDataURL(
        //   resData.tradeOrderId,
        //   { errorCorrectionLevel: 'H', version: 5 },
        //   (_error, res) => {
        //     if (!_error) {
        //       result.qr1Code = res;
        //       _next();
        //     } else {
        //       reject(_error);
        //     }
        //   }
        // );
        QRCode.toDataURL(
          resData.appUrl,
          { errorCorrectionLevel: 'H', version: 5 },
          (_error, res) => {
            if (!_error) {
              result.qr2Code = res;
              _next();
            } else {
              reject(_error);
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  };

  const _loadData = async () => {
    try {
      const { res } = (await orderGetWayBillNo(tid)) as any;
      if (res.code == 200) {
        const data = res.data;
        resData = data;
        const newList = [];
        for (const item of data.billNoList) {
          //qr1Code,
          const { qr2Code } = (await _generateQR(item)) as any;
          // item.qr1Code = qr1Code;
          item.qr2Code = qr2Code;
          newList.push(item);
        }
        data.billNoList = newList;
        setExpressData(data);
        setTimeout(() => {
          for (const item of data.billNoList) {
            JsBarcode(`#bar_${item.childBillNo}`, item.childBillNo, {
              width: 2,
              height: 40,
              displayValue: false
            });
          }
        }, 0);
      } else {
        message.error(res.msg || '面单打印数据获取异常');
      }
    } catch (error) {
      console.warn('面单数据=>', error);
    }
  };

  useEffect(() => {
    _loadData();
  }, []);

  const _printItem = (item, index) => {
    return (
      <div key={item.childBillNo} className="express">
        <div className="flex-row j-center dashed express-top">
          <img
            className="express-owned-img"
            src={require('./img/express_owned.svg')}
          />
          {/* <img
            className="express-other-img"
            src={require('./img/express_other.png')}
          /> */}
        </div>
        <div className="flex-row dashed">
          {/* <div className="qr-ct flex-col j-center a-center right-dashed">
            <img src={item.qr1Code} className="qr-code" />
            <div className="qr-code-text">
              {`${expressData.tradeOrderId}`.replace('YD2023', 'Y23')}
            </div>
          </div> */}
          <div className="bar-ct j-center">
            <img id={'bar_' + item.childBillNo} className="bar-code" />
            <div className="flex-row a-center bar-code-ct j-center">
              <div className="flex-col a-center j-center">
                <div className="bar-code-text">子单号 {item.childBillNo}</div>
                <div className="bar-code-text">母单号 {item.originBillNo}</div>
                <div className="current-order-text">{item.idx}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="express-three dashed">{expressData.siteName || ''}</div>
        {/* <div className="express-three-2 dashed">
          <div>{`${expressData.tradeOrderId}`}</div>
          <div>{`${expressData.tradeOrderId}`}</div>
        </div> */}
        <div className="express-four flex-row a-center dashed">
          <div className="four-receiver-ct">收</div>
          <div style={{ flex: 1 }}>
            <div className="four-receiver-text">
              {expressData.receiverName}{' '}
              {`${expressData.receiverPhone}`.replace(
                /(\d{3})\d{4}(\d{4})/,
                '$1****$2'
              )}
            </div>
            <div className="four-receiver-text">
              {expressData.receiverAddress}
            </div>
          </div>
        </div>
        <div className="express-five dashed flex-row a-center between">
          <div className="flex-row a-center">
            <div className="express-five-title">寄</div>
            <div>{expressData.storeName}</div>
          </div>
        </div>
        {/* <div className="express-six flex-row a-center dashed">
          {expressData.areaName || ''}
        </div> */}
        <div className="flex-row a-center">
          <img src={item.qr2Code} className="five-qr-code" />
          <div>
            <img className="dbj-logo" src={require('./img/dbj_logo.svg')} />
            <div className="express-owned-text five-ad-title">
              进货就到大白鲸
            </div>
            <div className="express-owned-text five-ad">
              商家进货：<strong>省时｜省力｜省心</strong>
            </div>
            <div className="express-owned-text-2">
              比价格｜找新品｜找促销品｜<strong>首选进货平台</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const _printInfo = () => {
    const containerPrint = document.getElementById('container-print');
    window.document.body.innerHTML = containerPrint.innerHTML;
    setTimeout(() => {
      window.print();
      window.location.reload();
    }, 100);
  };

  return (
    <div>
      <Button type="primary" onClick={_printInfo} style={{ margin: 10 }}>
        打印
      </Button>
      <div id="container-print">
        {expressData.billNoList && expressData.billNoList.map(_printItem)}
      </div>
    </div>
  );
}
