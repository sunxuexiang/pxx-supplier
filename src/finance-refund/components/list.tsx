import React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import {
  Dropdown,
  Icon,
  Menu,
  Popconfirm,
  Tooltip,
  Modal,
  message
} from 'antd';
import momnet from 'moment';
const confirm = Modal.confirm;

type TList = List<any>;
const { Column } = DataGrid;

const refundOrderStatusDic = {
  0: '待退款',
  1: '拒绝退款',
  2: '已退款'
};

const payTypeDic = {
  0: '在线支付',
  1: '线下支付'
};

/**
 * 订单收款单列表
 */
@Relax
export default class PayOrderList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      onDestory: Function;
      onConfirm: Function;
      init: Function;
      onCreateRefund: Function;
      offlineAccounts: TList;
      onCreateRefuse: Function;
      onCreateOnlineRefund: Function;
      checkRefundStatus: Function;
      current: number;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDestory: noop,
    onSelect: noop,
    init: noop,
    onConfirm: noop,
    onCreateRefund: noop,
    offlineAccounts: 'offlineAccounts',
    onCreateRefuse: noop,
    onCreateOnlineRefund: noop,
    checkRefundStatus: noop,
    current: 'current'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      dataList,
      init,
      current
    } = this.props.relaxProps;
    return (
      <DataGrid
        loading={loading}
        rowKey="refundId"
        pagination={{
          pageSize,
          total,
          current: current,
          onChange: (pageNum, pageSize) => {
            init({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="退款流水号"
          key="refundBillCode"
          dataIndex="refundBillCode"
          render={(refundBillCode) => (
            <span>{refundBillCode ? refundBillCode : '-'}</span>
          )}
        />
        <Column
          title="退单号"
          key="returnOrderCode"
          dataIndex="returnOrderCode"
        />
        <Column
          title="退单时间"
          key="createTime"
          dataIndex="createTime"
          render={(createTime) => (
            <span>
              {momnet(createTime)
                .format(Const.TIME_FORMAT)
                .toString()}
            </span>
          )}
        />

        <Column title="客户名称" key="customerName" dataIndex="customerName" />
        <Column
          title="应退金额"
          key="returnPrice"
          dataIndex="returnPrice"
          render={(returnPrice) => (
            <span>
              {`￥${returnPrice ? returnPrice.toFixed(2) : (0.0).toFixed(2)}`}
            </span>
          )}
        />
        <Column
          title="实退金额"
          key="actualReturnPrice"
          dataIndex="actualReturnPrice"
          render={(actualReturnPrice) => (
            <span>
              {actualReturnPrice ? `￥${actualReturnPrice.toFixed(2)}` : '-'}
            </span>
          )}
        />
        <Column
          width="100"
          title="退款方式"
          key="payType"
          dataIndex="payType"
          render={(payType) => <span>{payTypeDic[payType]}</span>}
        />
        <Column
          width="10%"
          title="退款账户"
          key="returnAccountName"
          dataIndex="returnAccountName"
          render={(returnAccountName) => (
            <span>{returnAccountName ? returnAccountName : '-'}</span>
          )}
        />
        <Column
          width="70"
          title="状态"
          key="refundStatus"
          dataIndex="refundStatus"
          render={(refundStatus) => (
            <span>{refundOrderStatusDic[refundStatus]}</span>
          )}
        />

        <Column
          title="备注"
          key="comment"
          dataIndex="comment"
          render={(comment) => {
            return (
              <span>
                {comment ? (
                  <Tooltip title={this._renderComment(comment)} placement="top">
                    <a href="javascript:void(0);">查看</a>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </span>
            );
          }}
        />
        <Column
          width="80"
          title="操作"
          render={(rowInfo) => this._renderOperate(rowInfo)}
        />
      </DataGrid>
    );
  }

  _renderComment(comment) {
    return (
      <div style={{ wordBreak: 'break-all', wordWrap: 'break-word' }}>
        {comment}
      </div>
    );
  }

  _renderOperate(rowInfo) {
    const {
      refundStatus,
      refundId,
      customerId,
      payType,
      returnOrderCode,
      returnPrice
    } = rowInfo;
    const { onDestory } = this.props.relaxProps;
    //线下支付
    if (payType == 1) {
      //待退款
      if (refundStatus == 0) {
        return (
          <Dropdown
            getPopupContainer={() => document.getElementById('page-content')}
            overlay={this._renderOfflineMenu(
              refundId,
              customerId,
              returnOrderCode,
              returnPrice
            )}
            trigger={['click']}
          >
            <a className="ant-dropdown-link" href="#">
              操作 <Icon type="down" />
            </a>
          </Dropdown>
        );
        //已退款
      } else if (refundStatus == 2) {
        return (
          <Popconfirm
            title="要作废当前退款么?"
            onConfirm={() => {
              onDestory(refundId);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">作废</a>
          </Popconfirm>
        );
        //已作废
      }
      //线上支付
    } else {
      if (refundStatus == 0) {
        return (
          <Dropdown
            overlay={this._renderOnlineMenu(
              refundId,
              customerId,
              returnOrderCode
            )}
            trigger={['click']}
          >
            <a className="ant-dropdown-link" href="#">
              操作 <Icon type="down" />
            </a>
          </Dropdown>
        );
      } else if (refundStatus == 2) {
        return <span>{'-'}</span>;
      }
    }

    //已作废
    return <span>{'-'}</span>;
  }

  _renderOfflineMenu = (
    id: string,
    customerId: string,
    returnOrderCode: string,
    returnPrice: number
  ) => {
    const { onCreateRefund, onCreateRefuse } = this.props.relaxProps;

    return (
      <Menu>
        <Menu.Item key="0">
          <a
            href="javascript:void(0);"
            onClick={() =>
              onCreateRefund(customerId, id, returnOrderCode, returnPrice)
            }
          >
            退款
          </a>
        </Menu.Item>

        <Menu.Item key="1">
          <a href="javascript:void(0);" onClick={() => onCreateRefuse(id)}>
            拒绝退款
          </a>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };

  _renderOnlineMenu = (
    id: string,
    _customerId: string,
    returnOrderCode: string
  ) => {
    const { onCreateRefuse } = this.props.relaxProps;
    return (
      <Menu>
        <Menu.Item key="0">
          <a
            href="javascript:void(0);"
            onClick={() => this._onlineRefund(returnOrderCode)}
          >
            确认退款
          </a>
        </Menu.Item>

        <Menu.Item key="1">
          <a
            href="javascript:void(0);"
            onClick={async () => {
              const { checkRefundStatus } = this.props.relaxProps;

              const { res } = await checkRefundStatus(returnOrderCode);

              if (res.code === Const.SUCCESS_CODE) {
                onCreateRefuse(id);
              } else {
                message.error(res.message);
              }
            }}
          >
            拒绝退款
          </a>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };

  _renderAccountName(returnAccount) {
    const { offlineAccounts } = this.props.relaxProps;
    return offlineAccounts
      .find(
        (offlineAccount) => offlineAccount.get('accountId') == returnAccount
      )
      .get('bankNo');
  }

  async _onlineRefund(returnOrderCode: string) {
    const { onCreateOnlineRefund, checkRefundStatus } = this.props.relaxProps;

    const { res } = await checkRefundStatus(returnOrderCode);

    if (res.code === Const.SUCCESS_CODE) {
      confirm({
        title: '确认退款',
        content: '是否确认退款？退款后钱款将原路退回对方账户。',
        onOk() {
          return onCreateOnlineRefund(returnOrderCode);
        },
        onCancel() {}
      });
    } else {
      message.error(res.message);
    }
  }
}
