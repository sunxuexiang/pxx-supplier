import React from 'react';
import { Relax } from 'plume2';
import { Const, DataGrid, noop } from 'qmkit';
import { List } from 'immutable';
import { Dropdown, Icon, Menu, Popconfirm, Tooltip } from 'antd';
import momnet from 'moment';

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
export default class RefundList extends React.Component<any, any> {
  props: {
    relaxProps?: {
      loading: boolean;
      selected: TList;
      total: number;
      pageSize: number;
      dataList: TList;
      onDestory: Function;
      onConfirm: Function;
      onSearch: Function;
      onCreateRefund: Function;
      offlineAccounts: TList;
      onSelect: Function;
    };
  };

  static relaxProps = {
    loading: 'loading',
    total: 'total',
    pageSize: 'pageSize',
    dataList: 'dataList',
    onDestory: noop,
    onSelect: noop,
    onSearch: noop,
    onConfirm: noop,
    onCreateRefund: noop,
    offlineAccounts: 'offlineAccounts',
    selected: 'selected'
  };

  render() {
    const {
      loading,
      total,
      pageSize,
      selected,
      dataList,
      onSearch,
      onSelect
    } = this.props.relaxProps;

    return (
      <DataGrid
        loading={loading}
        rowKey="refundId"
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selected.toJS(),
          onChange: selectedRowKeys => {
            onSelect(selectedRowKeys);
          }
        }}
        pagination={{
          pageSize,
          total,
          onChange: (pageNum, pageSize) => {
            onSearch({ pageNum: pageNum - 1, pageSize });
          }
        }}
        dataSource={dataList.toJS()}
      >
        <Column
          title="退款流水号"
          key="refundBillCode"
          dataIndex="refundBillCode"
          render={refundBillCode => (
            <span>{refundBillCode ? refundBillCode : '-'}</span>
          )}
        />
        <Column
          title="退款时间"
          key="refundBillTime"
          dataIndex="refundBillTime"
          render={refundBillTime => (
            <span>
              {momnet(refundBillTime)
                .format(Const.TIME_FORMAT)
                .toString()}
            </span>
          )}
        />
        <Column
          title="退单号"
          key="returnOrderCode"
          dataIndex="returnOrderCode"
        />

        <Column title="客户名称" key="customerName" dataIndex="customerName" />
        <Column
          title="应退金额"
          key="returnPrice"
          dataIndex="returnPrice"
          render={returnPrice => (
            <span>{returnPrice ? `￥${returnPrice.toFixed(2)}` : '-'}</span>
          )}
        />
        <Column
          title="实退金额"
          key="actualReturnPrice"
          dataIndex="actualReturnPrice"
          render={actualReturnPrice => (
            <span>
              {actualReturnPrice ? `￥${actualReturnPrice.toFixed(2)}` : '-'}
            </span>
          )}
        />
        <Column
          width="80"
          title="退款方式"
          key="payType"
          dataIndex="payType"
          render={payType => <span>{payTypeDic[payType]}</span>}
        />
        <Column
          title="退款支付渠道"
          key="payChannel"
          dataIndex="payChannel"
          render={payChannel => <span>{payChannel || '-'}</span>}
        />
        <Column
          width="10%"
          title="退款账户"
          key="returnAccountName"
          dataIndex="returnAccountName"
          render={returnAccountName => <span>{returnAccountName || '-'}</span>}
        />
        <Column
          width="80"
          title="状态"
          key="refundStatus"
          dataIndex="refundStatus"
          render={refundStatus => (
            <span>{refundOrderStatusDic[refundStatus]}</span>
          )}
        />

        <Column
          title="备注"
          key="comment"
          dataIndex="comment"
          render={comment => (
            <span>
              {comment ? (
                <Tooltip title={this._renderComment(comment)} placement="top">
                  <a href="javascript:void(0);">查看</a>
                </Tooltip>
              ) : (
                '无'
              )}
            </span>
          )}
        />
      </DataGrid>
    );
  }

  _renderComment(comment) {
    return <span>{comment}</span>;
  }

  _renderOperate(rowInfo) {
    const { refundStatus, refundId, customerId } = rowInfo;

    const { onDestory } = this.props.relaxProps;

    if (refundStatus == 0) {
      return (
        <Dropdown
          overlay={this._renderMenu(refundId, customerId)}
          trigger={['click']}
        >
          <a className="ant-dropdown-link" href="#">
            操作 <Icon type="down" />
          </a>
        </Dropdown>
      );
    } else if (refundStatus == 2) {
      return (
        <a
          href="javascript:void(0);"
          onClick={() => {
            onDestory(refundId);
          }}
        >
          作废
        </a>
      );
    } else {
      return <span>{'-'}</span>;
    }
  }

  _renderMenu = (id: string, customerId: string) => {
    const { onDestory, onCreateRefund } = this.props.relaxProps;

    return (
      <Menu>
        <Menu.Item key="0">
          <a
            href="javascript:void(0);"
            onClick={() => onCreateRefund(customerId, id)}
          >
            退款
          </a>
        </Menu.Item>

        <Menu.Item key="1">
          <Popconfirm
            title="要作废当前收款么?"
            onConfirm={() => {
              onDestory(id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <a href="javascript:void(0);">拒绝退款</a>
          </Popconfirm>
        </Menu.Item>
        <Menu.Divider />
      </Menu>
    );
  };

  _renderAccountName(returnAccount) {
    const { offlineAccounts } = this.props.relaxProps;
    return offlineAccounts
      .find(offlineAccount => offlineAccount.get('accountId') == returnAccount)
      .get('bankNo');
  }
}
