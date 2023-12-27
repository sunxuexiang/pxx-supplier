import React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List, Map } from 'immutable';
import { Const, cache } from 'qmkit';
import Moment from 'moment';
import QRCode from 'qrcode';

/**
 * 订单打印头部
 */
@Relax
export default class OrderPrintHeader extends React.Component<any, any> {
  onAudit: any;

  props: {
    relaxProps?: {
      detail: IMap;
      printSetting: IMap;
    };
  };

  static relaxProps = {
    detail: 'detail',
    printSetting: 'printSetting'
  };

  componentDidMount(): void {
    const { detail, printSetting } = this.props.relaxProps;
    const orderId = detail.get('id');
    if (detail.get('deliverWay') == 7) {
      // 7: 配送到店才有二维码打印
      QRCode.toDataURL(
        `${Const.TMS_URL}/print?id=${orderId}`,
        { errorCorrectionLevel: 'H', version: 5 },
        (_error, res) => {
          if (!_error) {
            // @ts-ignore
            document.getElementById('tmsPrint').src = res;
          } else {
          }
        }
      );
    } else {
      document.getElementById('tmsPrint').style.display = 'none';
    }
  }

  render() {
    const { detail, printSetting } = this.props.relaxProps;
    const createTime = detail.get('createTime');
    const createTimeStr = Moment(createTime)
      .format(Const.DAY_FORMAT)
      .toString();
    const printTime = Moment(Date.now())
      .format(Const.DATE_FORMAT)
      .toString();
    const orderId = detail.get('id');
    // const customerName =
    //   detail.get('consignee').get('address') + detail.get('buyer').get('name');
    const customerName = detail.get('buyer').get('name');
    const deliverWay = detail.get('deliverWay');
    let addressDetail;
    // let pointDetail = detail.get('logisticsCompanyInfo')
    //   ? detail.get('logisticsCompanyInfo').get('receivingPoint')
    //   : '';
    if (deliverWay == 1 || deliverWay == 8) {
      // 托运部
      addressDetail = detail.get('logisticsCompanyInfo')
        ? `${detail.get('logisticsCompanyInfo').get('logisticsCompanyName')} 
          ${detail.get('logisticsCompanyInfo').get('logisticsCompanyPhone')} 
          ${detail.get('logisticsCompanyInfo').get('logisticsAddress')}`
        : '';
    } else if (deliverWay == 7) {
      // 配送到店不显示
      addressDetail = '';
    } else {
      addressDetail = detail.get('consignee').get('detailAddress');
    }
    const buyerRemark = detail.get('buyerRemark');
    const tmsSiteVO =
      detail.get('tradeDelivers') &&
      detail.get('tradeDelivers').toJS().length > 0 &&
      detail.get('tradeDelivers').toJS()[0].logistics
        ? detail.get('tradeDelivers').toJS()[0].logistics.tmsSiteVO || ''
        : '';
    return (
      <div style={{ marginLeft: 5, color: 'rgb(0, 0, 0)' }}>
        <div
          dangerouslySetInnerHTML={{ __html: printSetting.get('printHead') }}
        ></div>
        <div style={{ fontSize: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <img
              style={{ width: '240px' }}
              src={sessionStorage.getItem(cache.SITE_LOGO)}
            />
          </div>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            <text>店铺名称：{detail.get('supplier').get('storeName')}</text>
          </div>
          <div>
            <text>日&emsp;&emsp;期：{createTimeStr}</text>
            <text style={{ marginLeft: 40 }}>打印时间：{printTime}</text>
            <text style={{ marginLeft: 40 }}>单据编号：{orderId}</text>
          </div>
          <div>
            <text>客户名称：{customerName}</text>
          </div>
          <div>
            收货地址：{detail.get('consignee').get('name')}{' '}
            {detail.get('consignee').get('phone')}{' '}
            {detail.get('consignee').get('detailAddress')}
          </div>
          <div>配送方式：{detail.get('deliverWayDesc') || '-'}</div>
          {detail.get('deliverWay') === 7 && tmsSiteVO && (
            <div>
              接货点：{tmsSiteVO.siteName}&emsp;{tmsSiteVO.provinceName}
              {tmsSiteVO.cityName}
              {tmsSiteVO.districtName}
              {tmsSiteVO.street}
              {tmsSiteVO.address}&emsp;
              {tmsSiteVO.contactPerson}
              {tmsSiteVO.contactPhone}
            </div>
          )}
          {/* <div>收货站点：{pointDetail || '-'}</div> */}
          <div style={{ display: addressDetail ? 'block' : 'none' }}>
            物流地址：{addressDetail ? addressDetail : '-'}
          </div>
          <div>备&emsp;&emsp;注：{buyerRemark ? buyerRemark : '-'}</div>
        </div>
        <img
          id="tmsPrint"
          style={{
            position: 'absolute',
            right: 0,
            top: 10,
            width: 100,
            height: 100
          }}
        ></img>
      </div>
    );
  }
}

const styles = {
  headBox: {
    padding: 15,
    backgroundColor: '#FAFAFA'
  }
} as any;
