import React from 'react';
import { IMap, Relax } from 'plume2';
import { history } from 'qmkit';

@Relax
export default class HomeBody extends React.Component<any, any> {
  props: {
    relaxProps?: {
      tradeTodo: IMap;
      returnTodo: IMap;
      customerTodo: IMap;
      employee: IMap;
    };
  };

  static relaxProps = {
    tradeTodo: 'tradeTodo',
    returnTodo: 'returnTodo',
    customerTodo: 'customerTodo',
    employee: 'employee'
  };

  render() {
    const {
      tradeTodo,
      returnTodo,
      customerTodo,
      employee
    } = this.props.relaxProps;
    const phone = employee.get('phone');
    const phone1 = phone ? phone.slice(0, 3) + '****' + phone.slice(7) : '无';

    return (
      <div style={styles.container}>
        <div className="flowBox">
          <div className="homeItem pending">
            <h3>待处理事项</h3>
            <div className="dateBg">
              <a
                onClick={() => this._toOrderList({ key: 'flowState-INIT' })}
                className="dataItem"
              >
                <label>待审核订单</label>
                <strong>{tradeTodo.get('waitAudit')}</strong>
              </a>
              <a
                onClick={() => this._toOrderList({ payStatus: 'NOT_PAID' })}
                className="dataItem"
              >
                <label>待付款订单</label>
                <strong>{tradeTodo.get('waitPay')}</strong>
              </a>
              <a
                onClick={() => this._toOrderList({ key: 'flowState-AUDIT' })}
                className="dataItem"
              >
                <label>待发货订单</label>
                <strong>{tradeTodo.get('waitDeliver')}</strong>
              </a>
              <a
                onClick={() =>
                  this._toOrderList({ key: 'flowState-DELIVERED' })
                }
                className="dataItem"
              >
                <label>待收货订单</label>
                <strong>{tradeTodo.get('waitReceiving')}</strong>
              </a>
            </div>

            <div className="dateBg">
              <a
                onClick={() => this._toReturnList({ key: 'flowState-INIT' })}
                className="dataItem"
              >
                <label>待审核退单</label>
                <strong>{returnTodo.get('waitAudit')}</strong>
              </a>
              <a
                onClick={() => this._toReturnList({ key: 'flowState-AUDIT' })}
                className="dataItem"
              >
                <label>待填写物流退单</label>
                <strong>{returnTodo.get('waitFillLogistics')}</strong>
              </a>
              <a
                onClick={() =>
                  this._toReturnList({ key: 'flowState-DELIVERED' })
                }
                className="dataItem"
              >
                <label>待收货退单</label>
                <strong>{returnTodo.get('waitReceiving')}</strong>
              </a>
              <a
                onClick={() =>
                  this._toReturnList({ key: 'flowState-RECEIVED' })
                }
                className="dataItem"
              >
                <label>待退款退单</label>
                <strong>{returnTodo.get('waitRefund')}</strong>
              </a>
            </div>

            <div className="dateBg">
              <a
                onClick={() => this._toCustomerList({ key: '0' })}
                className="dataItem"
              >
                <label>待审核客户</label>
                <strong>{customerTodo.get('waitAuditCustomer')}</strong>
              </a>
              <a
                onClick={() => this._toFinanceTax({ key: '0' })}
                className="dataItem"
              >
                <label>待审核增票资质</label>
                <strong>{customerTodo.get('waitAuditCustomerInvoice')}</strong>
              </a>
              <a
                onClick={() => this._toOrderTicket({ invoiceState: '0' })}
                className="dataItem"
              >
                <label>待开票订单</label>
                <strong>{customerTodo.get('waitAuditOrderInvoice')}</strong>
              </a>
              <a className="dataItem" />
            </div>
          </div>
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
                <strong>{phone1}</strong>
              </div>
              <div className="peopleDetails">
                <label>员工角色</label>
                <strong>
                  {employee.get('accountName') === 'system'
                    ? '超级管理员'
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
  _toOrderList = state => {
    history.push({
      pathname: '/order-list',
      state: state
    });
  };

  /**
   * route 退单列表
   */
  _toReturnList = state => {
    history.push({
      pathname: '/order-return-list',
      state: state
    });
  };

  /**
   * route 会员列表
   */
  _toCustomerList = state => {
    history.push({
      pathname: '/customer-list',
      state: state
    });
  };

  /**
   * route 增票资质
   */
  _toFinanceTax = state => {
    history.push({
      pathname: '/finance-val-added-tax',
      state: state
    });
  };

  /**
   * route 开票订单
   */
  _toOrderTicket = state => {
    history.push({
      pathname: '/finance-order-ticket',
      state: state
    });
  };
}

const styles = {
  container: {
    backgroundColor: '#fff'
  }
};
