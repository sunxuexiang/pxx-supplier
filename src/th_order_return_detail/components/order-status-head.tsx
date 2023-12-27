import React from 'react';

import { Relax } from 'plume2';
import { Col, message, Modal, Row } from 'antd';
import { Link } from 'react-router-dom';
import { IMap } from 'typings/globalType';
import { AuthWrapper, Const, noop } from 'qmkit';
import { DeliverModal, OnlineRefundModal, RefundModal, RejectModal } from 'biz';
import { fromJS } from 'immutable';
import moment from 'moment';

const confirm = Modal.confirm;

@Relax
export default class OrderStatusHead extends React.Component<any, any> {
  props: {
    relaxProps?: {
      detail: IMap;
      //驳回／拒绝收货 modal状态
      rejectModalData: IMap;
      // 填写物流 modal状态
      deliverModalData: IMap;
      // 线下退款 modal状态
      refundModalData: IMap;
      //线上支付退款
      onlineRefundModalData: IMap;
      init: Function;
      onRejectModalChange: Function;
      onRejectModalHide: Function;
      onDeliverModalChange: Function;
      onDeliverModalHide: Function;
      onRefundModalChange: Function;
      onRefundModalHide: Function;
      onAudit: Function;
      onReject: Function;
      onDeliver: Function;
      onReceive: Function;
      onRejectReceive: Function;
      onOnlineRefund: Function;
      onOfflineRefund: Function;
      onRejectRefund: Function;
      checkRefundStatus: Function;
      onlineRefundModalShow: Function;
      onlineRefundModalHide: Function;
      onRefundOnlineModalChange: Function;
      refundRecord: IMap;
      fetchRefundOrder: Function;
    };
  };

  static relaxProps = {
    detail: 'detail',
    rejectModalData: 'rejectModalData',
    deliverModalData: 'deliverModalData',
    refundModalData: 'refundModalData',
    onlineRefundModalData: 'onlineRefundModalData',
    init: noop,
    onRejectModalChange: noop,
    onRejectModalHide: noop,
    onDeliverModalChange: noop,
    onDeliverModalHide: noop,
    onRefundModalChange: noop,
    onRefundModalHide: noop,
    onAudit: noop,
    onReject: noop,
    onDeliver: noop,
    onReceive: noop,
    onRejectReceive: noop,
    onOnlineRefund: noop,
    onOfflineRefund: noop,
    onRejectRefund: noop,
    checkRefundStatus: noop,
    onlineRefundModalShow: noop,
    onlineRefundModalHide: noop,
    onRefundOnlineModalChange: noop,
    refundRecord: 'refundRecord',
    fetchRefundOrder: noop
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      detail,
      onAudit,
      onReject,
      onDeliver,
      onReceive,
      onRejectReceive,
      onOnlineRefund,
      onOfflineRefund,
      onRejectRefund,
      rejectModalData,
      onRejectModalHide,
      deliverModalData,
      onDeliverModalHide,
      refundModalData,
      onRefundModalHide,
      onlineRefundModalData,
      onlineRefundModalHide
    } = this.props.relaxProps;
    let { refundRecord } = this.props.relaxProps;

    const rid = detail.get('id');
    const customerId = detail.getIn(['buyer', 'id']);
    // 支付方式 0在线 1线下
    const payType = detail.get('payType') === 0 ? 0 : 1;

    // 退单类型 RETURN 退货, REFUND 退款
    const returnType = detail.get('returnType') || 'RETURN';
    const returnFlowState = detail.get('returnFlowState');
    // 总额
    const totalPrice = detail.getIn(['returnPrice', 'totalPrice']);
    // 改价金额
    const applyPrice = detail.getIn(['returnPrice', 'applyPrice']);
    // 应退金额，如果对退单做了改价，使用applyPrice，否则，使用总额totalPrice
    const payPrice = applyPrice || totalPrice;
    // 应退积分
    const applyPoints = detail.getIn(['returnPoints', 'applyPoints']) || 0;

    //退款单
    refundRecord = refundRecord || fromJS({});
    const enableReturn =
      (returnFlowState === 'RECEIVED' ||
        (returnType == 'REFUND' && returnFlowState === 'AUDIT')) &&
      refundRecord.get('refundStatus') != null &&
      refundRecord.get('refundStatus') != 2 &&
      refundRecord.get('refundStatus') != 3;
    const returnTypeFlag = returnType == 'RETURN';
    return (
      <div>
        <div style={styles.container as any}>
          <div style={styles.row}>
            <div style={styles.orderPre}>
              <label style={styles.greenText}>
                {returnType == 'RETURN'
                  ? Const.returnGoodsState[returnFlowState]
                  : Const.returnMoneyState[returnFlowState] || ''}
              </label>
            </div>
            <div style={styles.orderEnd}>
              {/* {returnFlowState === 'INIT' && (
                <AuthWrapper functionName="f_order_return_edit">
                  <Link
                    style={styles.pr20}
                    to={{
                      pathname: `/order-return-edit/${rid}`,
                      state: { rid: `${rid}` }
                    }}
                  >
                    修改
                  </Link>
                </AuthWrapper>
              )}
              {returnFlowState === 'INIT' && (
                <AuthWrapper functionName="rolf002">
                  <a
                    style={styles.pr20}
                    href="javascript:;"
                    onClick={() => this._showAudit(onAudit, rid)}
                  >
                    审核
                  </a>
                </AuthWrapper>
              )}

              {returnFlowState === 'INIT' && returnTypeFlag && (
                <AuthWrapper functionName="rolf002">
                  <a
                    style={styles.pr20}
                    href="javascript:;"
                    onClick={() => this._showReject(onReject, rid)}
                  >
                    驳回
                  </a>
                </AuthWrapper>
              )} */}

              {/*退货单的已审核状态*/}
              {/* {returnFlowState === 'AUDIT' && returnType == 'RETURN' && (
                <AuthWrapper functionName="rolf003">
                  <a
                    style={styles.pr20}
                    href="javascript:;"
                    onClick={() => this._showDeliver(onDeliver, rid)}
                  >
                    填写物流
                  </a>
                </AuthWrapper>
              )} */}

              {/*已收货状态 或者 退款单的已审核状态*/}
              {/* {enableReturn && (
                <AuthWrapper functionName="rolf005">
                  <div>
                    {' '}
                    <a
                      style={styles.pr20}
                      href="javascript:;"
                      onClick={() => {
                        if (payType == 0) {
                          this._showOnlineRefund(
                            onOnlineRefund,
                            rid,
                            customerId,
                            payPrice,
                            applyPoints
                          );
                        } else {
                          this._showOfflineRefund(
                            onOfflineRefund,
                            rid,
                            customerId,
                            payPrice,
                            applyPoints
                          );
                        }
                      }}
                    >
                      退款
                    </a>
                  </div>
                </AuthWrapper>
              )} */}
              {/*已收货状态 或者 退款单的已审核状态*/}
              {/*{enableReturn && (*/}
              {/*  <AuthWrapper functionName="rolf005">*/}
              {/*    <a*/}
              {/*      style={styles.pr20}*/}
              {/*      href="javascript:;"*/}
              {/*      onClick={() =>*/}
              {/*        this._showRejectRefund(onRejectRefund, rid, 0 == payType)*/}
              {/*      }*/}
              {/*    >*/}
              {/*      拒绝退款*/}
              {/*    </a>*/}
              {/*  </AuthWrapper>*/}
              {/*)}*/}
            </div>
          </div>
          <Row>
            <Col span={8}>
              <p style={styles.darkText}>
                退单号：{detail.get('id')}{' '}
                {detail.get('platform') != 'CUSTOMER' && (
                  <span style={styles.platform}>代退单</span>
                )}
              </p>
              <p style={styles.darkText}>
                申请时间：
                {moment(detail.get('createTime')).format(Const.TIME_FORMAT)}
              </p>
              <p style={styles.darkText}>订单号：{detail.get('tid')}</p>
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                客户：{detail.getIn(['buyer', 'name']) ? detail.getIn(['buyer', 'name']) : ''}
              </p>
              <p style={styles.darkText}>
                客户账号：{this._parsePhone(detail.getIn(['buyer', 'account']))}
              </p>

              {detail.getIn(['buyer', 'customerFlag']) && (
                <p style={styles.darkText}>
                  客户等级：{detail.getIn(['buyer', 'levelName'])}
                </p>
              )}
            </Col>
            <Col span={8}>
              <p style={styles.darkText}>
                支付方式：{detail.get('payType')==0?'在线付款':'对公付款'}
              </p>
            </Col>
          </Row>
        </div>
        {/* <RejectModal
          data={rejectModalData}
          onHide={onRejectModalHide}
          handleOk={rejectModalData.get('onOk')}
        />
        <DeliverModal
          data={deliverModalData}
          onHide={onDeliverModalHide}
          handleOk={deliverModalData.get('onOk')}
        /> */}
        <RefundModal
          data={refundModalData}
          onHide={onRefundModalHide}
          handleOk={refundModalData.get('onOk')}
        />
        <OnlineRefundModal
          data={onlineRefundModalData}
          onHide={onlineRefundModalHide}
        />
      </div>
    );
  }

  // // 审核
  // async _showAudit(onAudit: Function, rid: string) {
  //   confirm({
  //     title: '审核通过',
  //     content: '是否确认审核通过？',
  //     onOk() {
  //       return onAudit(rid);
  //     },
  //     onCancel() {}
  //   });
  // }

  // // 驳回
  // _showReject(onReject: Function, rid: string) {
  //   this.props.relaxProps.onRejectModalChange({
  //     visible: true,
  //     type: '驳回',
  //     onOk: onReject,
  //     rid: rid
  //   });
  // }

  // // 填写物流
  // _showDeliver(onDeliver: Function, rid: string) {
  //   this.props.relaxProps.onDeliverModalChange({
  //     visible: true,
  //     onOk: onDeliver,
  //     rid: rid
  //   });
  // }

  // // 收货
  // _showReceive(onReceive: Function, rid: string) {
  //   confirm({
  //     title: '确认收货',
  //     content: '是否确认收货？',
  //     onOk() {
  //       return onReceive(rid);
  //     },
  //     onCancel() {}
  //   });
  // }

  // // 拒绝收货
  // _showRejectReceive(onRejectReceive: Function, rid: string) {
  //   this.props.relaxProps.onRejectModalChange({
  //     visible: true,
  //     type: '拒绝收货',
  //     onOk: onRejectReceive,
  //     rid: rid
  //   });
  // }

  // 在线退款 这里不要奇怪，新的需求 线上线下走的是一个接口 才onOfflineRefund
  async _showOnlineRefund(
    onOnlineRefund: Function,
    rid: string,
    customerId: string,
    refundAmount: number,
    applyPoints: number
  ) {
    this.props.relaxProps.onRefundOnlineModalChange({
      visible: true,
      onOk: onOnlineRefund,
      rid: rid,
      customerId: customerId,
      refundAmount: refundAmount,
      applyPoints: applyPoints
    });
  }

  // 线下退款
  _showOfflineRefund(
    onOfflineRefund: Function,
    rid: string,
    customerId: string,
    refundAmount: number,
    applyPoints: number
  ) {
    this.props.relaxProps.onRefundModalChange({
      visible: true,
      onOk: onOfflineRefund,
      rid: rid,
      customerId: customerId,
      refundAmount: refundAmount,
      applyPoints: applyPoints
    });
  }

  // 拒绝退款
  async _showRejectRefund(
    onRejectRefund: Function,
    rid: string,
    online: boolean
  ) {
    // 在线退款需要校验是否已在退款处理中
    if (online) {
      const { checkRefundStatus, init } = this.props.relaxProps;
      const { res } = await checkRefundStatus(rid);
      if (res.code !== Const.SUCCESS_CODE) {
        message.error(res.message);
        setTimeout(() => init(rid), 2000);
        return;
      }
    }

    this.props.relaxProps.onRejectModalChange({
      visible: true,
      type: '拒绝退款',
      onOk: onRejectRefund,
      rid: rid
    });
  }

  /**
   * 解析phone
   * @param phone
   */
  _parsePhone(phone: string) {
    if (phone && phone.length == 11) {
      return `${phone.substring(0, 3)}****` + `${phone.substring(7, 11)}`;
    } else {
      return phone;
    }
  }
}

const styles = {
  container: {
    //display: 'flex',
    //flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    padding: 15
    //justifyContent: 'space-between',
    // alignItems: 'center',
  },
  greenText: {
    color: '#339966',
    fontSize: 12
  },
  geryText: {
    fontSize: 12,
    marginLeft: 20
  },
  orderPre: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 2
  },
  orderEnd: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'flex-end'
  },
  pr20: {
    paddingRight: 20
  },
  darkText: {
    color: '#333333',
    lineHeight: '24px'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  platform: {
    fontSize: 12,
    color: '#fff',
    padding: '1px 3px',
    background: '#F56C1D',
    display: 'inline-block',
    marginLeft: 5
  }
} as any;
