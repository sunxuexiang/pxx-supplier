import React from 'react';
import { IMap, Relax } from 'plume2';
import { fromJS, List, Map } from 'immutable';
import { Const } from 'qmkit';
import Moment from 'moment';

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
    // const customerName =detail.get('consignee') ?
    //   detail.get('consignee').get('address') + detail.get('buyer').get('name') : '';
    // const addressDetail = detail.get('consignee').get('detailAddress');
    const customerName = detail.get('buyer').get('name');
    const addressDetail = '';
    const buyerRemark = detail.get('buyerRemark');
    return (
      <div style={{ marginLeft: 5 }}>
        <div
          dangerouslySetInnerHTML={{ __html: printSetting.get('printHead') }}
        ></div>
        <div style={{ fontSize: 14 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >
            <img
              style={{ width: '39vh', height: '58px' }}
              src="https://cjdbj.oss-cn-zhangjiakou.aliyuncs.com/assets/image/theme/login.png"
            />
          </div>
          <div>
            <text>录单日期：{createTimeStr}</text>
            <text style={{ marginLeft: 40 }}>打印时间：{printTime}</text>
            <text style={{ marginLeft: 40 }}>单据编号：{orderId}</text>
          </div>
          <div>
            <text>客户名称：{customerName}</text>
          </div>
          <div>物流信息：{addressDetail ? addressDetail : '-'}</div>
          <div>摘要：{buyerRemark ? buyerRemark : '-'}</div>
        </div>
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
