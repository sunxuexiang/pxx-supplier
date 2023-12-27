import React from 'react';
import { Relax } from 'plume2';
import moment from 'moment';
import { Table, Modal } from 'antd';
import { IMap } from 'typings/globalType';
import { Const, noop, util } from 'qmkit';

const { confirm } = Modal;

/**
 * 退款记录 💵
 */
@Relax
export default class ReturnRecord extends React.Component<any, any> {
  props: {
    relaxProps?: {
      refundRecord: IMap;
      onRefundDestroy: Function;
      detail: IMap;
    };
  };

  static relaxProps = {
    refundRecord: 'refundRecord',
    onRefundDestroy: noop,
    detail: 'detail'
  };

  constructor(props) {
    super(props);
  }

  columns = [
    {
      title: '退款流水号',
      dataIndex: 'refundBillCode',
      key: 'refundBillCode',
      render: (text) => {
        const { detail } = this.props.relaxProps;
        return detail.get('returnFlowState') == 'COMPLETED' ? text : '-';
      }
    },
    {
      title: '退款时间',
      dataIndex: 'refundBillTime',
      key: 'refundBillTime',
      render: (refundBillTime, rowData) =>
        refundBillTime
          ? moment(refundBillTime).format(
              rowData.payType == 0 ? Const.TIME_FORMAT : Const.DAY_FORMAT
            )
          : '-'
    },
    {
      title: '应退积分',
      dataIndex: 'returnPoints',
      key: 'returnPoints',
      render: (returnPoints) => <div>{returnPoints}</div>
    },
    {
      title: '应退金额',
      dataIndex: 'returnPrice',
      key: 'returnPrice',
      render: (returnPrice) => <div>￥{returnPrice.toFixed(2)}</div>
    },
    {
      title: '退单改价',
      dataIndex: 'actualReturnPrice',
      key: 'actualReturnPrice',
      render: (price) => <div>￥{price.toFixed(2)}</div>
    },
    {
      title: '退款方式',
      dataIndex: 'payType',
      key: 'payType',
      render: (payType) => Const.payType[payType]
    },
    {
      title: '退款账户',
      dataIndex: 'returnAccountName',
      key: 'returnAccountName',
      render: (returnAccountName) =>
        returnAccountName ? this._desensitizeAccount(returnAccountName) : '-'
    },
    {
      title: '客户收款账户',
      dataIndex: 'customerAccount',
      key: 'customerAccount',
      render: (_) => {
        const { detail } = this.props.relaxProps;
        const customerAccount = detail.get('customerAccount');
        if (customerAccount != null) {
          const bankName = customerAccount.get('bankName')
            ? customerAccount.get('bankName')
            : customerAccount.get('customerBankName');
          return `${bankName} ${this._parseBankNo(
            customerAccount.get('customerAccountNo')
          )}`;
        } else {
          return '-';
        }
      }
    },
    {
      title: '退款状态',
      dataIndex: 'refundStatus',
      key: 'refundStatus',
      render: (refundStatus) => Const.refundStatus[refundStatus]
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
      render: (comment) => (comment ? comment : '无')
    }
  ];

  render() {
    const { refundRecord } = this.props.relaxProps;

    const list: Array<any> =
      refundRecord && refundRecord.get('refundBillCode')
        ? [refundRecord.toJS()]
        : [];

    return list.length > 0 ? (
      <div style={styles.container}>
        <h2 style={{ fontSize: 18, paddingBottom: 16 }}>退款记录</h2>
        <Table
          rowKey="refundId"
          columns={this.columns}
          dataSource={list}
          pagination={false}
          bordered
        />
      </div>
    ) : null;
  }

  _handleClickDestroy(refundId: string) {
    const { onRefundDestroy } = this.props.relaxProps;

    confirm({
      title: '作废',
      content: '是否确认作废这条退款记录？',
      onOk() {
        return onRefundDestroy(refundId);
      },
      onCancel() {}
    });
  }

  _desensitizeAccount(accountNm) {
    const strArr = accountNm.split(' ');
    if (strArr[1]) {
      strArr[1] = util.desensitizeStr(strArr[1]);
    }
    return strArr.join(' ');
  }

  _parseBankNo(bankNo: string) {
    if (!bankNo || bankNo.length <= 9) {
      return bankNo;
    }
    if (bankNo.length > 9) {
      return `${bankNo.substring(0, 4)}****${bankNo.substring(
        bankNo.length - 4,
        bankNo.length
      )}`;
    }
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  }
} as any;
