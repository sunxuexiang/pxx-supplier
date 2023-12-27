import React from 'react';
import { IMap, Relax } from 'plume2';
import { Icon, Modal, Checkbox } from 'antd';
import { fromJS } from 'immutable';

import { history, noop } from 'qmkit';
import { IList } from 'typings/globalType';
@Relax
export default class TodoItems extends React.Component<any, any> {
  state = { visible: false };
  showModal = () => {
    this.setState({
      visible: true
    });
  };
  hideModal = () => {
    this.setState({
      visible: false
    });
  };

  props: {
    relaxProps?: {
      tradeTodo: IMap;
      returnTodo: IMap;
      goodsTodo: IMap;
      employee: IMap;
      dataBoard: IList;
      changeDataBoard: Function;
      fOrderList002: boolean;
      fOrderList001: boolean;
      fOrderDetail002: boolean;
      fOrderList003: boolean;
      rolf002: boolean;
      rolf003: boolean;
      rolf004: boolean;
      rolf005: boolean;
      f_customer_3: boolean;
      changeInvoice: boolean;
      f_goods_check_1: boolean;
      destoryOpenOrderInvoice: boolean;
      todoVisible: boolean;
      settlement: IMap;
    };
  };
  static relaxProps = {
    tradeTodo: 'tradeTodo',
    returnTodo: 'returnTodo',
    goodsTodo: 'goodsTodo',
    employee: 'employee',
    dataBoard: 'dataBoard',
    changeDataBoard: noop,
    fOrderList002: 'fOrderList002',
    fOrderList001: 'fOrderList001',
    fOrderDetail002: 'fOrderDetail002',
    fOrderList003: 'fOrderList003',
    rolf002: 'rolf002',
    rolf003: 'rolf003',
    rolf004: 'rolf004',
    rolf005: 'rolf005',
    f_customer_3: 'f_customer_3',
    changeInvoice: 'changeInvoice',
    f_goods_check_1: 'f_goods_check_1',
    destoryOpenOrderInvoice: 'destoryOpenOrderInvoice',
    todoVisible: 'todoVisible',
    settlement: 'settlement'
  };

  render() {
    const {
      tradeTodo,
      returnTodo,
      goodsTodo,
      employee,
      dataBoard,
      changeDataBoard,
      fOrderList002,
      fOrderList001,
      fOrderDetail002,
      fOrderList003,
      rolf002,
      rolf003,
      rolf004,
      rolf005,
      f_customer_3,
      changeInvoice,
      destoryOpenOrderInvoice,
      todoVisible,
      settlement
    } = this.props.relaxProps;
    const phone = employee.get('phone') || '无';
    let total = 0;
    let settled = 0;
    settlement.forEach((value) => {
      total = value.get('totalAmount') + total;
    });
    settlement.forEach((value) => {
      if (value.get('settleStatus') == 1) {
        settled = value.get('totalAmount') + settled;
      }
    });
    return (
      <div>
        {/* 配置主页 */}
        <a href={undefined} className="configHome" onClick={this.showModal}>
          <Icon type="bars" style={{ fontSize: 16, color: '#F56C1D' }} />
          <p className="configName">配置主页</p>
        </a>
        <Modal
          maskClosable={true}
          style={{ position: 'fixed', right: 0, top: 64 }}
          title={
            <div>
              <p>配置主页控制面板</p>
              <p style={{ color: '#666', fontSize: 12, marginTop: 10 }}>
                数据看板
              </p>
            </div>
          }
          visible={this.state.visible}
          closable={false}
          onCancel={this.hideModal}
          width="230"
          footer={null}
        >
          {dataBoard && dataBoard.size > 0 ? (
            dataBoard.map((board, index) => {
              board = fromJS(board);
              if (
                window.companyType == 0 &&
                board.get('label') == '业务员业绩排行'
              ) {
                return null;
              } else {
                return (
                  <div key={index} className="ProCheckDes">
                    <Checkbox
                      defaultChecked={board.get('onOff')}
                      onChange={(e) => {
                        const checked = (e.target as any).checked;
                        changeDataBoard(board.get('dataKey'), checked);
                      }}
                    >
                      {board.get('label')}
                    </Checkbox>
                  </div>
                );
              }
            })
          ) : (
            <div style={{ textAlign: 'center' }}>暂无可配置项</div>
          )}
        </Modal>

        <div className="flowBox" style={{ marginLeft: -5, marginRight: -5 }}>
          {false && (
            <div className="homeItem pending">
              <h3>￥资金概况</h3>
              <label>已结算资金</label>
              <strong>{settled}</strong>

              <label>未结算资金</label>
              <strong>{total - settled}</strong>
            </div>
          )}

          {todoVisible ? (
            <div className="homeItem pending">
              <h3>待处理事项</h3>
              <div>
                {fOrderList002 ? (
                  <a
                    onClick={() => this._toOrderList({ key: 'flowState-INIT' })}
                    className="dataItem"
                  >
                    <label>待审核订单</label>
                    <strong>{tradeTodo.get('waitAudit')}</strong>
                  </a>
                ) : null}
                {fOrderList001 ? (
                  <a
                    onClick={() => this._toOrderList({ payStatus: 'NOT_PAID' })}
                    className="dataItem"
                  >
                    <label>待付款订单</label>
                    <strong>{tradeTodo.get('waitPay')}</strong>
                  </a>
                ) : null}
                {fOrderDetail002 ? (
                  <a
                    onClick={() =>
                      this._toOrderList({ key: 'flowState-AUDIT' })
                    }
                    className="dataItem"
                  >
                    <label>待发货订单</label>
                    <strong>{tradeTodo.get('waitDeliver')}</strong>
                  </a>
                ) : null}
                {fOrderList003 ? (
                  <a
                    onClick={() =>
                      this._toOrderList({ key: 'flowState-DELIVERED' })
                    }
                    className="dataItem"
                  >
                    <label>待收货订单</label>
                    <strong>{tradeTodo.get('waitReceiving')}</strong>
                  </a>
                ) : null}
                {rolf002 ? (
                  <a
                    onClick={() =>
                      this._toReturnList({ key: 'flowState-INIT' })
                    }
                    className="dataItem"
                  >
                    <label>待审核退单</label>
                    <strong>{returnTodo.get('waitAudit')}</strong>
                  </a>
                ) : null}
                {rolf003 ? (
                  <a
                    onClick={() =>
                      this._toReturnList({ key: 'flowState-AUDIT' })
                    }
                    className="dataItem"
                  >
                    <label>待填写物流退单</label>
                    <strong>{returnTodo.get('waitFillLogistics')}</strong>
                  </a>
                ) : null}
                {rolf004 ? (
                  <a
                    onClick={() =>
                      this._toReturnList({ key: 'flowState-DELIVERED' })
                    }
                    className="dataItem"
                  >
                    <label>待收货退单</label>
                    <strong>{returnTodo.get('waitReceiving')}</strong>
                  </a>
                ) : null}
                {rolf005 ? (
                  <a
                    onClick={() =>
                      this._toReturnList({ key: 'flowState-RECEIVED' })
                    }
                    className="dataItem"
                  >
                    <label>待退款退单</label>
                    <strong>{returnTodo.get('waitRefund')}</strong>
                  </a>
                ) : null}
                {f_customer_3 ? (
                  <a
                    onClick={() => this._toCustomerList({ invoiceState: '0' })}
                    className="dataItem"
                  >
                    <label>待开票订单</label>
                    <strong>{goodsTodo.get('waitInvoice')}</strong>
                  </a>
                ) : null}
                {changeInvoice ? (
                  <a
                    onClick={() => this._toFinanceTax({ key: '2' })}
                    className="dataItem"
                  >
                    <label>待审核商品</label>
                    <strong>{goodsTodo.get('waitGoods')}</strong>
                  </a>
                ) : null}
                {destoryOpenOrderInvoice ? (
                  <a
                    onClick={() => this._toOrderTicket({ invoiceState: '0' })}
                    className="dataItem"
                  >
                    <label>待结算账单</label>
                    <strong>{goodsTodo.get('waitSettle')}</strong>
                  </a>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="homeItem pending">
              <h3>待处理事项</h3>
              <div className="empty">
                <img
                  src="http://kstoreimages.b0.upaiyun.com/1506413955650.jpg"
                  alt=""
                />
                <p style={{ marginTop: 20 }}>您还没有添加待处理事项</p>
              </div>
            </div>
          )}

          <div className="homeItem peopleInfo">
            <h3>员工信息</h3>
            <div className="proPeople">
              <div className="peopleDetails">
                <label>员工账号</label>
                <strong>{employee.get('accountName')}</strong>
              </div>
              <div className="peopleDetails">
                <label>员工姓名</label>
                <strong>{employee.get('employeeName')}</strong>
              </div>
              <div className="peopleDetails">
                <label>手机号</label>
                <strong>{phone}</strong>
              </div>
              <div className="peopleDetails">
                <label>员工角色</label>
                <strong>
                  {employee.get('isMasterAccount') == 1
                    ? '系统管理员'
                    : employee.get('roleName')}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * route 订单列表
   */
  _toOrderList = (state) => {
    history.push({
      pathname: '/order-list',
      state: state
    });
  };
  /**
   * route 退单列表
   */
  _toReturnList = (state) => {
    history.push({
      pathname: '/order-return-list',
      state: state
    });
  };
  /**
   * route 订单开票列表
   */
  _toCustomerList = (state) => {
    history.push({
      pathname: '/finance-order-ticket',
      state: state
    });
  };
  /**
   * route 待审核商品列表
   */
  _toFinanceTax = (state) => {
    history.push({
      pathname: '/goods-check',
      state: state
    });
  };
  /**
   * route 待结算的账单
   */
  _toOrderTicket = (state) => {
    history.push({
      pathname: '/finance-manage-settle',
      state: state
    });
  };
}
