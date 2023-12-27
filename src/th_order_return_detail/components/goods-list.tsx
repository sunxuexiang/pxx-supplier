import React from 'react';
import { Relax } from 'plume2';
import { IMap } from 'typings/globalType';
import { Popover } from 'antd';
import moment from 'moment';
import { fromJS } from 'immutable';
import { Const, Logistics } from 'qmkit';

import { Table } from 'antd';

const columns = [
  {
    title: 'SKU编码',
    dataIndex: 'skuNo',
    key: 'skuNo',
    render: (text) => <span>{text}</span>
  },
  {
    title: '商品名称',
    dataIndex: 'skuName',
    key: 'skuName'
  },
  {
    title: '规格',
    dataIndex: 'goodsSubtitle',
    key: 'goodsSubtitle',
    render: (s) => <div>{s}</div>
  },
  {
    title: '生产日期',
    dataIndex: 'goodsBatchNo',
    key: 'goodsBatchNo',
    render: (param) => (param ? <div>{param}</div> : <div>-</div>)
  },
  {
    title: '退货单价',
    dataIndex: 'price',
    key: 'price',
    render: (price) => <div>￥{price.toFixed(2)}</div>
  },
  {
    title: '下单数量',
    dataIndex: 'byNum',
    key: 'byNum',
  },
  {
    title: '退货数量',
    dataIndex: 'num',
    key: 'num'
  },
  // {
  //   title: '实际退货数量',
  //   dataIndex: 'receivedQty',
  //   key: 'receivedQty',
  //   render: (receivedQty) => {
  //     if (receivedQty) {
  //       return receivedQty;
  //     } else {
  //       return '-';
  //     }
  //   }
  // },
  {
    title: '退货金额小计',
    dataIndex: 'splitPrice',
    key: 'splitPriceTotal',
    render: (splitPrice) => <div>￥{splitPrice.toFixed(2)}</div>
  }
];

@Relax
export default class GoodsList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      rejectReason: string;
      refundRecord: IMap;
    };
  };

  static relaxProps = {
    detail: 'detail',
    rejectReason: 'rejectReason',
    refundRecord: 'refundRecord'
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { detail, rejectReason, refundRecord } = this.props.relaxProps;
    const detailObj = detail.toJS();
    // sku list
    const returnItems = detailObj.returnItems ? detailObj.returnItems : [];
    //赠品信息
    let returnGifts = detailObj.returnGifts ? detailObj.returnGifts : [];
    returnGifts = returnGifts.map((gift) => {
      gift.skuName = '【赠品】' + gift.skuName;
      gift.splitPrice = 0;
      return gift;
    });

    // 总额 detail.getIn(['returnPrice', 'totalPrice'])
    const totalPrice = detail.getIn(['returnPrice', 'shouldReturnPrice']);
    // 改价金额 detail.getIn(['returnPrice', 'applyPrice'])
    const applyPrice = detail.getIn(['returnPrice', 'actualReturnPrice']);
    // 应退积分
    const applyPoints = detail.getIn(['returnPoints', 'applyPoints']);
    // 实退积分
    const actualPoints = detail.getIn(['returnPoints', 'actualPoints']);
    // 附件图片
    let images = detailObj.images || [];
    images = images.map((imageString) => JSON.parse(imageString));

    // 退货原因
    const returnReason = detailObj.returnReason || {};

    // 退货还是退款
    const returnType = detail.get('returnType');

    // 退货方式
    const returnWay = detailObj.returnWay || {};

    const refundStatus = refundRecord && refundRecord.get('refundStatus');

    // 物流信息
    let logisticInfo = '';
    const returnLogistics = detail.get('returnLogistics');
    let returnLogisticInfo;

    if (returnLogistics) {
      logisticInfo =
        ' 发货日期：' +
        moment(returnLogistics.get('createTime')).format(Const.DAY_FORMAT) +
        ' 物流公司：' +
        returnLogistics.get('company') +
        ' 物流单号：' +
        returnLogistics.get('no');

      returnLogisticInfo = {
        logisticCompanyName: returnLogistics.get('company'),
        logisticNo: returnLogistics.get('no'),
        logisticStandardCode: returnLogistics.get('code')
      };
    }

    // 退单状态
    const returnFlowStatus = detailObj.returnFlowState;
    let rejectLabel = '';
    switch (returnFlowStatus) {
      case 'REJECT_RECEIVE':
        rejectLabel = '拒绝收货原因';
        break;
      case 'REJECT_REFUND':
        rejectLabel = '拒绝退款原因';
        break;
      case 'VOID':
        rejectLabel = '审核驳回原因';
        break;
    }

    return (
      <div style={styles.container}>
        <Table
          rowKey={(_record, index) => index.toString()}
          columns={columns}
          dataSource={returnItems.concat(returnGifts)}
          pagination={false}
          bordered
        />
        <div style={styles.detailBox as any}>
          <div />
          <div style={styles.priceBox}>
            <label style={styles.priceItem as any}>
              <span style={styles.name}>应退金额: </span>
              <strong>
                ￥
                {totalPrice
                  ? parseFloat(totalPrice).toFixed(2)
                  : Number(0).toFixed(2)}
              </strong>
            </label>
            <label style={styles.priceItem as any}>
              <span style={styles.name}>应退积分: </span>
              <strong>{applyPoints ? applyPoints : Number(0)}</strong>
            </label>
            <label style={styles.priceItem as any}>
                <span style={styles.name}>应退鲸币: </span>
                <strong>{detail.getIn(['returnPrice', 'balanceReturnPrice']) || Number(0)}</strong>
            </label>
            {refundStatus === 2 && (
              <label style={styles.priceItem as any}>
                <span style={styles.name}>实退金额: </span>
                <strong>
                  ￥
                  {applyPrice
                    ? parseFloat(applyPrice).toFixed(2)
                    : Number(0).toFixed(2)}
                </strong>
              </label>
            )}
            {refundStatus === 2 && (
              <label style={styles.priceItem as any}>
                <span style={styles.name}>实退鲸币: </span>
                <strong>
                  ￥{(detail.getIn(['returnPrice', 'actualBalanceReturnPrice']) || Number(0)).toFixed(2)}
                </strong>
              </label>
            )}
            {refundStatus === 2 && (
              <label style={styles.priceItem as any}>
                <span style={styles.name}>实退积分: </span>
                <strong>{actualPoints ? actualPoints : Number(0)}</strong>
              </label>
            )}
          
          </div>
        </div>
        <div style={styles.returnReason}>
          <label style={styles.inforItem}>
            退货原因:{' '}
            {Object.getOwnPropertyNames(returnReason).map(
              (key) => returnReason[key]
            )}
          </label>
          <label style={styles.inforItem}>
            退货说明: {detail.get('description')}
          </label>
          {
            /**退货才有退货方式**/
            returnType == 'RETURN' ? (
              <label style={styles.inforItem}>
                退货方式:{' '}
                {Object.getOwnPropertyNames(returnWay).map(
                  (key) => returnWay[key]
                )}
              </label>
            ) : null
          }
          <div style={styles.inforItem}>
            <label>退单附件: </label>
            {images.map((imageObj, index) => (
              <Popover
                key={'pp-' + index}
                placement="topRight"
                title={''}
                trigger="click"
                content={
                  <img
                    key={'p-' + index}
                    style={styles.attachmentView}
                    src={imageObj.url}
                  />
                }
              >
                <a href="javascript:;" style={styles.imgBox}>
                  <img
                    key={index}
                    style={styles.attachment}
                    src={imageObj.url}
                  />
                </a>
              </Popover>
            ))}
          </div>
          {returnType == 'RETURN' && returnWay['1'] ? (
            <label style={styles.inforItem}>
              物流信息: {logisticInfo}
              {returnLogisticInfo && (
                <Logistics
                  companyInfo={fromJS(returnLogisticInfo)}
                  deliveryTime={moment(
                    returnLogistics.get('createTime')
                  ).format(Const.DAY_FORMAT)}
                />
              )}
            </label>
          ) : null}

          <label style={styles.inforItem}>
            {rejectLabel ? rejectLabel + ': ' + rejectReason : ''}
          </label>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20
  },

  returnReason: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 20
  },
  detailBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    border: '1px solid #e9e9e9',
    borderTop: 0,
    marginTop: -4,
    borderRadius: 4
  },
  priceBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  name: {
    width: 120,
    textAlign: 'right',
    display: 'inline-block'
  },
  priceItem: {
    width: 200,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10
  },
  inforItem: {
    paddingTop: 10,
    marginLeft: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  attachment: {
    width: 40,
    height: 40
  },
  attachmentView: {
    maxWidth: 400
  },
  imgBox: {
    marginRight: 5
  }
} as any;
