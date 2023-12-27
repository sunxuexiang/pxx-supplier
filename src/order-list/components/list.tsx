import React from 'react';
import { Relax } from 'plume2';
import { Link } from 'react-router-dom';
import { Checkbox, Spin, Pagination, Modal, Form, Input, Tooltip } from 'antd';
import { List, fromJS } from 'immutable';
import { noop, Const, AuthWrapper, history, util } from 'qmkit';
import Moment from 'moment';
import { allCheckedQL } from '../ql';
import FormItem from 'antd/lib/form/FormItem';
import { IList } from '../../../typings/globalType';
import { IMap } from 'plume2/es5/typings';
import '../index.less';
const defaultImg = require('../../goods-list/img/none.png');

const deliverStatus = (status) => {
  if (status == 'NOT_YET_SHIPPED') {
    return '未发货';
  } else if (status == 'SHIPPED') {
    return '全部发货';
  } else if (status == 'PART_SHIPPED') {
    return '部分发货';
  } else if (status == 'VOID') {
    return '作废';
  } else {
    return '未知';
  }
};

const payStatus = (status) => {
  if (status == 'NOT_PAID') {
    return '未付款';
  } else if (status == 'UNCONFIRMED') {
    return '待确认';
  } else if (status == 'PAID') {
    return '已付款';
  } else {
    return '未知';
  }
};

const flowState = (status) => {
  if (status == 'INIT') {
    return '待审核';
  } else if (status == 'GROUPON') {
    return '待成团';
  } else if (status == 'AUDIT' || status == 'DELIVERED_PART') {
    return '待发货';
  } else if (status == 'DELIVERED') {
    return '待收货';
  } else if (status == 'CONFIRMED') {
    return '已收货';
  } else if (status == 'COMPLETED') {
    return '已完成';
  } else if (status == 'VOID') {
    return '已作废';
  } else if (status == 'TOPICKUP') {
    return '待自提';
  }
};

type TList = List<any>;

class RejectForm extends React.Component<any, any> {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form>
        <FormItem>
          {getFieldDecorator('comment', {
            rules: [
              { required: true, message: '请输入驳回原因' },
              { validator: this.checkComment }
            ]
          })(
            <Input.TextArea
              placeholder="请输入驳回原因"
              autosize={{ minRows: 4, maxRows: 4 }}
            />
          )}
        </FormItem>
      </Form>
    );
  }

  checkComment = (_rule, value, callback) => {
    if (!value) {
      callback();
      return;
    }

    if (value.length > 100) {
      callback(new Error('备注请填写小于100字符'));
      return;
    }
    callback();
  };
}

const WrappedRejectForm = Form.create({})(RejectForm);

@Relax
export default class ListView extends React.Component<any, any> {
  _rejectForm;

  state: {
    selectedOrderId: null;
  };

  props: {
    histroy?: Object;
    relaxProps?: {
      loading: boolean;
      orderRejectModalVisible: boolean;
      total: number;
      pageSize: number;
      currentPage: number;
      dataList: TList;
      initProvider: TList;
      needAudit: boolean;

      onChecked: Function;
      onCheckedAll: Function;
      allChecked: boolean;
      onAudit: Function;
      init: Function;
      onRetrial: Function;
      onConfirm: Function;
      cancelOrder: Function;
      onCheckReturn: Function;
      verify: Function;
      hideRejectModal: Function;
      showRejectModal: Function;
      expandedRowKeys: IList;
      setProviderNum: Function;
      providerNum: number;
      onCheckReturnToPickUp: Function;
      form: IMap;
      addonBeforeForm: IMap;
      showLogisticsModal: Function;
      showChangeModal: Function;
      tab: IMap;
      showPresaleModal: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    //当前的数据总数
    total: 'total',
    //当前的分页条数
    pageSize: 'pageSize',

    currentPage: 'currentPage',
    //当前的客户列表
    dataList: 'dataList',
    needAudit: 'needAudit',
    initProvider: 'initProvider',
    tab: 'tab',

    onChecked: noop,
    onCheckedAll: noop,
    allChecked: allCheckedQL,
    onAudit: noop,
    init: noop,
    onRetrial: noop,
    onConfirm: noop,
    cancelOrder: noop,
    onCheckReturn: noop,
    verify: noop,
    orderRejectModalVisible: 'orderRejectModalVisible',
    hideRejectModal: noop,
    showRejectModal: noop,
    expandedRowKeys: 'expandedRowKeys',
    setProviderNum: noop,
    providerNum: 'providerNum',
    onCheckReturnToPickUp: noop,
    addonBeforeForm: 'addonBeforeForm',
    form: 'form',
    showLogisticsModal: noop,
    showChangeModal: noop,
    showPresaleModal: noop
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      initProvider,
      onCheckedAll,
      allChecked,
      init,
      currentPage,
      orderRejectModalVisible,
      expandedRowKeys
    } = this.props.relaxProps;

    // 是否为第三方商家 第三方隐藏业务代表、白鲸管家、是否为乡镇件、发货仓
    const isThird = util.isThirdStore();

    return (
      <div>
        <div className="ant-table-wrapper">
          <div className="ant-table ant-table-large ant-table-scroll-position-left">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table
                  style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}
                >
                  <thead className="ant-table-thead orderlist-thead">
                    <tr>
                      <th style={{ width: '5%', paddingLeft: '16px' }}>
                        <Checkbox
                          checked={allChecked}
                          onChange={(e) => {
                            const checked = (e.target as any).checked;
                            onCheckedAll(checked);
                          }}
                        />
                      </th>
                      <th style={{ width: isThird ? '20%' : '19%' }}>商品</th>
                      <th style={{ width: isThird ? '13%' : '12%' }}>
                        客户名称
                      </th>
                      <th style={{ width: isThird ? '15%' : '14%' }}>收件人</th>
                      {/* <th style={{ width: isThird ? '12%' : '10%' }}>
                        店铺名称
                      </th> */}
                      <th style={{ width: '8%' }}>金额/数量</th>
                      <th style={{ width: isThird ? '10%' : '9%' }}>
                        发货状态
                      </th>
                      {/* {!isThird && <th style={{ width: '6%' }}>业务代表</th>} */}
                      {/* {!isThird && <th style={{ width: '6%' }}>白鲸管家</th>} */}
                      <th style={{ width: '8%' }}>订单状态</th>
                      {!isThird && <th style={{ width: '6%' }}>乡镇件</th>}
                      {/* {!isThird && <th style={{ width: '6%' }}>发货仓</th>} */}
                      {/* <th style={{ width: isThird ? '9%' : '7%' }}>订单类型</th> */}
                      <th style={{ width: '9%' }}>配送方式</th>
                      <th
                        className="operation-th"
                        style={{ width: isThird ? '12%' : '10%' }}
                      >
                        付款状态
                      </th>
                    </tr>
                  </thead>
                  <tbody className="ant-table-tbody">
                    {loading
                      ? this._renderLoading()
                      : this._renderContent(dataList)}
                  </tbody>
                </table>
              </div>
              {!loading && total == 0 ? (
                <div className="ant-table-placeholder">
                  <span>
                    <i className="anticon anticon-frown-o" />
                    暂无数据
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          {total > 0 ? (
            <Pagination
              current={currentPage}
              total={total}
              pageSize={pageSize}
              showSizeChanger={true}
              showQuickJumper={true}
              pageSizeOptions={['10', '40', '60', '80', '100']}
              onChange={(pageNum, pageSize) => {
                init({ pageNum: pageNum - 1, pageSize });
              }}
              onShowSizeChange={(current, pageSize) => {
                init({ pageNum: 0, pageSize });
              }}
            />
          ) : null}

          <Modal
            maskClosable={false}
            title="请输入驳回原因"
            visible={orderRejectModalVisible}
            okText="保存"
            onOk={() => this._handleOK()}
            onCancel={() => this._handleCancel()}
          >
            <WrappedRejectForm
              ref={(form) => {
                this._rejectForm = form;
              }}
            />
          </Modal>
        </div>
      </div>
    );
  }

  _renderLoading() {
    return (
      <tr style={styles.loading}>
        <td colSpan={13}>
          <Spin />
        </td>
      </tr>
    );
  }

  _renderContent(dataList) {
    const {
      onChecked,
      onAudit,
      verify,
      needAudit,
      providerNum,
      form,
      addonBeforeForm,
      currentPage,
      pageSize,
      showLogisticsModal,
      showChangeModal,
      tab,
      showPresaleModal
    } = this.props.relaxProps;
    const key = tab.get('key');
    const isThird = util.isThirdStore();

    return (
      dataList &&
      dataList.map((v, index) => {
        const id = v.get('id');
        const tradePrice = v.getIn(['tradePrice', 'totalPrice']) || 0;
        const totalPrice = v.getIn(['tradePrice', 'totalPrice']) || 0;
        const gifts = v.get('gifts') ? v.get('gifts') : fromJS([]);
        const num =
          v
            .get('tradeItems')
            .concat(gifts)
            .map((v) => v.get('num'))
            .reduce((a, b) => {
              a = a + b;
              return a;
            }, 0) || 0;
        const buyerId = v.getIn(['buyer', 'id']);

        const orderSource = v.get('orderSource');
        let orderType = '';
        if (orderSource == 'WECHAT') {
          orderType = 'H5订单';
        } else if (orderSource == 'APP') {
          orderType = 'APP订单';
        } else if (orderSource == 'PC') {
          orderType = 'PC订单';
        } else if (orderSource == 'LITTLEPROGRAM') {
          orderType = '小程序订单';
        }
        let changeFlag = false;
        {
          /*只有第三方商家且订单状态为待收货才有修改运单号按钮*/
        }
        if (isThird && v.getIn(['tradeState', 'flowState']) === 'DELIVERED') {
          changeFlag = true;
        }
        //配送方式为快递到家(自费)、店铺配送、配送到店或自提则无修改运单号按钮
        if (
          v.get('deliverWay') === 11 ||
          v.get('deliverWay') === 4 ||
          v.get('deliverWay') === 7 ||
          v.get('deliverWay') === 6
        ) {
          changeFlag = false;
        }
        return (
          <tr className="ant-table-row  ant-table-row-level-0" key={id}>
            <td colSpan={14} style={{ padding: 0 }}>
              <table
                className="ant-table-self"
                style={{ border: '1px solid #ddd' }}
              >
                <thead>
                  <tr>
                    <td colSpan={13} style={{ padding: 0, color: '#999' }}>
                      <div
                        style={{
                          borderBottom: '1px solid #F5F5F5',
                          height: 36,
                          lineHeight: '36px'
                        }}
                      >
                        <span style={{ marginLeft: '1%' }}>
                          <Checkbox
                            checked={v.get('checked')}
                            onChange={(e) => {
                              const checked = (e.target as any).checked;
                              onChecked(index, checked);
                            }}
                          />
                        </span>

                        <div style={{ width: 310, display: 'inline-block' }}>
                          <span style={{ marginLeft: 20, color: '#000' }}>
                            {id}{' '}
                            {v.get('platform') != 'CUSTOMER' && (
                              <span style={styles.platform}>代客下单</span>
                            )}
                            {orderType != '' && (
                              <span style={styles.platform}>{orderType}</span>
                            )}
                            {v.get('grouponFlag') && (
                              <span style={styles.platform}>拼团</span>
                            )}
                            {flowState(v.getIn(['tradeState', 'flowState'])) ===
                              '待发货' &&
                              v.get('presellFlag') && (
                                <span style={styles.platform}>预售订单</span>
                              )}
                          </span>
                        </div>

                        <span
                          style={{ marginLeft: 50, color: 'rbga(0,0,0,.4)' }}
                        >
                          PID：
                          {v.toJS().parentId ? v.toJS().parentId : ''}
                        </span>
                        <span
                          style={{ marginLeft: 50, color: 'rbga(0,0,0,.4)' }}
                        >
                          支付单号：
                          {v.toJS().payOrderNo ? v.toJS().payOrderNo : ''}
                        </span>

                        <span style={{ marginLeft: 90 }}>
                          下单时间：
                          {v.getIn(['tradeState', 'createTime'])
                            ? Moment(v.getIn(['tradeState', 'createTime']))
                                .format(Const.TIME_FORMAT)
                                .toString()
                            : ''}
                        </span>

                        <Tooltip
                          placement="top"
                          title={this._renderTitle(
                            v.toJS().stockOrder ? v.toJS().stockOrder : []
                          )}
                        >
                          <span
                            style={{ marginLeft: 50, color: 'rbga(0,0,0,.4)' }}
                          >
                            囤货订单ID：
                            {v.toJS().stockOrder
                              ? v.toJS().stockOrder.length > 1
                                ? v.toJS().stockOrder[0] + '...'
                                : v.toJS().stockOrder
                              : '无'}
                          </span>
                        </Tooltip>
                        <span style={{ marginRight: 0, float: 'right' }}>
                          {/*只有自营、统仓统配(非第三方商家)的预售订单且订单状态为待发货并已付款和预售到货时间为空的才有预售到货按钮*/}
                          {!isThird &&
                            v.getIn(['tradeState', 'payState']) === 'PAID' &&
                            v.get('presellFlag') &&
                            !v.get('presellDeliverDate') &&
                            (v.getIn(['tradeState', 'flowState']) === 'AUDIT' ||
                              v.getIn(['tradeState', 'flowState']) ===
                                'DELIVERED_PART') && (
                              <AuthWrapper functionName="fOrderList005">
                                <a
                                  onClick={() => {
                                    showPresaleModal(v);
                                  }}
                                  href="javascript:void(0)"
                                  style={{ marginLeft: 20 }}
                                >
                                  预售到货
                                </a>
                              </AuthWrapper>
                            )}
                          {/*只有第三方商家且订单状态为待发货并已付款才有订单发货按钮*/}
                          {/* isThird && v.getIn(['tradeState', 'payState']) === 'PAID' &&
                            (v.getIn(['tradeState', 'flowState']) === 'AUDIT' ||
                              v.getIn(['tradeState', 'flowState']) ===
                                'DELIVERED_PART') */}
                          {v.get('supplierCanDelivery') == 1 && (
                            <AuthWrapper functionName="fOrderList005">
                              <a
                                onClick={() => {
                                  showLogisticsModal(v);
                                }}
                                href="javascript:void(0)"
                                style={{ marginLeft: 20 }}
                              >
                                订单发货
                              </a>
                            </AuthWrapper>
                          )}
                          {/*只有第三方商家且订单状态为待收货才有修改运单号按钮*/}
                          {changeFlag && (
                            <AuthWrapper functionName="fOrderList005">
                              <a
                                onClick={() => {
                                  showChangeModal(v);
                                }}
                                href="javascript:void(0)"
                                style={{ marginLeft: 20 }}
                              >
                                修改运单号
                              </a>
                            </AuthWrapper>
                          )}
                          {/*只有未审核状态才显示修改*/}
                          {/*{(v.getIn(['tradeState', 'flowState']) === 'INIT' ||*/}
                          {/*v.getIn(['tradeState', 'flowState']) === 'AUDIT') &&*/}
                          {/*v.getIn(['tradeState', 'payState']) ===*/}
                          {/*'NOT_PAID' &&*/}
                          {/*v.get('tradeItems') &&*/}
                          {/*!v*/}
                          {/*.get('tradeItems')*/}
                          {/*.get(0)*/}
                          {/*.get('isFlashSaleGoods') && (*/}
                          {/*<AuthWrapper functionName="edit_order_f_001">*/}
                          {/*<a*/}
                          {/*style={{ marginLeft: 20 }}*/}
                          {/*onClick={() => {*/}
                          {/*verify(id, buyerId);*/}
                          {/*}}*/}
                          {/*>*/}
                          {/*修改*/}
                          {/*</a>*/}
                          {/*</AuthWrapper>*/}
                          {/*)}*/}
                          {v.getIn(['tradeState', 'flowState']) === 'INIT' &&
                            v.getIn(['tradeState', 'auditState']) ===
                              'NON_CHECKED' && (
                              <AuthWrapper functionName="fOrderList002">
                                <a
                                  onClick={() => {
                                    onAudit(id, 'CHECKED');
                                  }}
                                  href="javascript:void(0)"
                                  style={{ marginLeft: 20 }}
                                >
                                  审核
                                </a>
                              </AuthWrapper>
                            )}
                          {v.getIn(['tradeState', 'flowState']) === 'INIT' &&
                            v.getIn(['tradeState', 'auditState']) ===
                              'NON_CHECKED' &&
                            v.getIn(['tradeState', 'payState']) != 'PAID' && (
                              <AuthWrapper functionName="fOrderList002">
                                <a
                                  onClick={() => this._showRejectedConfirm(id)}
                                  href="javascript:void(0)"
                                  style={{ marginLeft: 20 }}
                                >
                                  驳回
                                </a>
                              </AuthWrapper>
                            )}
                          {/*待发货状态显示*/}
                          {needAudit &&
                            v.getIn(['tradeState', 'flowState']) === 'AUDIT' &&
                            v.getIn(['tradeState', 'deliverStatus']) ===
                              'NOT_YET_SHIPPED' &&
                            v.getIn(['tradeState', 'payState']) ===
                              'NOT_PAID' && (
                              <AuthWrapper functionName="fOrderList002">
                                <a
                                  style={{ marginLeft: 20 }}
                                  onClick={() => {
                                    this._showRetrialConfirm(id);
                                  }}
                                  href="javascript:void(0)"
                                >
                                  回审
                                </a>
                              </AuthWrapper>
                            )}

                          {/*{v.getIn(['tradeState', 'flowState']) === 'AUDIT' &&*/}
                          {/*v.getIn(['tradeState', 'deliverStatus']) ===*/}
                          {/*'NOT_YET_SHIPPED' &&*/}
                          {/*!(*/}
                          {/*v.get('paymentOrder') == 'PAY_FIRST' &&*/}
                          {/*v.getIn(['tradeState', 'payState']) != 'PAID'*/}
                          {/*) &&*/}
                          {/*(v.getIn(['payInfo', 'payTypeId']) != '1' ||*/}
                          {/*v.getIn(['tradeState', 'payState']) == 'PAID') &&*/}
                          {/*(!(*/}
                          {/*v.get('tradeVOList') &&*/}
                          {/*v.get('tradeVOList').size > 0*/}
                          {/*) ||*/}
                          {/*v.get('isContainsTrade')) && (*/}
                          {/*<AuthWrapper functionName="fOrderDetail002">*/}
                          {/*<a*/}
                          {/*onClick={() => this._toDeliveryForm(id)}*/}
                          {/*style={{ marginLeft: 20 }}*/}
                          {/*>*/}
                          {/*发货*/}
                          {/*</a>*/}
                          {/*</AuthWrapper>*/}
                          {/*)}*/}
                          {v.getIn(['tradeState', 'flowState']) ===
                            'TOPICKUP' &&
                            ((v.get('paymentOrder') == 'PAY_FIRST' &&
                              v.getIn(['tradeState', 'payState']) == 'PAID') ||
                              v.get('paymentOrder') == 'NO_LIMIT') &&
                            (!(
                              v.get('tradeVOList') &&
                              v.get('tradeVOList').size > 0
                            ) ||
                              v.get('isContainsTrade')) && (
                              <AuthWrapper functionName="fOrderDetail002">
                                <a
                                  onClick={() =>
                                    this._toDeliveryFormToPickUp(id)
                                  }
                                  style={{ marginLeft: 20 }}
                                >
                                  自提
                                </a>
                              </AuthWrapper>
                            )}
                          {/*部分发货状态显示*/}
                          {/*{v.getIn(['tradeState', 'flowState']) ===*/}
                          {/*'DELIVERED_PART' &&*/}
                          {/*v.getIn(['tradeState', 'deliverStatus']) ===*/}
                          {/*'PART_SHIPPED' &&*/}
                          {/*!(*/}
                          {/*v.get('paymentOrder') == 'PAY_FIRST' &&*/}
                          {/*v.getIn(['tradeState', 'payState']) != 'PAID' &&*/}
                          {/*v.getIn(['payInfo', 'payTypeId']) != '1'*/}
                          {/*) && (*/}
                          {/*<AuthWrapper functionName="fOrderDetail002">*/}
                          {/*<a onClick={() => this._toDeliveryForm(id)}>*/}
                          {/*发货*/}
                          {/*</a>*/}
                          {/*</AuthWrapper>*/}
                          {/*)}*/}
                          {/* 打印面单 deliverWay: 7 为配送到店*/}
                          {v.getIn(['tradeState', 'flowState']) ===
                            'DELIVERED' &&
                            v.getIn(['deliverWay']) == 7 && (
                              <AuthWrapper functionName="fOrderList003">
                                <a
                                  onClick={() => {
                                    this._printExpressOrder(id);
                                  }}
                                  href={undefined}
                                  style={{ marginLeft: 20 }}
                                >
                                  打印面单
                                </a>
                              </AuthWrapper>
                            )}
                          {/*待收货状态显示*/}
                          {v.getIn(['tradeState', 'flowState']) ===
                            'DELIVERED' && (
                            <AuthWrapper functionName="fOrderList003">
                              <a
                                onClick={() => {
                                  this._showConfirm(id);
                                }}
                                href="javascript:void(0)"
                                style={{ marginLeft: 20 }}
                              >
                                确认收货
                              </a>
                            </AuthWrapper>
                          )}
                          {v.getIn(['tradeState', 'payState']) === 'PAID' && (
                            <a
                              onClick={() => {
                                let searchCacheForm =
                                  JSON.parse(
                                    sessionStorage.getItem('searchCacheForm')
                                  ) || {};
                                sessionStorage.setItem(
                                  'searchCacheForm',
                                  JSON.stringify({
                                    ...searchCacheForm,
                                    orderForm:
                                      {
                                        ...form.toJS(),
                                        currentPage: currentPage - 1,
                                        pageSize: pageSize
                                      } || {},
                                    tabKey: key,
                                    orderAddonBeforeForm:
                                      addonBeforeForm.toJS() || {}
                                  })
                                );
                                this._printOrder(id);
                              }}
                              href=""
                              style={{ marginLeft: 20 }}
                            >
                              订单打印
                            </a>
                          )}
                          <AuthWrapper functionName="fOrderDetail001">
                            <a
                              href="javascript:;"
                              style={{ marginLeft: 20, marginRight: 20 }}
                              onClick={() => {
                                let searchCacheForm =
                                  JSON.parse(
                                    sessionStorage.getItem('searchCacheForm')
                                  ) || {};
                                sessionStorage.setItem(
                                  'searchCacheForm',
                                  JSON.stringify({
                                    ...searchCacheForm,
                                    orderForm:
                                      {
                                        ...form.toJS(),
                                        currentPage: currentPage - 1,
                                        pageSize: pageSize
                                      } || {},
                                    tabKey: key,
                                    orderAddonBeforeForm:
                                      addonBeforeForm.toJS() || {}
                                  })
                                );
                                history.push({
                                  pathname: `/order-detail/${id}`
                                });
                              }}
                            >
                              查看详情
                            </a>
                            {/* <Link
                              style={{ marginLeft: 20, marginRight: 20 }}
                              to={`/order-detail/${id}`}
                            >
                              查看详情
                            </Link> */}
                          </AuthWrapper>
                          {(v.getIn(['tradeState', 'flowState']) === 'AUDIT' ||
                            v.getIn(['tradeState', 'flowState']) ===
                              'DELIVERED_PART') && (
                            <AuthWrapper functionName="f_order_cancel">
                              <a
                                style={{ marginRight: 20 }}
                                onClick={() => {
                                  this._cancelOrder(id);
                                }}
                                href="javascript:void(0)"
                              >
                                取消订单
                              </a>
                            </AuthWrapper>
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* <td style={{ width: '3%' }} /> */}
                    <td
                      style={{
                        textAlign: 'left',
                        // display: 'flex',
                        // alignItems: 'flex-end',
                        // padding: '16px 0',
                        width: isThird ? '25%' : '24%'
                      }}
                    >
                      {/*商品图片*/}
                      {v
                        .get('imgList')
                        .map((v, k) =>
                          k < 2 ? (
                            <img
                              src={v.get('pic') ? v.get('pic') : defaultImg}
                              style={styles.imgItem}
                              key={k}
                            />
                          ) : null
                        )}

                      {/*第3张特殊处理*/
                      //@ts-ignore
                      v.get('tradeItems').concat(gifts).size > 2 ? (
                        <div style={styles.imgBg}>
                          <img
                            //@ts-ignore
                            src={
                              v
                                .get('tradeItems')
                                .concat(gifts)
                                .get(2)
                                .get('pic')
                                ? v
                                    .get('tradeItems')
                                    .concat(gifts)
                                    .get(2)
                                    .get('pic')
                                : defaultImg
                            }
                            style={styles.imgFourth}
                          />
                          //@ts-ignore
                          <div style={styles.imgNum}>
                            {/* 共{v.get('tradeItems').concat(gifts).size}种 */}
                            共{v.get('specNumber')}种
                          </div>
                        </div>
                      ) : null}
                    </td>
                    <td style={{ width: isThird ? '13%' : '12%' }}>
                      {/*客户名称*/}
                      {v.getIn(['buyer', 'name'])}
                      {/* {v.getIn(['buyer', 'name']).substr(0,3) + "****" + v.getIn(['buyer', 'name']).substr(7)} */}
                    </td>
                    <td style={{ width: isThird ? '15%' : '14%' }}>
                      {/*收件人姓名*/}
                      收件人：{v.getIn(['consignee', 'name'])}
                      <br />
                      {/*收件人手机号码*/}
                      {v.getIn(['consignee', 'phone'])}
                      {/* {v.getIn(['consignee', 'phone']).substr(0,3) + "****" + v.getIn(['consignee', 'phone']).substr(7)} */}
                    </td>
                    {/* <td style={{ width: isThird ? '12%' : '10%' }}>
                      商家
                      {v.getIn(['supplier', 'storeName'])}
                    </td> */}
                    {/*数量金额*/}
                    <td style={{ width: '8%' }}>
                      ￥{totalPrice.toFixed(2)}
                      {/* ￥{(tradePrice+(v.get('tradePrice')?.get('balancePrice')||0)).toFixed(2)} */}
                      <br />（{num}箱)
                    </td>
                    {/*发货状态*/}
                    <td style={{ width: isThird ? '10%' : '9%' }}>
                      {deliverStatus(v.getIn(['tradeState', 'deliverStatus']))}
                    </td>
                    {/* <td style={{ width: '6%' }}>
                      是
                    </td> */}
                    {/*业务代表*/}
                    {/* {!isThird && (
                      <td style={{ width: '6%' }}>{v.get('employeeName')}</td>
                    )} */}

                    {/*白鲸管家*/}
                    {/* {!isThird && (
                      <td style={{ width: '6%' }}>
                        {v.get('managerName') || 'system'}
                      </td>
                    )} */}
                    {/*订单状态*/}
                    <td style={{ width: '8%' }}>
                      {flowState(v.getIn(['tradeState', 'flowState']))}
                    </td>
                    {/* 是否乡镇件 */}
                    {!isThird && (
                      <td style={{ width: '6%' }}>
                        {v.toJS().newVilageFlag ? '是' : '否'}
                      </td>
                    )}
                    {/* 发货仓 */}
                    {/* {!isThird && (
                      <td style={{ width: '6%' }}>{v.get('wareName')}</td>
                    )} */}
                    {/* 订单类型 */}
                    {/* <td style={{ width: isThird ? '9%' : '7%' }}>
                      {v.get('activityType') == 4 ? '囤货订单' : '提货订单'}
                    </td> */}
                    {/*配送方式*/}
                    <td
                      style={{
                        width: '9%',
                        fontWeight:
                          v.getIn(['deliverWay']) == 7 ? 'bold' : '400'
                      }}
                    >
                      {v.get('deliverWayDesc')}
                    </td>
                    {/*支付状态*/}
                    <td
                      style={{
                        width: isThird ? '12%' : '10%',
                        paddingRight: 22
                      }}
                      className="operation-td"
                    >
                      {payStatus(v.getIn(['tradeState', 'payState']))}
                    </td>
                  </tr>
                  {this._renderSonTrade(v.get('tradeVOList'))}
                </tbody>
              </table>
            </td>
          </tr>
        );
      })
    );
  }
  _renderTitle = (stockOrder) => {
    return stockOrder.map((i) => {
      return (
        <p>
          <span>{i}</span>
        </p>
      );
    });
  };

  _renderSonTrade(sonList) {
    const { setProviderNum, providerNum } = this.props.relaxProps;
    let storeIdNum = providerNum;
    const isThird = util.isThirdStore();
    return (
      sonList &&
      sonList.map((v) => {
        const id = v.get('id');
        let providerName = v.getIn(['supplier', 'storeName']);
        const providerCode = v.getIn(['supplier', 'supplierCode']);
        if (providerName == null && providerCode == null) {
          providerName = '-';
        }
        const tradePrice = v.getIn(['tradePrice', 'goodsPrice']) || 0;
        const totalPrice = v.getIn(['tradePrice', 'totalPrice']) || 0;
        const tradeItems = v.get('tradeItems');
        const gifts = v.get('gifts') ? v.get('gifts') : fromJS([]);
        const items = tradeItems.concat(gifts);
        const num =
          items
            .map((v) => v.get('num'))
            .reduce((a, b) => {
              a = a + b;
              return a;
            }, 0) || 0;
        return (
          <>
            <tr>
              <td style={{ width: '3%' }} />
              <td style={{ width: '20%' }}>
                <div style={{ display: 'inline-block', color: '#000' }}>
                  <span>子单:{id}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ width: '3%' }} />
              <td
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '16px 22px',
                  width: isThird ? '25%' : '24%'
                }}
              >
                {/*商品图片*/}
                {items.map((v, k) => {
                  return k < 2 ? (
                    <img
                      src={v.get('pic') ? v.get('pic') : defaultImg}
                      style={styles.imgItem}
                      key={k}
                    />
                  ) : null;
                })}

                {/*第3张特殊处理*/
                //@ts-ignore
                items.size > 2 ? (
                  //@ts-ignore
                  <div style={styles.imgBg}>
                    <img
                      //@ts-ignore
                      src={items.get(2).get('pic')}
                      //@ts-ignore
                      style={styles.imgFourth}
                    />
                    //@ts-ignore
                    <div style={styles.imgNum}>共{items.size}种</div>
                  </div>
                ) : null}
              </td>
              <td style={{ width: isThird ? '13%' : '12%' }}>-</td>
              <td style={{ width: isThird ? '15%' : '14%' }}>-</td>
              {/* <td style={{ width: isThird ? '12%' : '12%' }}>
                商家
                {providerName}
                <br />
                {providerCode}
              </td> */}
              <td style={{ width: '8%' }}>
                ￥{(tradePrice || 0).toFixed(2)}
                <br />（{num}箱)
              </td>
              {/*发货状态*/}
              <td style={{ width: isThird ? '10%' : '9%' }}>
                {deliverStatus(v.getIn(['tradeState', 'deliverStatus']))}
              </td>
              {/* {!isThird && <td style={{ width: '6%' }}>-</td>} */}
              {/* {!isThird && <td style={{ width: '6%' }}>-</td>} */}
              {/*订单状态*/}
              <td style={{ width: '8%' }}>-</td>
              {!isThird && <td style={{ width: '6%' }}>-</td>}
              {/* {!isThird && <td style={{ width: '6%' }}>-</td>} */}
              {/* <td style={{ width: isThird ? '9%' : '7%' }}>-</td> */}
              <td style={{ width: '9%' }}>-</td>
              {/*支付状态*/}
              <td style={{ width: isThird ? '12%' : '10%' }}>
                - &nbsp;&nbsp;&nbsp;
              </td>
            </tr>
          </>
        );
      })
    );
  }

  _printOrder = (tid: string) => {
    history.push(`/order-detail-print/${tid}`);
  };

  /**
   * 打印面单
   * @param tid 主键ID
   */
  _printExpressOrder = (tid: string) => {
    history.push(`/express-order-print/${tid}`);
  };

  /**
   * 驳回订单确认提示
   * @private
   */
  _showRejectedConfirm = (tdId: string) => {
    const { showRejectModal } = this.props.relaxProps;
    this.setState({ selectedOrderId: tdId }, showRejectModal());
  };

  /**
   * 回审订单确认提示
   * @param tdId
   * @private
   */
  _showRetrialConfirm = (tdId: string) => {
    const { onRetrial } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: '回审',
      content: '确认将选中的订单退回重新审核?',
      onOk() {
        onRetrial(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 发货前 验证订单是否存在售后申请 跳转发货页面
   * @param tdId
   * @private
   */
  _toDeliveryForm = (tdId: string) => {
    const { onCheckReturn } = this.props.relaxProps;
    onCheckReturn(tdId);
  };

  /**
   * 发货前 验证订单是否存在售后申请 跳转发货页面
   * @param tdId
   * @private
   */
  _toDeliveryFormToPickUp = (tdId: string) => {
    const { onCheckReturnToPickUp } = this.props.relaxProps;
    onCheckReturnToPickUp(tdId);
  };

  /**
   * 确认收货确认提示
   * @param tdId
   * @private
   */
  _showConfirm = (tdId: string) => {
    const { onConfirm } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: '确认收货',
      content: '确认已收到全部货品?',
      onOk() {
        onConfirm(tdId);
      },
      onCancel() {}
    });
  };

  /**
   * 取消订单提示
   * @param tdId
   * @private
   */
  _cancelOrder = (tdId: string) => {
    const { cancelOrder } = this.props.relaxProps;

    const confirm = Modal.confirm;
    confirm({
      title: '订单取消',
      content: '确认取消该订单?',
      onOk() {
        cancelOrder(tdId);
      },
      onCancel() {}
    });
  };
  /**
   * 处理成功
   */
  _handleOK = () => {
    const { onAudit } = this.props.relaxProps;
    this._rejectForm.validateFields(null, (errs, values) => {
      //如果校验通过
      if (!errs) {
        onAudit(this.state.selectedOrderId, 'REJECTED', values.comment);
        this._rejectForm.setFieldsValue({ comment: '' });
      }
    });
  };

  /**
   * 处理取消
   */
  _handleCancel = () => {
    const { hideRejectModal } = this.props.relaxProps;
    hideRejectModal();
    this._rejectForm.setFieldsValue({ comment: '' });
  };
}

const styles = {
  loading: {
    textAlign: 'center',
    height: 300
  },
  imgItem: {
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    background: '#fff',
    borderRadius: 3
  },
  imgFourth: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 3
  },
  imgBg: {
    position: 'relative',
    width: 60,
    height: 60,
    padding: 5,
    border: '1px solid #ddd',
    float: 'left',
    marginRight: 10,
    borderRadius: 3
  },
  imgNum: {
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    background: 'rgba(0,0,0,0.6)',
    borderRadius: 3,
    fontSize: 9,
    color: '#fff'
  },
  platform: {
    fontSize: 12,
    padding: '1px 3px',
    display: 'inline-block',
    marginLeft: 5,
    border: ' 1px solid #F56C1D',
    color: '#F56C15',
    borderRadius: 5,
    lineHeight: '20px'
  }
} as any;
